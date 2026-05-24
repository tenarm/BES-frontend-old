import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { Card, CardHeader, CardTitle, CardBody, Input, Button, FeedbackAlert } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const ProfileTab: React.FC = () => {
  const {
    profile,
    isLoading,
    conflictError,
    error,
    loadProfile,
    saveProfile,
    clearConflict,
    clearError
  } = useCompanyStore();

  const [formData, setFormData] = useState({
    name: '',
    legal_name: '',
    registration_id: '',
    timezone: 'UTC',
    base_currency: 'USD',
    date_format: 'YYYY-MM-DD',
    number_format: '#,##0.00',
    logo_light_url: '',
    logo_dark_url: '',
    primary_brand_color: '#162867'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        legal_name: profile.legal_name || '',
        registration_id: profile.registration_id || '',
        timezone: profile.timezone || 'UTC',
        base_currency: profile.base_currency || 'USD',
        date_format: profile.date_format || 'YYYY-MM-DD',
        number_format: profile.number_format || '#,##0.00',
        logo_light_url: profile.logo_light_url || '',
        logo_dark_url: profile.logo_dark_url || '',
        primary_brand_color: profile.primary_brand_color || '#162867'
      });
    }
  }, [profile]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.legal_name.trim()) newErrors.legal_name = 'Legal name is required';
    if (!formData.registration_id.trim()) newErrors.registration_id = 'Registration ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSave = async (overwrite = false) => {
    if (!validate()) return;
    try {
      setSaveSuccess(false);
      await saveProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Profile save error', e);
    }
  };

  const handleDiscard = () => {
    clearConflict();
    loadProfile();
  };

  return (
    <div className={styles.sectionCard} style={{ gap: 'var(--ui-spacing-lg)' }}>
      {conflictError && (
        <div className={styles.conflictAlert}>
          <strong>Concurrency Conflict Detected!</strong>
          <p>
            Another administrator has updated this company profile while you were editing. Please review the server's version below.
          </p>
          <div className={styles.conflictDiffGrid}>
            <div className={styles.conflictCol}>
              <span className={styles.conflictTitle}>Your Local Changes</span>
              {conflictError.field_diffs.map((field) => (
                <div key={field}>
                  <strong>{field}:</strong> {String((formData as any)[field] || '—')}
                </div>
              ))}
            </div>
            <div className={styles.conflictCol}>
              <span className={styles.conflictTitle}>Server Active Version</span>
              {conflictError.field_diffs.map((field) => (
                <div key={field}>
                  <strong>{field}:</strong> {String(conflictError.server_version[field] || '—')}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--ui-spacing-sm)', marginTop: 'var(--ui-spacing-xs)' }}>
            <Button size="sm" variant="primary" onClick={() => handleSave(true)}>
              Overwrite Server
            </Button>
            <Button size="sm" variant="secondary" onClick={handleDiscard}>
              Discard & Refresh
            </Button>
          </div>
        </div>
      )}

      {error && (
        <FeedbackAlert variant="error" title="Error Saving Changes">
          {error}
        </FeedbackAlert>
      )}

      {saveSuccess && (
        <FeedbackAlert variant="success" title="Success">
          Company settings saved successfully.
        </FeedbackAlert>
      )}

      <Card title="General Identity" subtitle="Configure primary corporate registration and trade names.">
        <div className={styles.grid3}>
          <Input
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            disabled={isLoading}
          />
          <Input
            label="Legal Name"
            name="legal_name"
            value={formData.legal_name}
            onChange={handleChange}
            error={errors.legal_name}
            disabled={isLoading}
          />
          <Input
            label="Registration ID"
            name="registration_id"
            value={formData.registration_id}
            onChange={handleChange}
            error={errors.registration_id}
            disabled={isLoading}
          />
        </div>
      </Card>

      <Card title="Localization Preferences" subtitle="System-wide defaults for dates, currencies, and clocks.">
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Default Timezone</label>
            <select
              className={styles.select}
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="UTC">UTC (GMT+0)</option>
              <option value="EST">US Eastern Standard Time (GMT-5)</option>
              <option value="PST">US Pacific Standard Time (GMT-8)</option>
              <option value="IST">India Standard Time (GMT+5:30)</option>
              <option value="CET">Central European Time (GMT+1)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Base Currency</label>
            <select
              className={styles.select}
              name="base_currency"
              value={formData.base_currency}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="USD">USD - United States Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="INR">INR - Indian Rupee (₹)</option>
              <option value="JPY">JPY - Japanese Yen (¥)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Date Format</label>
            <select
              className={styles.select}
              name="date_format"
              value={formData.date_format}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-05-23)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 23/05/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 05/23/2026)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Number & Precision Format</label>
            <select
              className={styles.select}
              name="number_format"
              value={formData.number_format}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="#,##0.00">1,234,567.89 (Standard - 2 decimals)</option>
              <option value="#,##0.0000">1,234,567.8900 (Money Rule - 4 decimals)</option>
              <option value="#.##0,00">1.234.567,89 (European Style)</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Brand Styling" subtitle="Customize company logos and accents for client-facing PDF documents.">
        <div className={styles.grid3}>
          <Input
            label="Light Mode Logo URL"
            name="logo_light_url"
            value={formData.logo_light_url}
            onChange={handleChange}
            placeholder="https://example.com/logo-light.png"
            disabled={isLoading}
          />
          <Input
            label="Dark Mode Logo URL"
            name="logo_dark_url"
            value={formData.logo_dark_url}
            onChange={handleChange}
            placeholder="https://example.com/logo-dark.png"
            disabled={isLoading}
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Accent Brand Color</label>
            <div style={{ display: 'flex', gap: 'var(--ui-spacing-sm)', alignItems: 'center' }}>
              <input
                type="color"
                name="primary_brand_color"
                value={formData.primary_brand_color}
                onChange={handleChange}
                style={{
                  border: '1px solid var(--ui-border)',
                  padding: 0,
                  width: '36px',
                  height: '32px',
                  borderRadius: 'var(--ui-radius-sm)',
                  cursor: 'pointer'
                }}
                disabled={isLoading}
              />
              <span className={styles.label} style={{ fontFamily: 'var(--ui-font-mono)' }}>
                {formData.primary_brand_color}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className={styles.stickyFooter}>
        <Button variant="primary" onClick={() => handleSave(false)} isLoading={isLoading}>
          Save Identity Changes
        </Button>
      </div>
    </div>
  );
};
