import React from 'react';
import { ComponentRegistry } from '@bes/shared-ui';

export function Dashboard() {
  // 1. Get ALL registered widgets from the phonebook
  const registeredWidgets = ComponentRegistry.getAll();

  // Filter out just the widgets (assuming we named them starting with "Widget_")
  const widgetNames = Object.keys(registeredWidgets).filter(name => name.startsWith('Widget_'));
  console.log(widgetNames);

  return (
    <div className="dashboard-grid">
      <h1>BES Dashboard</h1>

      {widgetNames.length === 0 && <p>No modules are currently active.</p>}

      {/* 2. Dynamically render whichever widgets exist */}
      {widgetNames.map((widgetName) => {
        const WidgetComponent = registeredWidgets[widgetName];

        return (
          <div key={widgetName} className="widget-card">
            {/* We render the component dynamically! */}
            <WidgetComponent />
          </div>
        );
      })}
    </div>
  );
}
