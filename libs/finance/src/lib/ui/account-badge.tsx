import React from 'react';
import { Badge } from '@bes/shared-ui';

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

interface AccountBadgeProps {
  type: AccountType;
  className?: string;
}

export const AccountBadge: React.FC<AccountBadgeProps> = ({ type, className }) => {
  const variantMap: Record<AccountType, 'success' | 'error' | 'primary' | 'info' | 'warning'> = {
    Asset: 'success',
    Liability: 'error',
    Equity: 'primary',
    Income: 'info',
    Expense: 'warning',
  };

  return (
    <Badge variant={variantMap[type]} className={className}>
      {type}
    </Badge>
  );
};
