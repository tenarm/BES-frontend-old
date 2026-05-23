import React, { useEffect, useState } from 'react';
import { Button, useProcessStore } from '@bes/shared-ui';
import { useUserStore } from '../../state/user-store';
import { AlertCircle, UserCheck } from 'lucide-react';
import styles from '../user-management.module.css';

interface UserOffboardApprovalModalProps {
  onComplete: () => void;
  onClose: () => void;
}

export const UserOffboardApprovalModal: React.FC<UserOffboardApprovalModalProps> = ({
  onComplete,
  onClose
}) => {
  const { users, loadUsers } = useUserStore();
  const [reassignUserId, setReassignUserId] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Default to first user who is active and not the offboarded one
  const activeStaff = users.filter(u => u.is_active);

  useEffect(() => {
    if (activeStaff.length > 0 && !reassignUserId) {
      setReassignUserId(activeStaff[0].id);
    }
  }, [activeStaff, reassignUserId]);

  const handleConfirm = () => {
    if (!isChecked || !reassignUserId) return;
    setIsConfirming(true);

    const reassignee = activeStaff.find(u => u.id === reassignUserId);
    const reassigneeName = reassignee ? (reassignee.full_name || reassignee.username) : 'Co-worker';

    // Simulate database write operational lag (Fitts's Law Fulfillments)
    setTimeout(() => {
      // 1. Advance the golden pipeline to complete the CRM transfer step
      useProcessStore.getState().addEvent('CRM_ASSETS_TRANSFERRED', 'System Auditor', {
        reassigned_to_user_id: reassignUserId,
        reassigned_to_username: reassigneeName,
        leads_transferred: 12,
        active_pipeline_deals_transferred: 4,
        timestamp: new Date().toISOString()
      });

      // 2. Complete the modal gate
      onComplete();
      setIsConfirming(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#162867' }}>
          Operational CRM Asset Handover
        </h4>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ui-gray-500)', lineHeight: 1.5 }}>
          The user currently owns active accounts, opportunities, and is designated as the target approver on several workflow chains. You must transfer these to another team member before locking out their credentials.
        </p>
      </div>

      {/* Asset Audit Alert Banner */}
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}
      >
        <AlertCircle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#b45309' }}>
            Pending Operational Liabilities
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '12px', color: '#78350f' }}>
            <div>• Active Sales Leads: <strong>12 records</strong></div>
            <div>• Deals Pipeline: <strong>4 opportunities</strong></div>
            <div>• System Approvals: <strong>3 workflows</strong></div>
            <div>• Task Assignments: <strong>5 items</strong></div>
          </div>
        </div>
      </div>

      {/* Reassign Selector */}
      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
        <label className={styles.formLabel} style={{ fontSize: '11px' }}>Reassign Outstanding Assets To:</label>
        <select
          className={styles.select}
          value={reassignUserId}
          onChange={(e) => setReassignUserId(e.target.value)}
          disabled={isConfirming || activeStaff.length === 0}
          style={{ padding: '8px 12px', fontSize: '13px' }}
        >
          {activeStaff.length === 0 ? (
            <option value="">No active coworkers available</option>
          ) : (
            activeStaff.map(u => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.username} ({u.email})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Confirmation checkbox */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '4px 0' }}>
        <input
          type="checkbox"
          id="confirm-handover"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer' }}
          disabled={isConfirming || activeStaff.length === 0}
        />
        <label
          htmlFor="confirm-handover"
          style={{ fontSize: '12px', color: 'var(--ui-gray-600)', lineHeight: 1.4, cursor: 'pointer', userSelect: 'none' }}
        >
          I authorize the bulk reassignment of all leads and workflow steps, and I confirm deactivation details are verified.
        </label>
      </div>

      {/* Modal Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--ui-gray-200)', paddingTop: '12px', marginTop: '4px' }}>
        <Button variant="outline" size="sm" onClick={onClose} disabled={isConfirming}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleConfirm}
          disabled={!isChecked || !reassignUserId || isConfirming}
          isLoading={isConfirming}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <UserCheck size={14} /> Confirm Handover
        </Button>
      </div>
    </div>
  );
};
