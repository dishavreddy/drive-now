import { useCallback, useEffect, useState } from 'react';
import type { Rental, NewRentalInput } from '@/types';
import * as rentalService from '@/services/rentalService';

interface UseRentalsResult {
  rentals: Rental[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createRental: (data: NewRentalInput) => Promise<void>;
  returnCar: (id: number) => Promise<void>;
}

export function useRentals(): UseRentalsResult {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalService.getRentals();
      setRentals(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load rentals');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRental = useCallback(async (data: NewRentalInput) => {
    const created = await rentalService.createRental(data);
    setRentals((prev) => [created, ...prev]);
  }, []);

  const returnCar = useCallback(async (id: number) => {
    const updated = await rentalService.returnCar(id);
    setRentals((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { rentals, loading, error, refresh, createRental, returnCar };
}
