// Domain types for DriveNow.
// These mirror the shape of PostgreSQL table rows, so the localStorage
// service layer can be swapped for a real backend with minimal changes.

export type CarType = 'Sedan' | 'SUV' | 'Hatchback' | 'Truck' | 'Van';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
export type CarStatus = 'available' | 'rented';
export type RentalStatus = 'active' | 'returned';

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  plate: string;
  type: CarType;
  daily_rate: number;
  seats: number;
  fuel_type: FuelType;
  status: CarStatus;
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  license_no: string;
  created_at: string;
}

export interface Rental {
  id: number;
  car_id: number;
  customer_id: number;
  car: Car;
  customer: Customer;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: RentalStatus;
  created_at: string;
}

export interface DashboardStats {
  total_cars: number;
  available_cars: number;
  rented_cars: number;
  active_rentals: number;
  total_revenue: number;
}

// Shape used when creating a new car (server assigns id/status/created_at).
export type NewCar = Omit<Car, 'id' | 'created_at' | 'status'>;
export type NewCustomer = Omit<Customer, 'id' | 'created_at'>;

export interface NewRentalInput {
  car_id: number;
  customer_id: number;
  start_date: string;
  end_date: string;
}

// Typed error so the UI can branch on `code` if needed.
export class ApiError extends Error {
  code: string;
  constructor(message: string, code = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}
