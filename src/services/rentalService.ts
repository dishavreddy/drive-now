// Rental service — localStorage-backed, structured like a PostgreSQL data layer.
// Rentals store denormalized snapshots of car + customer at creation time,
// mirroring a joined view you'd return from a real API.
import type { Rental, NewRentalInput } from '@/types';
import { ApiError } from '@/types';
import { readTable, writeTable, nextId, delay } from './storage';
import { readTable as readCars } from './storage';
import { _setCarStatus } from './carService';

const KEY = 'rentals';

function daysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

export async function getRentals(): Promise<Rental[]> {
  const rentals = readTable<Rental>(KEY).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  return delay(rentals);
}

export async function createRental(input: NewRentalInput): Promise<Rental> {
  const cars = readCars<{ id: number; status: string }>('cars');
  const car = cars.find((c) => c.id === input.car_id);
  if (!car) throw new ApiError('Selected car not found', 'NOT_FOUND');
  if (car.status !== 'available') {
    throw new ApiError('That car is already rented', 'CAR_UNAVAILABLE');
  }

  const customers = readTable<{ id: number }>('customers');
  const customer = customers.find((c) => c.id === input.customer_id);
  if (!customer) throw new ApiError('Selected customer not found', 'NOT_FOUND');

  if (new Date(input.end_date) < new Date(input.start_date)) {
    throw new ApiError('End date must be after start date', 'INVALID_DATES');
  }

  const days = daysBetween(input.start_date, input.end_date);
  const fullCar = readTable<import('@/types').Car>('cars').find((c) => c.id === input.car_id)!;
  const fullCustomer = readTable<import('@/types').Customer>('customers').find((c) => c.id === input.customer_id)!;

  const rentals = readTable<Rental>(KEY);
  const rental: Rental = {
    id: nextId(rentals),
    car_id: input.car_id,
    customer_id: input.customer_id,
    car: fullCar,
    customer: fullCustomer,
    start_date: input.start_date,
    end_date: input.end_date,
    total_amount: days * fullCar.daily_rate,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  writeTable(KEY, [rental, ...rentals]);
  _setCarStatus(input.car_id, 'rented');
  return delay(rental);
}

export async function returnCar(id: number): Promise<Rental> {
  const rentals = readTable<Rental>(KEY);
  const idx = rentals.findIndex((r) => r.id === id);
  if (idx === -1) throw new ApiError('Rental not found', 'NOT_FOUND');
  if (rentals[idx].status === 'returned') {
    throw new ApiError('Car already returned', 'ALREADY_RETURNED');
  }

  const updated: Rental = { ...rentals[idx], status: 'returned' };
  rentals[idx] = updated;
  writeTable(KEY, rentals);
  _setCarStatus(updated.car_id, 'available');
  return delay(updated);
}

export { daysBetween };
