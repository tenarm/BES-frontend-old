import { create } from 'zustand';
import { ProcessDefinition, ProcessEvent, ResolvedStep, StepStatus } from './process-types';

import { resolveProcessState } from './process-engine';

interface ProcessStoreState {
  activeProcess: ProcessDefinition | null;
  processState: 'idle' | 'running' | 'waiting' | 'failed' | 'completed';
  events: ProcessEvent[];
  errorDetails: { message: string; details?: string } | null;
  acknowledged: boolean;
  isRightPanelOpen: boolean;
  activeModalComponent: string | null;
  activeModalStepId: string | null;

  loadedProcesses: Record<string, ProcessDefinition>;

  // Actions
  loadModuleProcesses: (moduleName: string) => Promise<void>;
  startProcess: (processId: string) => Promise<void>;
  addEvent: (eventKey: string, actor?: string, metadata?: Record<string, unknown>) => void;
  triggerApprovalModal: (stepId: string, componentName: string) => void;
  closeApprovalModal: () => void;
  failProcess: (message: string, details?: string) => void;
  acknowledgeAndClose: () => void;
  setRightPanelOpen: (open: boolean) => void;
  getResolvedSteps: () => ResolvedStep[];
}

let mockTimer: NodeJS.Timeout | null = null;

export const useProcessStore = create<ProcessStoreState>((set, get) => ({
  activeProcess: null,
  processState: 'idle',
  events: [],
  errorDetails: null,
  acknowledged: false,
  isRightPanelOpen: false,
  activeModalComponent: null,
  activeModalStepId: null,
  loadedProcesses: {},

  loadModuleProcesses: async (moduleName) => {
    const cacheKey = `bes_module_procs_${moduleName}`;
    const cached = sessionStorage.getItem(cacheKey);

    // 1. First paint from session storage cache
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Record<string, ProcessDefinition>;
        set((state) => ({
          loadedProcesses: { ...state.loadedProcesses, ...parsed }
        }));
      } catch (e) {
        console.error('Failed to parse cached module processes', e);
      }
    }

    // 2. Fetch from backend to ensure freshness
    try {
      const token = localStorage.getItem('bes_token');
      const res = await fetch(`/api/v1/audit/processes?module=${moduleName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.status === 'success' && payload.data) {
          const fetchedProcs = payload.data as Record<string, ProcessDefinition>;
          sessionStorage.setItem(cacheKey, JSON.stringify(fetchedProcs));
          
          set((state) => ({
            loadedProcesses: { ...state.loadedProcesses, ...fetchedProcs }
          }));
        }
      }
    } catch (e) {
      console.warn(`Could not load process definitions for module ${moduleName}.`, e);
    }
  },

  startProcess: async (processId) => {
    // Clear any existing running simulation timers
    if (mockTimer) {
      clearInterval(mockTimer);
      mockTimer = null;
    }

    // 1. Lookup in loadedProcesses state
    let definition = get().loadedProcesses[processId] || null;

    // 2. Lookup in all sessionStorage keys (e.g. module-specific caches)
    if (!definition) {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('bes_module_procs_') || key === `bes_proc_${processId}`)) {
          try {
            const data = JSON.parse(sessionStorage.getItem(key) || '{}');
            if (key.startsWith('bes_module_procs_')) {
              if (data[processId]) {
                definition = data[processId];
                break;
              }
            } else {
              definition = data;
              break;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    // Set first paint immediately if found in cache
    if (definition) {
      set({
        activeProcess: definition,
        processState: 'running',
        events: [],
        errorDetails: null,
        acknowledged: false,
        activeModalComponent: null,
        activeModalStepId: null,
      });
    }

    // 3. Fallback: Fetch directly from backend if not found anywhere
    if (!definition) {
      try {
        const token = localStorage.getItem('bes_token');
        const res = await fetch(`/api/v1/audit/processes/${processId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const payload = await res.json();
          if (payload.status === 'success' && payload.data) {
            definition = payload.data;
            sessionStorage.setItem(`bes_proc_${processId}`, JSON.stringify(definition));
            set({ activeProcess: definition });
          }
        }
      } catch (e) {
        console.warn(`Could not fetch fallback process definition for ${processId} from backend.`, e);
      }
    }



    if (!definition) {
      console.error(`Process definition for "${processId}" not found anywhere.`);
      return;
    }

    // Ensure state resolves to definition
    if (get().activeProcess?.processId !== definition.processId) {
      set({
        activeProcess: definition,
        processState: 'running',
        events: [],
        errorDetails: null,
        acknowledged: false,
        activeModalComponent: null,
        activeModalStepId: null,
      });
    }

    // Start Real-Time SSE Simulation
    const runSimulation = () => {
      mockTimer = setInterval(() => {
        const { activeProcess, events, processState } = get();
        if (!activeProcess || processState === 'failed' || processState === 'completed') {
          if (mockTimer) clearInterval(mockTimer);
          return;
        }

        const steps = resolveProcessState(activeProcess, events);
        const activeStep = steps.find((s) => s.status === 'active' || s.status === 'waiting_approval');

        if (!activeStep) {
          // No active/waiting steps means everything is completed
          set({ processState: 'completed' });
          if (mockTimer) clearInterval(mockTimer);
          return;
        }

        // Handle auto-sequences
        if (activeStep.type === 'sequence') {
          // Simulate backend process running
          setTimeout(() => {
            get().addEvent(activeStep.statusEvent, 'System Engine', { simulated: true });
          }, 1000);

          // Mark state as running to show spinning states
          set({ processState: 'running' });
        } else if (activeStep.type === 'approval') {
          // Pause simulation at approval gates to wait for user interaction
          set({ processState: 'waiting' });
          if (mockTimer) clearInterval(mockTimer);
        } else if (activeStep.type === 'direct') {
          // Direct steps are usually manual inputs, wait for external triggers
          set({ processState: 'waiting' });
          if (mockTimer) clearInterval(mockTimer);
        }
      }, 1200);
    };

    // For GL Entry, simulate immediate Step 1 completion
    if (processId === 'GL_ENTRY_CREATION') {
      setTimeout(() => {
        get().addEvent('gl_created', 'John Doe (Finance)', { amount: 24500 });
        runSimulation();
      }, 800);
    } else {
      runSimulation();
    }
  },

  addEvent: (eventKey, actor = 'System', metadata) => {
    const newEvent: ProcessEvent = {
      eventKey,
      occurredAt: new Date().toISOString(),
      actor,
      actorType: actor.includes('System') ? 'system' : 'user',
      metadata,
    };

    set((state) => {
      const updatedEvents = [...state.events, newEvent];
      const steps = resolveProcessState(state.activeProcess!, updatedEvents);
      const allCompleted = steps.every((s) => s.status === 'completed');

      return {
        events: updatedEvents,
        processState: allCompleted ? 'completed' : 'running',
      };
    });

    // Resume simulation loop after completing a manual/approval step
    const { activeProcess, processState } = get();
    if (activeProcess && processState === 'running') {
      if (mockTimer) clearInterval(mockTimer);
      
      mockTimer = setInterval(() => {
        const { activeProcess: proc, events: evs, processState: st } = get();
        if (!proc || st === 'failed' || st === 'completed') {
          if (mockTimer) clearInterval(mockTimer);
          return;
        }

        const steps = resolveProcessState(proc, evs);
        const activeStep = steps.find((s) => s.status === 'active' || s.status === 'waiting_approval');

        if (!activeStep) {
          set({ processState: 'completed' });
          if (mockTimer) clearInterval(mockTimer);
          return;
        }

        if (activeStep.type === 'sequence') {
          get().addEvent(activeStep.statusEvent, 'System Engine', { simulated: true });
        } else {
          set({ processState: 'waiting' });
          if (mockTimer) clearInterval(mockTimer);
        }
      }, 1200);
    }
  },

  triggerApprovalModal: (stepId, componentName) => {
    set({
      activeModalStepId: stepId,
      activeModalComponent: componentName,
    });
  },

  closeApprovalModal: () => {
    set({
      activeModalStepId: null,
      activeModalComponent: null,
    });
  },

  failProcess: (message, details) => {
    if (mockTimer) {
      clearInterval(mockTimer);
      mockTimer = null;
    }
    set({
      processState: 'failed',
      errorDetails: { message, details },
    });
  },

  acknowledgeAndClose: () => {
    if (mockTimer) {
      clearInterval(mockTimer);
      mockTimer = null;
    }
    set({
      activeProcess: null,
      processState: 'idle',
      events: [],
      errorDetails: null,
      acknowledged: true,
      activeModalComponent: null,
      activeModalStepId: null,
    });
  },

  setRightPanelOpen: (open) => {
    set({ isRightPanelOpen: open });
  },

  getResolvedSteps: () => {
    const { activeProcess, events } = get();
    if (!activeProcess) return [];
    return resolveProcessState(activeProcess, events);
  },
}));
