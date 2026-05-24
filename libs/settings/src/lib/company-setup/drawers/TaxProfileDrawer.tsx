import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { SlideOutDrawer, Input, Button, FeedbackAlert } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const TaxProfileDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    drawerEntity,
    subsidiaries,
    error,
    createTaxProfile,
    closeDrawer
  } = useCompanyStore();

  const [formData, setFormData] = useState({
    subsidiary_id: '',
    tax_authority: '',
    tax_registration_number: '',
    default_tax_rate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = isDrawerOpen && drawerEntity === 'taxProfile';

  useEffect(() => {
    if (isOpen) {
      setFormData({
        subsidiary_id: subsidiaries[0]?.id || '',
        tax_authority: '',
        tax_registration_number: '',
        default_tax_rate: '0.0000'
      });
      setErrors({});
    }
  }, [isOpen, subsidiaries]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.subsidiary_id) newErrors.subsidiary_id = 'Subsidiary selection is required';
    if (!formData.tax_authority.trim()) newErrors.tax_authority = 'Tax authority is required';
    if (!formData.tax_registration_number.trim()) newErrors.tax_registration_number = 'Tax registration ID is required';
    
    const rateVal = parseFloat(formData.default_tax_rate);
    if (isNaN(rateVal) || rateVal < 0 || rateVal > 1) {
      newErrors.default_tax_rate = 'Tax rate must be a decimal value between 0.0000 and 1.0000 (e.g. 0.1900 for 19%)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Restrict tax rate input to decimal values with maximum 4 places
    if (name === 'default_tax_rate') {
      const match = value.match(/^\d*\.?\d{0,4}$/);
      if (!match) return; // Ignore input if it doesn't match numeric max 4 decimal pattern
    }

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
      await createTaxProfile({
        subsidiary_id: formData.subsidiary_id,
        tax_authority: formData.tax_authority,
        tax_registration_number: formData.tax_registration_number,
        default_tax_rate: parseFloat(formData.default_tax_rate)
      });
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
        Register Profile
      </Button>
    </div>
  );

  return (
    <SlideOutDrawer isOpen={isOpen} onClose={closeDrawer} title="Register Tax Profile" footer={footer}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
        
        {error && (
          <FeedbackAlert variant="error" title="Registration Failed">
            {error}
          </FeedbackAlert>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Subsidiary Entity</label>
          <select
            className={styles.select}
            name="subsidiary_id"
            value={formData.subsidiary_id}
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
          {errors.subsidiary_id && <span className={styles.errorMessage}>{errors.subsidiary_id}</span>}
        </div>

        <Input
          label="Tax Authority"
          name="tax_authority"
          value={formData.tax_authority}
          onChange={handleChange}
          error={errors.tax_authority}
          placeholder="e.g. HM Revenue & Customs (HMRC)"
          disabled={isSubmitting}
          required
        />

        <Input
          label="Tax Registration Number"
          name="tax_registration_number"
          value={formData.tax_registration_number}
          onChange={handleChange}
          error={errors.tax_registration_number}
          placeholder="e.g. GB123456789"
          helperText="Format format guidance: GB123456789 for UK VAT, DE123456789 for DE, etc."
          disabled={isSubmitting}
          required
        />

        <Input
          label="Default Tax Rate"
          name="default_tax_rate"
          value={formData.default_tax_rate}
          onChange={handleChange}
          error={errors.default_tax_rate}
          placeholder="e.g. 0.2000"
          helperText="Input as decimal rate. Max 4 decimals. E.g. 0.2000 represents 20% tax rate."
          disabled={isSubmitting}
          required
        />
      </form>
    </SlideOutDrawer>
  );
};
