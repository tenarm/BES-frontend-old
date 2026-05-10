import { AccountType } from '../ui/account-badge';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number | string;
  is_group: boolean;
  parent_id?: string | null;
}

export interface TreeRow {
  item: Account | 'new';
  level: number;
  parentId?: string | null;
}
