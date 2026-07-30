// Dashboard service — aggregates stats from the other tables.
import type { DashboardStats } from '@/types';
import { readTable } from './storage';
import type { Car, Rental } from '@/types';
import { delay } from './storage';

export async function getStats(): Promise<DashboardStats> {
  const cars = readTable<Car>('cars');
  const rentals = readTable<Rental>('rentals');

  const stats: DashboardStats = {
    total_cars: cars.length,
    available_cars: cars.filter((c) => c.status === 'available').length,
    rented_cars: cars.filter((c) => c.status === 'rented').length,
    active_rentals: rentals.filter((r) => r.status === 'active').length,
    total_revenue: rentals
      .filter((r) => r.status === 'returned')
      .reduce((sum, r) => sum + r.total_amount, 0),
  };

  return delay(stats);
}
