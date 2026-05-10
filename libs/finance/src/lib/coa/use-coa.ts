import { useState, useEffect, useCallback } from 'react';
import { Account } from './types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const useCOA = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/finance/accounts`);
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const result = await response.json();
      setAccounts(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = async (data: Partial<Account>) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/finance/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Failed to create account');
      await fetchAccounts();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { accounts, loading, error, createAccount, refresh: fetchAccounts };
};
