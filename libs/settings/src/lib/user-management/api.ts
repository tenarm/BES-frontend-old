import {
  User,
  UserInvitation,
  UserUpdatePayload,
  Role,
  RoleCreate,
  RoleUpdate,
  RefreshSession
} from './types';
import { PaginatedResponse } from '../company-setup/types';
import { ConcurrencyConflictError, PermissionError, AuthenticationError } from '../company-setup/api';

const API_BASE = '/api/v1/settings';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('bes_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    localStorage.removeItem('bes_token');
    window.location.href = '/login';
    throw new AuthenticationError();
  }
  if (res.status === 403) {
    throw new PermissionError('You do not have permission to perform this action.');
  }
  if (res.status === 409) {
    const errorData = await res.json();
    throw new ConcurrencyConflictError('Another user has updated this record. Please review the changes.', errorData);
  }
  if (!res.ok) {
    const errText = await res.text();
    let parsedErr = errText;
    try {
      const parsed = JSON.parse(errText);
      parsedErr = parsed.error || parsed.message || errText;
    } catch {
      // Ignore JSON parsing failure
    }
    throw new Error(parsedErr || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) {
    return {} as T;
  }
  const envelope = await res.json();
  return envelope.data;
}

// User Directory & Invitations
export async function fetchUsers(page = 1, pageSize = 20): Promise<PaginatedResponse<User>> {
  const res = await fetch(`${API_BASE}/users?page=${page}&page_size=${pageSize}`, {
    headers: authHeaders()
  });
  if (res.status === 401 || res.status === 403 || res.status === 409 || !res.ok) {
    return handleResponse<PaginatedResponse<User>>(res);
  }
  return res.json();
}

export async function inviteUser(email: string, roleId: string): Promise<UserInvitation> {
  const res = await fetch(`${API_BASE}/users/invite`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, role_id: roleId })
  });
  return handleResponse<UserInvitation>(res);
}

export async function updateUser(id: string, data: UserUpdatePayload): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<User>(res);
}

// Custom Roles
export async function fetchRoles(): Promise<Role[]> {
  const res = await fetch(`${API_BASE}/roles`, {
    headers: authHeaders()
  });
  return handleResponse<Role[]>(res);
}

export async function createRole(data: RoleCreate): Promise<Role> {
  const res = await fetch(`${API_BASE}/roles`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Role>(res);
}

export async function updateRole(id: string, data: RoleUpdate): Promise<Role> {
  const res = await fetch(`${API_BASE}/roles/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Role>(res);
}

// Session Revocation
export async function fetchSessions(userId: string): Promise<RefreshSession[]> {
  const res = await fetch(`${API_BASE}/users/${userId}/sessions`, {
    headers: authHeaders()
  });
  return handleResponse<RefreshSession[]>(res);
}

export async function revokeSession(tokenId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/sessions/${tokenId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  await handleResponse<void>(res);
}

// User Offboarding Deprovisioning
export async function offboardUser(userId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/users/${userId}/offboard`, {
    method: 'PUT',
    headers: authHeaders()
  });
  return handleResponse<any>(res);
}
