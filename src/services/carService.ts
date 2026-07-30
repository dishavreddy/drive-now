// Car service — localStorage-backed, structured like a PostgreSQL data layer.
import type { Car, NewCar } from '@/types';
import { ApiError } from '@/types';
import { readTable, writeTable, nextId, delay } from './storage';

const KEY = 'cars';

export async function getCars(): Promise<Car[]> {
  const cars = readTable<Car>(KEY).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  return delay(cars);
}

export async function getAvailableCars(): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter((c) => c.status === 'available');
}

export async function addCar(input: NewCar): Promise<Car> {
  const cars = readTable<Car>(KEY);

  if (cars.some((c) => c.plate.toLowerCase() === input.plate.toLowerCase())) {
    throw new ApiError('A car with this plate already exists', 'DUPLICATE_PLATE');
  }

  const car: Car = {
    ...input,
    id: nextId(cars),
    status: 'available',
    created_at: new Date().toISOString(),
  };
  writeTable(KEY, [car, ...cars]);
  return delay(car);
}

export async function updateCar(id: number, data: Partial<Car>): Promise<Car> {
  const cars = readTable<Car>(KEY);
  const idx = cars.findIndex((c) => c.id === id);
  if (idx === -1) throw new ApiError('Car not found', 'NOT_FOUND');

  if (data.plate && cars.some((c) => c.id !== id && c.plate.toLowerCase() === data.plate!.toLowerCase())) {
    throw new ApiError('A car with this plate already exists', 'DUPLICATE_PLATE');
  }

  const updated: Car = { ...cars[idx], ...data, id };
  cars[idx] = updated;
  writeTable(KEY, cars);
  return delay(updated);
}

export async function deleteCar(id: number): Promise<void> {
  const cars = readTable<Car>(KEY).filter((c) => c.id !== id);
  writeTable(KEY, cars);
  return delay(undefined);
}

// Internal helper used by rentalService to flip status without going through UI.
export function _setCarStatus(id: number, status: Car['status']): void {
  const cars = readTable<Car>(KEY);
  const idx = cars.findIndex((c) => c.id === id);
  if (idx !== -1) {
    cars[idx] = { ...cars[idx], status };
    writeTable(KEY, cars);
  }
}
