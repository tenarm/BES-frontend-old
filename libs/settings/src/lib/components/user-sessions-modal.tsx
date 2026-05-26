import React from 'react';
import { Modal, Skeleton, Table, Button } from '@bes/shared-ui';
import { UserData, SessionData } from '../types';

interface UserSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionsUser: UserData | null;
  sessions: SessionData[];
  loadingSessions: boolean;
  onRevoke: (sessionId: string) => void;
}

export const UserSessionsModal: React.FC<UserSessionsModalProps> = ({
  isOpen,
  onClose,
  sessionsUser,
  sessions,
  loadingSessions,
  onRevoke,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Active Sessions: ${sessionsUser?.username}`}
      maxWidth="580px"
    >
      {loadingSessions ? (
        <Skeleton count={3} height={35} />
      ) : (
        <div>
          <Table>
            <thead>
              <tr>
                <th>Session Prefix</th>
                <th>Expiration Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: 20, color: 'var(--ui-gray-400)' }}>
                    No active sessions found for this user.
                  </td>
                </tr>
              ) : (
                sessions.map(s => (
                  <tr key={s.id}>
                    <td><code>{s.token_prefix}</code></td>
                    <td>{new Date(s.expires_at).toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Button variant="secondary" size="sm" onClick={() => onRevoke(s.id)}>
                        Force Logout
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Modal>
  );
};
