import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { SlideOutDrawer, Input, Button, FeedbackAlert } from '@bes/shared-ui';

export const FiscalYearDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    drawerEntity,
    drawerMode,
    error,
    createFiscalYear,
    closeDrawer
  } = useCompanyStore();

  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = isDrawerOpen && drawerEntity === 'fiscalYear';

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        start_date: '',
        end_date: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Calendar name is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end <= start) {
        newErrors.end_date = 'End date must be after the start date';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await createFiscalYear(formData);
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
        Setup Calendar
      </Button>
    </div>
  );

  return (
    <SlideOutDrawer isOpen={isOpen} onClose={closeDrawer} title="Setup Fiscal Calendar" footer={footer}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
        
        {error && (
          <FeedbackAlert variant="error" title="Setup Failed">
            {error}
          </FeedbackAlert>
        )}

        <Input
          label="Fiscal Year Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. FY 2026 (Jan - Dec)"
          disabled={isSubmitting}
          required
        />

        <Input
          label="Start Date"
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          error={errors.start_date}
          disabled={isSubmitting}
          required
        />

        <Input
          label="End Date"
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          error={errors.end_date}
          disabled={isSubmitting}
          required
        />
      </form>
    </SlideOutDrawer>
  );
};
