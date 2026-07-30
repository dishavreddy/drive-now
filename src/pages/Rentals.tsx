import { useMemo, useState, type FormEvent } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import Table, { type Column } from '@/components/Table';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRentals } from '@/hooks/useRentals';
import { useCars } from '@/hooks/useCars';
import { useCustomers } from '@/hooks/useCustomers';
import { daysBetween } from '@/services/rentalService';
import type { Rental } from '@/types';

function formatRupee(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface FormState {
  car_id: string;
  customer_id: string;
  start_date: string;
  end_date: string;
}

const emptyForm: FormState = { car_id: '', customer_id: '', start_date: '', end_date: '' };

interface FormErrors {
  car_id?: string;
  customer_id?: string;
  start_date?: string;
  end_date?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.car_id) errors.car_id = 'Select a car';
  if (!form.customer_id) errors.customer_id = 'Select a customer';
  if (!form.start_date) errors.start_date = 'Start date is required';
  if (!form.end_date) errors.end_date = 'End date is required';
  if (form.start_date && form.end_date && new Date(form.end_date) < new Date(form.start_date)) {
    errors.end_date = 'End date must be after start date';
  }
  return errors;
}

export default function Rentals() {
  const { rentals, loading, createRental, returnCar } = useRentals();
  const { cars } = useCars();
  const { customers } = useCustomers();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmReturn, setConfirmReturn] = useState<Rental | null>(null);

  const availableCars = useMemo(() => cars.filter((c) => c.status === 'available'), [cars]);

  const liveTotal = useMemo(() => {
    if (!form.car_id || !form.start_date || !form.end_date) return null;
    const car = cars.find((c) => c.id === Number(form.car_id));
    if (!car) return null;
    const days = daysBetween(form.start_date, form.end_date);
    return { days, total: days * car.daily_rate };
  }, [form, cars]);

  const openAdd = () => {
    setForm(emptyForm);
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
      await createRental({
        car_id: Number(form.car_id),
        customer_id: Number(form.customer_id),
        start_date: form.start_date,
        end_date: form.end_date,
      });
      setModalOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create rental');
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = async () => {
    if (!confirmReturn) return;
    try {
      await returnCar(confirmReturn.id);
      setConfirmReturn(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to return car');
    }
  };

  const columns: Column<Rental>[] = [
    { key: 'car', header: 'Car', render: (r) => <span className="font-medium">{r.car.make} {r.car.model}</span> },
    { key: 'customer', header: 'Customer', render: (r) => r.customer.name },
    { key: 'start', header: 'Start', render: (r) => <span className="text-gray-600">{formatDate(r.start_date)}</span> },
    { key: 'end', header: 'End', render: (r) => <span className="text-gray-600">{formatDate(r.end_date)}</span> },
    { key: 'days', header: 'Days', render: (r) => daysBetween(r.start_date, r.end_date) },
    { key: 'amount', header: 'Amount', render: (r) => <span className="font-medium">{formatRupee(r.total_amount)}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'success' : 'default'}>{r.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) =>
        r.status === 'active' ? (
          <Button variant="outlined" onClick={() => setConfirmReturn(r)} className="gap-1.5 !px-3 !py-1.5 text-xs">
            <RotateCcw size={13} /> Return
          </Button>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
  ];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="mx-auto max-w-container px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Rentals</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage all rentals.</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus size={16} /> Rent Car
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading rentals..." />
      ) : (
        <Table
          columns={columns}
          data={rentals}
          rowKey={(r) => r.id}
          empty={
            <EmptyState
              title="No rentals yet"
              message="Create your first rental to get started."
              action={<Button onClick={openAdd} className="gap-1.5"><Plus size={16} /> Rent Car</Button>}
            />
          }
        />
      )}

      {/* Rent car modal */}
      <Modal
        open={modalOpen}
        title="Rent a Car"
        description="Select an available car and a customer."
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit as unknown as () => void} disabled={saving}>
              {saving ? 'Creating...' : 'Create Rental'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Car</label>
            <select className="input-field" value={form.car_id} onChange={(e) => setForm({ ...form, car_id: e.target.value })}>
              <option value="">Select a car...</option>
              {availableCars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.make} {c.model} — {c.plate} ({formatRupee(c.daily_rate)}/day)
                </option>
              ))}
            </select>
            {errors.car_id && <p className="mt-1 text-xs text-red-600">{errors.car_id}</p>}
            {availableCars.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">No cars are currently available.</p>
            )}
          </div>

          <div>
            <label className="label-field">Customer</label>
            <select className="input-field" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
              ))}
            </select>
            {errors.customer_id && <p className="mt-1 text-xs text-red-600">{errors.customer_id}</p>}
            {customers.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">Add a customer first.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Start Date</label>
              <input type="date" min={today} className="input-field" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              {errors.start_date && <p className="mt-1 text-xs text-red-600">{errors.start_date}</p>}
            </div>
            <div>
              <label className="label-field">End Date</label>
              <input type="date" min={form.start_date || today} className="input-field" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              {errors.end_date && <p className="mt-1 text-xs text-red-600">{errors.end_date}</p>}
            </div>
          </div>

          {liveTotal && (
            <div className="rounded border border-brand-green bg-brand-greenSoft px-4 py-3 text-sm">
              <span className="font-semibold text-brand-green">Total: {formatRupee(liveTotal.total)}</span>
              <span className="text-gray-600"> for {liveTotal.days} {liveTotal.days === 1 ? 'day' : 'days'}</span>
            </div>
          )}

          {submitError && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</p>}
        </form>
      </Modal>

      {/* Return confirm */}
      <Modal
        open={confirmReturn !== null}
        title="Return Car"
        onClose={() => setConfirmReturn(null)}
        footer={
          <>
            <Button variant="outlined" onClick={() => setConfirmReturn(null)}>Cancel</Button>
            <Button onClick={handleReturn}>Confirm Return</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Mark <span className="font-medium text-black">{confirmReturn?.car.make} {confirmReturn?.car.model}</span> as returned? It will become available again in your fleet.
        </p>
      </Modal>
    </div>
  );
}
