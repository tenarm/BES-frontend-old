import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Sliders, 
  GitBranch, 
  ShieldCheck, 
  BellRing
} from 'lucide-react';
import { Button, Skeleton } from '@bes/shared-ui';
import styles from './settings-home.module.css';

export const SettingsHomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch for settings metadata
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const settingsCards = [
    {
      title: 'Company Profile',
      description: 'Configure corporate address, legal name, tax identifiers, fiscal calendar, and localization defaults.',
      icon: <Building2 size={24} />,
      link: '#company'
    },
    {
      title: 'User Management',
      description: 'Invite team members, assign granular security roles, manage team divisions, and track user statuses.',
      icon: <Users size={24} />,
      link: '#users'
    },
    {
      title: 'Workflow Pipelines',
      description: 'Customize the default business flows (Sell, Buy, Stock) by adding approval chains, notifications, or custom steps.',
      icon: <GitBranch size={24} />,
      link: '#pipelines'
    },
    {
      title: 'Access Control (RBAC)',
      description: 'Define specific permission policy matrices, create custom roles, and audit security events.',
      icon: <ShieldCheck size={24} />,
      link: '#rbac'
    },
    {
      title: 'Notification Rules',
      description: 'Configure default Jinja2 templates, subscribe to specific event payloads, and customize channels (SSE, Email).',
      icon: <BellRing size={24} />,
      link: '#notifications'
    },
    {
      title: 'General Preferences',
      description: 'Manage numbering sequences, system themes, default currency formatting, and platform integration defaults.',
      icon: <Sliders size={24} />,
      link: '#preferences'
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>System Settings</h2>
          <p className={styles.subtitle}>Configure global enterprise resources, security rules, and business pipeline customizations.</p>
        </div>
        <Button variant="primary" size="sm">
          Save Changes
        </Button>
      </header>

      {loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton height="180px" />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {settingsCards.map((card, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  {card.icon}
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
              </div>
              <p className={styles.cardDescription}>{card.description}</p>
              <div className={styles.cardFooter}>
                <Button variant="outline" size="sm">
                  Configure →
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
