import { useState, type FormEvent } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Table, { type Column } from '@/components/Table';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCars } from '@/hooks/useCars';
import type { Car, CarType, FuelType, NewCar } from '@/types';

const CAR_TYPES: CarType[] = ['Sedan', 'SUV', 'Hatchback', 'Truck', 'Van'];
const FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

function formatRupee(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

interface FormState {
  make: string;
  model: string;
  year: string;
  plate: string;
  type: CarType;
  daily_rate: string;
  seats: string;
  fuel_type: FuelType;
}

const emptyForm: FormState = {
  make: '',
  model: '',
  year: '',
  plate: '',
  type: 'Sedan',
  daily_rate: '',
  seats: '',
  fuel_type: 'Petrol',
};

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  plate?: string;
  daily_rate?: string;
  seats?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.make.trim()) errors.make = 'Make is required';
  if (!form.model.trim()) errors.model = 'Model is required';
  const year = Number(form.year);
  if (!form.year || Number.isNaN(year)) errors.year = 'Year is required';
  else if (year < 2000 || year > 2026) errors.year = 'Year must be between 2000 and 2026';
  if (!form.plate.trim()) errors.plate = 'Plate is required';
  const rate = Number(form.daily_rate);
  if (form.daily_rate === '' || Number.isNaN(rate)) errors.daily_rate = 'Daily rate is required';
  else if (rate < 0) errors.daily_rate = 'Daily rate cannot be negative';
  const seats = Number(form.seats);
  if (form.seats === '' || Number.isNaN(seats)) errors.seats = 'Seats is required';
  else if (seats < 1 || seats > 8) errors.seats = 'Seats must be between 1 and 8';
  return errors;
}

export default function Cars() {
  const { cars, loading, addCar, updateCar, deleteCar } = useCars();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Car | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Car | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEdit = (car: Car) => {
    setEditing(car);
    setForm({
      make: car.make,
      model: car.model,
      year: String(car.year),
      plate: car.plate,
      type: car.type,
      daily_rate: String(car.daily_rate),
      seats: String(car.seats),
      fuel_type: car.fuel_type,
    });
    setErrors({});
    setSubmitError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setSubmitError(null);
    try {
      const payload: NewCar = {
        make: form.make.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        plate: form.plate.trim().toUpperCase(),
        type: form.type,
        daily_rate: Number(form.daily_rate),
        seats: Number(form.seats),
        fuel_type: form.fuel_type,
      };
      if (editing) {
        await updateCar(editing.id, payload);
      } else {
        await addCar(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save car');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteCar(confirmDelete.id);
      setConfirmDelete(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to delete car');
    }
  };

  const columns: Column<Car>[] = [
    { key: 'make', header: 'Make', render: (c) => <span className="font-medium">{c.make}</span> },
    { key: 'model', header: 'Model', render: (c) => c.model },
    { key: 'year', header: 'Year', render: (c) => c.year },
    { key: 'plate', header: 'Plate', render: (c) => <span className="font-mono text-xs">{c.plate}</span> },
    { key: 'type', header: 'Type', render: (c) => c.type },
    { key: 'daily_rate', header: 'Daily Rate', render: (c) => formatRupee(c.daily_rate) },
    { key: 'seats', header: 'Seats', render: (c) => c.seats },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <Badge variant={c.status === 'available' ? 'success' : 'default'}>{c.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(c)} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black" aria-label="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={() => setConfirmDelete(c)} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-container px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Vehicles</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your fleet of cars.</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus size={16} /> Add Car
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading vehicles..." />
      ) : (
        <Table
          columns={columns}
          data={cars}
          rowKey={(c) => c.id}
          empty={
            <EmptyState
              title="No vehicles yet"
              message="Add your first car to start building your fleet."
              action={<Button onClick={openAdd} className="gap-1.5"><Plus size={16} /> Add Car</Button>}
            />
          }
        />
      )}

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        title={editing ? 'Edit Car' : 'Add Car'}
        description={editing ? 'Update this vehicle\'s details.' : 'Add a new vehicle to your fleet.'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit as unknown as () => void} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Car'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Make</label>
              <input
                className="input-field"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                placeholder="Toyota"
              />
              {errors.make && <p className="mt-1 text-xs text-red-600">{errors.make}</p>}
            </div>
            <div>
              <label className="label-field">Model</label>
              <input
                className="input-field"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Corolla"
              />
              {errors.model && <p className="mt-1 text-xs text-red-600">{errors.model}</p>}
            </div>
            <div>
              <label className="label-field">Year</label>
              <input
                type="number"
                className="input-field"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2023"
              />
              {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
            </div>
            <div>
              <label className="label-field">Plate</label>
              <input
                className="input-field"
                value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value })}
                placeholder="MH 01 AB 1234"
              />
              {errors.plate && <p className="mt-1 text-xs text-red-600">{errors.plate}</p>}
            </div>
            <div>
              <label className="label-field">Type</label>
              <select
                className="input-field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as CarType })}
              >
                {CAR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Fuel Type</label>
              <select
                className="input-field"
                value={form.fuel_type}
                onChange={(e) => setForm({ ...form, fuel_type: e.target.value as FuelType })}
              >
                {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Daily Rate (₹)</label>
              <input
                type="number"
                className="input-field"
                value={form.daily_rate}
                onChange={(e) => setForm({ ...form, daily_rate: e.target.value })}
                placeholder="2500"
              />
              {errors.daily_rate && <p className="mt-1 text-xs text-red-600">{errors.daily_rate}</p>}
            </div>
            <div>
              <label className="label-field">Seats</label>
              <input
                type="number"
                className="input-field"
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: e.target.value })}
                placeholder="5"
              />
              {errors.seats && <p className="mt-1 text-xs text-red-600">{errors.seats}</p>}
            </div>
          </div>

          {submitError && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</p>
          )}
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={confirmDelete !== null}
        title="Delete Car"
        onClose={() => setConfirmDelete(null)}
        footer={
          <>
            <Button variant="outlined" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-medium text-black">{confirmDelete?.make} {confirmDelete?.model}</span> ({confirmDelete?.plate})? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
