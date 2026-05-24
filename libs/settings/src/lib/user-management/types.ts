import { ApiResponse } from '../company-setup/types';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  role_id: string | null;
  allowed_subsidiary_ids: string[];
  version_id: number;
  custom_permissions?: Record<string, any> | null;
}

export interface UserInviteRequest {
  email: string;
  role_id: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role_id: string;
  token: string;
  expires_at: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  version_id: number;
  created_at: string;
}

export interface UserUpdatePayload {
  full_name?: string | null;
  role_id?: string | null;
  is_active?: boolean;
  allowed_subsidiary_ids?: string[];
  version_id: number;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, any>;
  version_id: number;
}

export interface RoleCreate {
  name: string;
  description: string;
  permissions: Record<string, any>;
}

export interface RoleUpdate {
  description: string | null;
  permissions: Record<string, any>;
  version_id: number;
}

export interface RefreshSession {
  id: string;
  token: string;
  expires_at: string;
  is_revoked: boolean;
  version_id: number;
}
