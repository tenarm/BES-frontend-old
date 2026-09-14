import React from 'react';
import { TabGroup, TabList, Tab, TabPanels, TabPanel, PremiumLockIndicator } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

export const TabsShowcase = () => {
  return (
    <div>
      <PageHeader
        title="Tabs"
        description="Tabs organize content into separate, toggleable panels to optimize screen space and maintain persistent context."
        badge="Shared UI"
      />

      <ShowcaseSection
        title="Basic Tabs"
        description="A simple, clean tab layout for dividing content sections in a single screen."
      >
        <ShowcaseDemo title="Standard Tab List Navigation">
          <TabGroup defaultIndex={0}>
            <TabList>
              <Tab>General Info</Tab>
              <Tab>Billing Address</Tab>
              <Tab>Shipping Address</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div style={{ padding: '12px 4px', color: 'var(--ui-gray-700)' }}>
                  <h4>General Profile details</h4>
                  <p>This panel displays company legal credentials, tax registrations, and contact email setups.</p>
                </div>
              </TabPanel>
              <TabPanel>
                <div style={{ padding: '12px 4px', color: 'var(--ui-gray-700)' }}>
                  <h4>Billing Directory</h4>
                  <p>123 Financial District Way, Suite 400, London, UK.</p>
                </div>
              </TabPanel>
              <TabPanel>
                <div style={{ padding: '12px 4px', color: 'var(--ui-gray-700)' }}>
                  <h4>Shipping Hubs</h4>
                  <p>West Warehouse Gate 3, Birmingham, UK.</p>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        title="Premium Gated Tabs"
        description="Disabled tabs or locked tabs indicating features restricted to higher plan tiers."
      >
        <ShowcaseDemo title="Tabs with Lock Indicators">
          <TabGroup defaultIndex={0}>
            <TabList>
              <Tab>Profile</Tab>
              <Tab>Subsidiaries <PremiumLockIndicator /></Tab>
              <Tab>Fiscal Calendars <PremiumLockIndicator /></Tab>
              <Tab disabled>System Config (Disabled)</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div style={{ padding: '12px 4px', color: 'var(--ui-gray-700)' }}>
                  <h4>Base profile details</h4>
                  <p>This is the standard company profile tab available on the Basic package.</p>
                </div>
              </TabPanel>
              <TabPanel>
                {/* Normally blocked by route guard/overlay */}
                <div style={{ padding: '12px 4px', color: 'var(--ui-gray-700)' }}>
                  <h4>Subsidiary Map</h4>
                  <p> Германии, UK, USA divisions.</p>
                </div>
              </TabPanel>
              <TabPanel>
                <div style={{ padding: '12px 4px', color: 'var(--ui-gray-700)' }}>
                  <h4>Fiscal Periods</h4>
                  <p>Locked / Unlocked period listings.</p>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { TabGroup, TabList, Tab, TabPanels, TabPanel, PremiumLockIndicator } from '@bes/shared-ui';

<TabGroup defaultIndex={0} onChange={(idx) => console.log('Tab changed:', idx)}>
  <TabList>
    <Tab>Profile</Tab>
    <Tab>Billing</Tab>
    <Tab>
      Subsidiaries <PremiumLockIndicator />
    </Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Profile Content</TabPanel>
    <TabPanel>Billing Content</TabPanel>
    <TabPanel>Subsidiary Content</TabPanel>
  </TabPanels>
</TabGroup>`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference (TabGroup)">
        <PropsTable props={[
          { name: 'defaultIndex', type: 'number', default: '0', description: 'The index of the tab selected by default on initial mount.' },
          { name: 'selectedIndex', type: 'number', default: 'undefined', description: 'Active tab index when managing selected tab as a controlled state.' },
          { name: 'onChange', type: '(index: number) => void', default: 'undefined', description: 'Callback fired when the active tab changes.' },
          { name: 'children', type: 'ReactNode', required: true, description: 'Content containing TabList and TabPanels.' },
        ]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference (Tab)">
        <PropsTable props={[
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables clicking the tab.' },
          { name: 'children', type: 'ReactNode', required: true, description: 'Tab title content (supports icons and indicator badges).' },
          { name: 'className', type: 'string', default: 'undefined', description: 'Additional CSS classes.' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
