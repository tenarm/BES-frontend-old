import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsHomePage } from './settings-home';

describe('SettingsHomePage', () => {
  it('renders the loading skeleton initially', () => {
    render(<SettingsHomePage />);
    // Since there are 6 skeleton cards during loading
    const skeletons = document.querySelectorAll('.loading-skeleton, [style*="height"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders the header title and setting cards after loading', async () => {
    render(<SettingsHomePage />);
    
    // Wait for the loader to finish and cards to render
    await waitFor(() => {
      expect(screen.getByText('Company Profile')).toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getByText('Configure global enterprise resources, security rules, and business pipeline customizations.')).toBeInTheDocument();
    
    // Check key cards are present
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Workflow Pipelines')).toBeInTheDocument();
    expect(screen.getByText('Access Control (RBAC)')).toBeInTheDocument();
  });
});
