import { useState, type FormEvent } from 'react';
import { Trash2, Plus } from 'lucide-react';
import Table, { type Column } from '@/components/Table';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer, NewCustomer } from '@/types';

interface FormState {
  name: string;
  email: string;
  phone: string;
  license_no: string;
}

const emptyForm: FormState = { name: '', email: '', phone: '', license_no: '' };

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  license_no?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_REGEX.test(form.email)) errors.email = 'Enter a valid email address';
  if (!form.phone.trim()) errors.phone = 'Phone is required';
  if (!form.license_no.trim()) errors.license_no = 'License number is required';
  return errors;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Customers() {
  const { customers, loading, addCustomer, deleteCustomer } = useCustomers();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Customer | null>(null);

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
      const payload: NewCustomer = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        license_no: form.license_no.trim().toUpperCase(),
      };
      await addCustomer(payload);
      setModalOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add customer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteCustomer(confirmDelete.id);
      setConfirmDelete(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Name', render: (c) => <span className="font-medium">{c.name}</span> },
    { key: 'email', header: 'Email', render: (c) => <span className="text-gray-600">{c.email}</span> },
    { key: 'phone', header: 'Phone', render: (c) => c.phone },
    { key: 'license_no', header: 'License No', render: (c) => <span className="font-mono text-xs">{c.license_no}</span> },
    { key: 'created_at', header: 'Joined', render: (c) => <span className="text-gray-600">{formatDate(c.created_at)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <button onClick={() => setConfirmDelete(c)} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-container px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your customer records.</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus size={16} /> Add Customer
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading customers..." />
      ) : (
        <Table
          columns={columns}
          data={customers}
          rowKey={(c) => c.id}
          empty={
            <EmptyState
              title="No customers yet"
              message="Add your first customer to start creating rentals."
              action={<Button onClick={openAdd} className="gap-1.5"><Plus size={16} /> Add Customer</Button>}
            />
          }
        />
      )}

      {/* Add modal */}
      <Modal
        open={modalOpen}
        title="Add Customer"
        description="Create a new customer record."
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit as unknown as () => void} disabled={saving}>
              {saving ? 'Saving...' : 'Add Customer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="label-field">Email</label>
            <input className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label className="label-field">License No</label>
            <input className="input-field" value={form.license_no} onChange={(e) => setForm({ ...form, license_no: e.target.value })} placeholder="MH01 20230001234" />
            {errors.license_no && <p className="mt-1 text-xs text-red-600">{errors.license_no}</p>}
          </div>
          {submitError && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</p>}
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={confirmDelete !== null}
        title="Delete Customer"
        onClose={() => setConfirmDelete(null)}
        footer={
          <>
            <Button variant="outlined" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-medium text-black">{confirmDelete?.name}</span>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
