// Customer service — localStorage-backed, structured like a PostgreSQL data layer.
import type { Customer, NewCustomer } from '@/types';
import { ApiError } from '@/types';
import { readTable, writeTable, nextId, delay } from './storage';

const KEY = 'customers';

export async function getCustomers(): Promise<Customer[]> {
  const customers = readTable<Customer>(KEY).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  return delay(customers);
}

export async function addCustomer(input: NewCustomer): Promise<Customer> {
  const customers = readTable<Customer>(KEY);

  if (customers.some((c) => c.email.toLowerCase() === input.email.toLowerCase())) {
    throw new ApiError('A customer with this email already exists', 'DUPLICATE_EMAIL');
  }

  const customer: Customer = {
    ...input,
    id: nextId(customers),
    created_at: new Date().toISOString(),
  };
  writeTable(KEY, [customer, ...customers]);
  return delay(customer);
}

export async function deleteCustomer(id: number): Promise<void> {
  const customers = readTable<Customer>(KEY).filter((c) => c.id !== id);
  writeTable(KEY, customers);
  return delay(undefined);
}
