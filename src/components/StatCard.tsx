import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, accent = true }: StatCardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-5 ${
        accent ? 'border-t-2 border-t-brand-green' : ''
      }`}
    >
      <div className="text-3xl font-light tracking-tight text-black">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}
