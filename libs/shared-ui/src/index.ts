import './lib/styles/design-tokens.css';

export * from './lib/shared-ui';
export { ComponentRegistry } from './lib/registry';

// Components
export * from './lib/button/button';
export * from './lib/input/input';
export * from './lib/card/card';
export * from './lib/UpgradeGateOverlay';
export * from './lib/badge/badge';
export * from './lib/badge/PremiumLockIndicator';
export * from './lib/alert/alert';
export { Alert as FeedbackAlert } from './lib/alert/alert';
export * from './lib/drawer/drawer';
export { Drawer as SlideOutDrawer } from './lib/drawer/drawer';
export * from './lib/modal/modal';
export * from './lib/avatar/avatar';
export * from './lib/skeleton/skeleton';
export * from './lib/table/table';
export * from './lib/tabs/tabs';
// Process Transparency (Timeline, ProcessPipeline, PendingAction)
export * from './lib/process';

// Layout
export * from './lib/layout/shell-layout';
export * from './lib/layout/sidebar';
export * from './lib/layout/header';

// Notifications
export * from './lib/notifications/NotificationBell';

// Utilities
export * from './lib/error-boundary';
export * from './lib/constants';
export * from './lib/rbac';

// AI Copilot Placeholder
export * from './lib/ai/AICapsule';
export * from './lib/ai/AIFloatingWindow';

