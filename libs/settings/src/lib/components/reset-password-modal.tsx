import React from 'react';
import { Modal, Button, Input } from '@bes/shared-ui';
import { Eye, EyeOff } from 'lucide-react';
import { UserData } from '../types';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetPasswordUser: UserData | null;
  newPassword: string;
  setNewPassword: (pass: string) => void;
  showNewPassword: boolean;
  setShowNewPassword: (show: boolean) => void;
  onReset: (e: React.FormEvent) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  resetPasswordUser,
  newPassword,
  setNewPassword,
  showNewPassword,
  setShowNewPassword,
  onReset,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reset Password: ${resetPasswordUser?.username}`}
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onReset}>Set New Password</Button>
        </div>
      }
    >
      <form onSubmit={onReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          <Input 
            label="New Access Password" 
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            style={{
              position: 'absolute',
              right: 12,
              top: 34,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </form>
    </Modal>
  );
};
