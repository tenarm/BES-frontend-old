import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, User } from 'lucide-react';
import { Button } from '@bes/shared-ui';
import { fetchCustomers, createCustomer } from '../api';
import type { Customer } from '../types';

interface CustomerSelectProps {
  /** The currently selected customer. */
  value: Customer | null;
  /** Called when the user picks or creates a customer. */
  onSelect: (customer: Customer) => void;
  /** Displayed below the field on credit warning. */
  creditWarning?: boolean;
}

/**
 * CustomerSelect — Searchable customer dropdown with inline Quick-Add modal.
 *
 * Reusable across: CreateQuoteStep (Sell flow), future Buy/Project flows.
 * Calls /api/v1/customers on mount; supports creating a new customer inline.
 */
export const CustomerSelect: React.FC<CustomerSelectProps> = ({
  value,
  onSelect,
  creditWarning = false,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Quick-Add form state
  const [qName, setQName] = useState('');
  const [qEmail, setQEmail] = useState('');
  const [qTaxId, setQTaxId] = useState('');
  const [qCreditLimit, setQCreditLimit] = useState('5000.0000');
  const [isSaving, setIsSaving] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCustomers().then((list) => {
      setCustomers(list);
      setIsLoading(false);
    });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.primary_email ?? '').toLowerCase().includes(query.toLowerCase())
  );

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qName.trim()) return;
    setIsSaving(true);
    try {
      const created = await createCustomer({
        name: qName.trim(),
        primary_email: qEmail || null,
        tax_id: qTaxId || null,
        credit_limit: parseFloat(qCreditLimit || '0').toFixed(4),
        outstanding_balance: '0.0000',
      });
      setCustomers((prev) => [...prev, created]);
      onSelect(created);
      setIsQuickAddOpen(false);
      setIsOpen(false);
      setQName(''); setQEmail(''); setQTaxId(''); setQCreditLimit('5000.0000');
    } catch {
      alert('Failed to create customer. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const availableCredit =
    value
      ? (
          parseFloat(value.credit_limit) - parseFloat(value.outstanding_balance)
        ).toFixed(4)
      : null;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger / Selected display */}
      <div
        id="customer-select-trigger"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select customer"
        tabIndex={0}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          border: `1px solid ${creditWarning ? 'var(--wp-warning, #f59e0b)' : 'var(--wp-stone-200)'}`,
          borderRadius: 8,
          cursor: 'pointer',
          background: 'white',
          minHeight: 44,
          transition: 'border-color 0.15s',
        }}
      >
        <User size={16} color="var(--wp-stone-400)" />
        <span style={{ flex: 1, color: value ? 'var(--wp-stone-900)' : 'var(--wp-stone-400)', fontSize: 14 }}>
          {value ? value.name : (isLoading ? 'Loading customers…' : 'Select a customer…')}
        </span>
        <Search size={14} color="var(--wp-stone-400)" />
      </div>

      {/* Credit warning */}
      {creditWarning && value && (
        <div style={{
          marginTop: 6,
          padding: '6px 10px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 6,
          fontSize: 12,
          color: '#b45309',
        }}>
          ⚠️ Credit limit warning — Available credit: ${availableCredit}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid var(--wp-stone-200)',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(28,25,23,0.12)',
            zIndex: 9980,
            maxHeight: 320,
            overflowY: 'auto',
          }}
        >
          {/* Search input */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--wp-stone-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={14} color="var(--wp-stone-400)" />
              <input
                id="customer-search-input"
                autoFocus
                placeholder="Search by name or email…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: 13, color: 'var(--wp-stone-900)', background: 'transparent',
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <X size={12} color="var(--wp-stone-400)" />
                </button>
              )}
            </div>
          </div>

          {/* Customer list */}
          {filtered.length === 0 ? (
            <div style={{ padding: '16px 14px', color: 'var(--wp-stone-400)', fontSize: 13, textAlign: 'center' }}>
              No customers found
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                role="option"
                aria-selected={value?.id === c.id}
                onClick={() => { onSelect(c); setIsOpen(false); setQuery(''); }}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  background: value?.id === c.id ? 'var(--wp-accent-muted)' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--wp-stone-50)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = value?.id === c.id ? 'var(--wp-accent-muted)' : 'transparent')}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--wp-stone-900)' }}>{c.name}</div>
                {c.primary_email && (
                  <div style={{ fontSize: 12, color: 'var(--wp-stone-400)', marginTop: 2 }}>{c.primary_email}</div>
                )}
              </div>
            ))
          )}

          {/* Quick Add button */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--wp-stone-100)' }}>
            <button
              id="customer-quick-add-btn"
              onClick={() => setIsQuickAddOpen(true)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 6, border: '1px dashed var(--wp-stone-300)',
                background: 'transparent', cursor: 'pointer', fontSize: 13,
                color: 'var(--wp-accent)', fontWeight: 500,
              }}
            >
              <Plus size={14} /> Add New Customer
            </button>
          </div>
        </div>
      )}

      {/* Quick-Add Modal */}
      {isQuickAddOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(28,25,23,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsQuickAddOpen(false); }}
        >
          <div style={{
            background: 'white', borderRadius: 14, padding: '28px 28px 24px',
            width: 440, boxShadow: '0 16px 40px rgba(28,25,23,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--wp-font-display)', fontSize: 16, color: 'var(--wp-stone-900)' }}>
                Add New Customer
              </h3>
              <button onClick={() => setIsQuickAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} color="var(--wp-stone-400)" />
              </button>
            </div>

            <form id="customer-quick-add-form" onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { id: 'qa-name', label: 'Name *', value: qName, onChange: setQName, required: true, placeholder: 'Apex Technologies Ltd.' },
                { id: 'qa-email', label: 'Email', value: qEmail, onChange: setQEmail, required: false, placeholder: 'billing@apex.com' },
                { id: 'qa-taxid', label: 'Tax ID', value: qTaxId, onChange: setQTaxId, required: false, placeholder: 'US-1234567' },
                { id: 'qa-credit', label: 'Credit Limit', value: qCreditLimit, onChange: setQCreditLimit, required: false, placeholder: '5000.0000' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ fontSize: 12, fontWeight: 600, color: 'var(--wp-stone-600)', display: 'block', marginBottom: 4 }}>
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type="text"
                    required={f.required}
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '9px 12px', borderRadius: 7,
                      border: '1px solid var(--wp-stone-200)', fontSize: 13,
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--wp-accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--wp-stone-200)')}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <Button type="button" variant="secondary" onClick={() => setIsQuickAddOpen(false)} style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving} style={{ flex: 1 }}>
                  {isSaving ? 'Creating…' : 'Create Customer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSelect;
