import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { SlideOutDrawer, Input, Button, FeedbackAlert } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const IntercompanyDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    drawerEntity,
    subsidiaries,
    error,
    createIntercompanyAccount,
    closeDrawer
  } = useCompanyStore();

  const [formData, setFormData] = useState({
    from_subsidiary_id: '',
    to_subsidiary_id: '',
    due_to_account_id: '',
    due_from_account_id: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = isDrawerOpen && drawerEntity === 'intercompany';

  useEffect(() => {
    if (isOpen) {
      setFormData({
        from_subsidiary_id: subsidiaries[0]?.id || '',
        to_subsidiary_id: subsidiaries[1]?.id || '',
        due_to_account_id: '',
        due_from_account_id: ''
      });
      setErrors({});
    }
  }, [isOpen, subsidiaries]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.from_subsidiary_id) newErrors.from_subsidiary_id = 'Origin subsidiary is required';
    if (!formData.to_subsidiary_id) newErrors.to_subsidiary_id = 'Destination subsidiary is required';
    
    if (formData.from_subsidiary_id === formData.to_subsidiary_id) {
      newErrors.to_subsidiary_id = 'Origin and destination subsidiaries must be different';
    }

    if (!formData.due_to_account_id.trim()) {
      newErrors.due_to_account_id = 'Due-To G/L account is required';
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(formData.due_to_account_id.trim())) {
      newErrors.due_to_account_id = 'Must be a valid G/L Account UUID';
    }

    if (!formData.due_from_account_id.trim()) {
      newErrors.due_from_account_id = 'Due-From G/L account is required';
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(formData.due_from_account_id.trim())) {
      newErrors.due_from_account_id = 'Must be a valid G/L Account UUID';
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await createIntercompanyAccount(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div style={{ display: 'flex', gap: 'var(--ui-spacing-sm)' }}>
      <Button variant="outline" type="button" onClick={closeDrawer} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" onClick={handleSubmit} isLoading={isSubmitting}>
        Map Accounts
      </Button>
    </div>
  );

  return (
    <SlideOutDrawer isOpen={isOpen} onClose={closeDrawer} title="Map Intercompany Accounts" footer={footer}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
        
        {error && (
          <FeedbackAlert variant="error" title="Mapping Failed">
            {error}
          </FeedbackAlert>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Origin Subsidiary (From)</label>
          <select
            className={styles.select}
            name="from_subsidiary_id"
            value={formData.from_subsidiary_id}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          >
            {subsidiaries.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({sub.currency_code})
              </option>
            ))}
          </select>
          {errors.from_subsidiary_id && <span className={styles.errorMessage}>{errors.from_subsidiary_id}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Destination Subsidiary (To)</label>
          <select
            className={styles.select}
            name="to_subsidiary_id"
            value={formData.to_subsidiary_id}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          >
            {subsidiaries.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({sub.currency_code})
              </option>
            ))}
          </select>
          {errors.to_subsidiary_id && <span className={styles.errorMessage}>{errors.to_subsidiary_id}</span>}
        </div>

        <Input
          label="Due-To G/L Account UUID"
          name="due_to_account_id"
          value={formData.due_to_account_id}
          onChange={handleChange}
          error={errors.due_to_account_id}
          placeholder="e.g. 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
          helperText="G/L control account representing accounts payable to the target subsidiary."
          disabled={isSubmitting}
          required
        />

        <Input
          label="Due-From G/L Account UUID"
          name="due_from_account_id"
          value={formData.due_from_account_id}
          onChange={handleChange}
          error={errors.due_from_account_id}
          placeholder="e.g. 2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e"
          helperText="G/L control account representing accounts receivable from the target subsidiary."
          disabled={isSubmitting}
          required
        />
      </form>
    </SlideOutDrawer>
  );
};
