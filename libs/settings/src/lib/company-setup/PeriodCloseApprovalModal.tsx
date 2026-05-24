import React, { useState } from 'react';
import { Button, useProcessStore } from '@bes/shared-ui';

interface PeriodCloseApprovalModalProps {
  onComplete: () => void;
  onClose: () => void;
}

export const PeriodCloseApprovalModal: React.FC<PeriodCloseApprovalModalProps> = ({
  onComplete,
  onClose
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    if (!isChecked) return;
    setIsConfirming(true);
    
    // Simulate slight operational lag to represent transactional writes
    setTimeout(() => {
      // 1. Add approval event to process store to advance the golden pipeline
      useProcessStore.getState().addEvent('cfo_approved', 'CFO (Approved)', {
        audit_debits_credits: 432500.00,
        files_posted: 14,
        timestamp: new Date().toISOString()
      });
      
      // 2. Resolve the approval modal gate
      onComplete();
      setIsConfirming(false);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
          Final CFO Review & Period Seal Gate
        </h4>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
          You are authorizing a hard closing lock on the selected financial posting period. This action halts all future journal postings and sub-ledger entries across all operating entities.
        </p>
      </div>

      {/* Validation Summary Card */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#475569' }}>
          Pre-closure Verification Check
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#64748b' }}>Total Debits/Credits:</span>
            <strong style={{ marginLeft: '4px', color: '#1e293b' }}>432,500.00 USD</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Unposted Vouchers:</span>
            <strong style={{ marginLeft: '4px', color: '#10b981' }}>0 (Verified)</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Attachments Verified:</span>
            <strong style={{ marginLeft: '4px', color: '#1e293b' }}>14 files</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>GL Reconciliation:</span>
            <strong style={{ marginLeft: '4px', color: '#10b981' }}>100% Balanced</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '4px 0' }}>
        <input
          type="checkbox"
          id="confirm-close"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          style={{ width: '16px', height: '16px', marginTop: '1px', cursor: 'pointer' }}
          disabled={isConfirming}
        />
        <label
          htmlFor="confirm-close"
          style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4, cursor: 'pointer', userSelect: 'none' }}
        >
          I confirm that all sub-ledgers have been fully audited, bank statements are reconciled, and I authorize the lock on this period.
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
        <Button variant="outline" size="sm" onClick={onClose} disabled={isConfirming}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleConfirm}
          disabled={!isChecked || isConfirming}
          isLoading={isConfirming}
        >
          Confirm Seal & Lock
        </Button>
      </div>
    </div>
  );
};
