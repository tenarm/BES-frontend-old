import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../state/user-store';
import { SlideOutDrawer, Input, Button, FeedbackAlert } from '@bes/shared-ui';
import styles from '../user-management.module.css';

export const UserInviteDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    drawerEntity,
    roles,
    isLoading,
    error,
    inviteUser,
    loadRoles,
    closeDrawer,
    clearError
  } = useUserStore();

  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = isDrawerOpen && drawerEntity === 'userInvite';

  useEffect(() => {
    if (isOpen) {
      loadRoles();
      setEmail('');
      setRoleId('');
      setEmailError('');
      clearError();
    }
  }, [isOpen, loadRoles, clearError]);

  // Sync first role ID when loaded
  useEffect(() => {
    if (isOpen && roles.length > 0 && !roleId) {
      setRoleId(roles[0].id);
    }
  }, [isOpen, roles, roleId]);

  const validate = () => {
    let isValid = true;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }
    return isValid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !roleId) return;

    setIsSubmitting(true);
    try {
      await inviteUser(email, roleId);
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
      <Button
        variant="primary"
        type="submit"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        disabled={!roleId}
      >
        Send Invitation Link
      </Button>
    </div>
  );

  return (
    <SlideOutDrawer isOpen={isOpen} onClose={closeDrawer} title="Invite Workspace Member" footer={footer}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
        {error && (
          <FeedbackAlert variant="error" title="Invitation Failed">
            {error}
          </FeedbackAlert>
        )}

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
          placeholder="e.g. employee@company.com"
          disabled={isSubmitting}
          required
          autoFocus
        />

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Assign Standard Role</label>
          <select
            className={styles.select}
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            disabled={isSubmitting || roles.length === 0}
          >
            {roles.length === 0 ? (
              <option value="">No roles available</option>
            ) : (
              roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))
            )}
          </select>
        </div>
      </form>
    </SlideOutDrawer>
  );
};
