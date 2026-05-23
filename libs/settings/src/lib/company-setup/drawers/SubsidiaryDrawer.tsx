import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { SlideOutDrawer, Input, Button, FeedbackAlert } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const SubsidiaryDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    drawerEntity,
    drawerMode,
    selectedEntityId,
    subsidiaries,
    conflictError,
    error,
    createSubsidiary,
    updateSubsidiary,
    closeDrawer,
    clearConflict
  } = useCompanyStore();

  const [formData, setFormData] = useState({
    name: '',
    legal_name: '',
    tax_id: '',
    parent_id: '',
    country_code: 'US',
    currency_code: 'USD',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = isDrawerOpen && drawerEntity === 'subsidiary';

  useEffect(() => {
    if (isOpen && drawerMode === 'edit' && selectedEntityId) {
      const selected = subsidiaries.find(s => s.id === selectedEntityId);
      if (selected) {
        setFormData({
          name: selected.name || '',
          legal_name: selected.legal_name || '',
          tax_id: selected.tax_id || '',
          parent_id: selected.parent_id || '',
          country_code: selected.country_code || 'US',
          currency_code: selected.currency_code || 'USD',
          status: selected.status || 'ACTIVE'
        });
      }
    } else {
      setFormData({
        name: '',
        legal_name: '',
        tax_id: '',
        parent_id: '',
        country_code: 'US',
        currency_code: 'USD',
        status: 'ACTIVE'
      });
    }
    setErrors({});
    clearConflict();
  }, [isOpen, drawerMode, selectedEntityId, subsidiaries, clearConflict]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.legal_name.trim()) newErrors.legal_name = 'Legal name is required';
    if (!formData.tax_id.trim()) newErrors.tax_id = 'Tax ID is required';
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, status: e.target.checked ? 'ACTIVE' : 'INACTIVE' }));
  };

  const handleSubmit = async (e: React.FormEvent, overwrite = false) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const parentVal = formData.parent_id === '' ? null : formData.parent_id;
      const dataToSubmit = {
        ...formData,
        parent_id: parentVal
      };

      if (drawerMode === 'create') {
        await createSubsidiary(dataToSubmit);
      } else if (selectedEntityId) {
        await updateSubsidiary(selectedEntityId, dataToSubmit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    clearConflict();
    closeDrawer();
  };

  // Exclude current subsidiary from parents to prevent cyclic graphs
  const availableParents = subsidiaries.filter(s => s.id !== selectedEntityId);

  const drawerTitle = drawerMode === 'create' ? 'Register Subsidiary' : 'Edit Subsidiary Details';

  const footer = (
    <div style={{ display: 'flex', gap: 'var(--ui-spacing-sm)' }}>
      <Button variant="outline" type="button" onClick={closeDrawer} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e, false)} isLoading={isSubmitting}>
        {drawerMode === 'create' ? 'Register Entity' : 'Save Changes'}
      </Button>
    </div>
  );

  return (
    <SlideOutDrawer isOpen={isOpen} onClose={closeDrawer} title={drawerTitle} footer={footer}>
      <form onSubmit={(e) => handleSubmit(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
        
        {conflictError && (
          <div className={styles.conflictAlert}>
            <strong>Concurrency Conflict Detected!</strong>
            <p>
              Another administrator has updated this subsidiary while you were editing. Please review the server's version below.
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
              <Button size="sm" variant="primary" onClick={(e) => handleSubmit(e, true)}>
                Overwrite Server
              </Button>
              <Button size="sm" variant="secondary" onClick={handleDiscard}>
                Discard & Refresh
              </Button>
            </div>
          </div>
        )}

        {error && (
          <FeedbackAlert variant="error" title="Action Failed">
            {error}
          </FeedbackAlert>
        )}

        <Input
          label="Subsidiary Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Acme Corp Germany"
          disabled={isSubmitting}
          required
        />

        <Input
          label="Legal Entity Name"
          name="legal_name"
          value={formData.legal_name}
          onChange={handleChange}
          error={errors.legal_name}
          placeholder="e.g. Acme Germany GmbH"
          disabled={isSubmitting}
          required
        />

        <Input
          label="Tax Registration ID / VAT"
          name="tax_id"
          value={formData.tax_id}
          onChange={handleChange}
          error={errors.tax_id}
          placeholder="e.g. DE123456789"
          disabled={isSubmitting}
          required
        />

        <div className={styles.formGroup}>
          <label className={styles.label}>Parent Entity</label>
          <select
            className={styles.select}
            name="parent_id"
            value={formData.parent_id}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="">[No Parent - Root Company]</option>
            {availableParents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name} ({parent.legal_name})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Country Jurisdiction</label>
            <select
              className={styles.select}
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="US">United States (US)</option>
              <option value="DE">Germany (DE)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="IN">India (IN)</option>
              <option value="JP">Japan (JP)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Local Ledger Currency</label>
            <select
              className={styles.select}
              name="currency_code"
              value={formData.currency_code}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-spacing-sm)', padding: 'var(--ui-spacing-xs) 0' }}>
          <input
            type="checkbox"
            id="status-toggle"
            checked={formData.status === 'ACTIVE'}
            onChange={handleStatusChange}
            disabled={isSubmitting}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="status-toggle" className={styles.label} style={{ cursor: 'pointer', select: 'none' }}>
            Entity is Active (Enabled for transaction journals)
          </label>
        </div>
      </form>
    </SlideOutDrawer>
  );
};
