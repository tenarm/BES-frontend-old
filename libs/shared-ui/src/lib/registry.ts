import React from 'react';

// We store the components in a Map. The key is a string (the name of the component)
// The value is the actual React Component.
class Registry {
  private components = new Map<string, React.ComponentType<any>>();

  // Modules use this to add their components (Static Loading)
  register(name: string, component: React.ComponentType<any>) {
    if (this.components.has(name)) {
      console.warn(`Component ${name} is already registered. Overwriting.`);
    }
    this.components.set(name, component);
  }

  // Modules use this for on-demand loading (Scaling for 1000+ screens)
  registerLazy(name: string, loader: () => Promise<{ default: React.ComponentType<any> }>) {
    if (this.components.has(name)) {
      console.warn(`Component ${name} is already registered. Overwriting.`);
    }
    this.components.set(name, React.lazy(loader));
  }

  // The Shell uses this to get a specific component
  get(name: string): React.ComponentType<any> | null {
    return this.components.get(name) || null;
  }

  // The Shell uses this to get ALL components (perfect for dynamic dashboards)
  getAll(): Record<string, React.ComponentType<any>> {
    return Object.fromEntries(this.components);
  }
}

// Export a single, global instance of the registry
export const ComponentRegistry = new Registry();
