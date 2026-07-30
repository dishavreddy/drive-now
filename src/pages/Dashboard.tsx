import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import StatCard from '@/components/StatCard';
import Badge from '@/components/Badge';
import Table, { type Column } from '@/components/Table';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useDashboard } from '@/hooks/useDashboard';
import { useRentals } from '@/hooks/useRentals';
import type { Rental } from '@/types';

function formatRupee(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

// Show "--" for zero values per the "never show 0" rule.
function orDash(n: number): string {
  return n > 0 ? String(n) : '--';
}
function rupeeOrDash(n: number): string {
  return n > 0 ? formatRupee(n) : '--';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboard();
  const { rentals, loading: rentalsLoading } = useRentals();
  const [recent, setRecent] = useState<Rental[]>([]);

  useEffect(() => {
    setRecent(rentals.slice(0, 5));
  }, [rentals]);

  const columns: Column<Rental>[] = [
    {
      key: 'car',
      header: 'Car',
      render: (r) => <span className="font-medium">{r.car.make} {r.car.model}</span>,
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (r) => r.customer.name,
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (r) => (
        <span className="text-gray-600">
          {formatDate(r.start_date)} → {formatDate(r.end_date)}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (r) => <span className="font-medium">{formatRupee(r.total_amount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={r.status === 'active' ? 'success' : 'default'}>{r.status}</Badge>,
    },
  ];

  return (
    <div className="mx-auto max-w-container px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your fleet and rentals.</p>
        </div>
        <Link
          to="/rentals"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
        >
          New rental <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stat cards */}
      {statsLoading || !stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Cars" value={orDash(stats.total_cars)} />
          <StatCard label="Available" value={orDash(stats.available_cars)} />
          <StatCard label="Rented" value={orDash(stats.rented_cars)} />
          <StatCard label="Revenue" value={rupeeOrDash(stats.total_revenue)} />
        </div>
      )}

      {/* Recent rentals — hidden completely until real data exists */}
      {rentalsLoading || recent.length > 0 ? (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-black">Recent Rentals</h2>
          {rentalsLoading ? (
            <LoadingSpinner label="Loading rentals..." />
          ) : (
            <Table columns={columns} data={recent} rowKey={(r) => r.id} />
          )}
        </div>
      ) : null}
    </div>
  );
}
