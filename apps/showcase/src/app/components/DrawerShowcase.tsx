import React, { useState } from 'react';
import { Drawer, Button } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';

export const DrawerShowcase = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Drawer</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Drawers slide in from the edge of the screen and are useful for complex forms or detailed views without losing the context of the current page.
      </p>

      <ShowcaseSection title="Basic Example">
        <ShowcaseDemo>
          <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
          
          <Drawer 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)} 
            title="Edit Profile"
            footer={
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setIsOpen(false)}>Save Changes</Button>
              </div>
            }
          >
            <p>This is the content of the drawer. It uses a React Portal to render at the top level of the DOM.</p>
          </Drawer>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'isOpen', type: 'boolean', description: 'Whether the drawer is currently open.' },
          { name: 'onClose', type: '() => void', description: 'Callback fired when the drawer asks to be closed.' },
          { name: 'title', type: 'string', description: 'The title displayed in the drawer header.' },
          { name: 'children', type: 'ReactNode', description: 'The main content of the drawer.' },
          { name: 'footer', type: 'ReactNode', description: 'Optional content displayed at the bottom of the drawer.' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
