import { useCallback, useEffect, useState } from 'react';
import type { Customer, NewCustomer } from '@/types';
import * as customerService from '@/services/customerService';

interface UseCustomersResult {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addCustomer: (customer: NewCustomer) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
}

export function useCustomers(): UseCustomersResult {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCustomer = useCallback(async (customer: NewCustomer) => {
    const created = await customerService.addCustomer(customer);
    setCustomers((prev) => [created, ...prev]);
  }, []);

  const deleteCustomer = useCallback(async (id: number) => {
    await customerService.deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { customers, loading, error, refresh, addCustomer, deleteCustomer };
}
