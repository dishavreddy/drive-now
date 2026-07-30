import { useCallback, useEffect, useState } from 'react';
import type { Car, NewCar } from '@/types';
import * as carService from '@/services/carService';
import { ApiError } from '@/types';

interface UseCarsResult {
  cars: Car[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addCar: (car: NewCar) => Promise<void>;
  updateCar: (id: number, data: Partial<Car>) => Promise<void>;
  deleteCar: (id: number) => Promise<void>;
}

export function useCars(): UseCarsResult {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carService.getCars();
      setCars(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCar = useCallback(async (car: NewCar) => {
    const created = await carService.addCar(car);
    setCars((prev) => [created, ...prev]);
  }, []);

  const updateCar = useCallback(async (id: number, data: Partial<Car>) => {
    const updated = await carService.updateCar(id, data);
    setCars((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const deleteCar = useCallback(async (id: number) => {
    await carService.deleteCar(id);
    setCars((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { cars, loading, error, refresh, addCar, updateCar, deleteCar };
}

export { ApiError };
