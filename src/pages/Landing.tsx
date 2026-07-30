import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Car, Users, ClipboardList } from 'lucide-react';
import type { DashboardStats } from '@/types';
import { getStats } from '@/services/dashboardService';
import { readTable } from '@/services/storage';
import type { Car as CarType, Customer } from '@/types';

function CarIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute bottom-6 h-6 w-72 rounded-full bg-black/15 blur-2xl" />
      <svg viewBox="0 0 520 240" className="w-full max-w-md drop-shadow-sm">
        <path
          d="M40 160 L70 120 Q90 95 130 92 L210 88 Q240 70 290 72 L360 80 Q400 86 430 110 L470 130 Q490 138 488 160 L488 172 Q486 180 476 180 L44 180 Q34 180 34 170 Z"
          fill="#111111"
        />
        <path
          d="M140 96 L210 92 Q235 78 285 80 L350 88 Q380 94 405 112 L360 118 L160 118 Z"
          fill="#F9FAFB"
          opacity="0.92"
        />
        <path d="M250 92 L250 168" stroke="#000" strokeOpacity="0.25" strokeWidth="2" />
        <circle cx="470" cy="140" r="6" fill="#22C55E" />
        <circle cx="130" cy="180" r="28" fill="#111" />
        <circle cx="130" cy="180" r="14" fill="#F9FAFB" />
        <circle cx="390" cy="180" r="28" fill="#111" />
        <circle cx="390" cy="180" r="14" fill="#F9FAFB" />
      </svg>
    </div>
  );
}

interface StatsData {
  total_cars: number;
  active_rentals: number;
  total_customers: number;
}

const STEPS = [
  {
    num: '01',
    title: 'Add Your Fleet',
    desc: 'Register all your vehicles with details like make, model, year, and daily rate.',
  },
  {
    num: '02',
    title: 'Register Customers',
    desc: 'Add customer information and license details for quick booking.',
  },
  {
    num: '03',
    title: 'Manage Rentals',
    desc: 'Create bookings, track active rentals, and process returns with one click.',
  },
];

const FEATURES = [
  {
    icon: Car,
    title: 'Fleet Management',
    desc: 'Add, edit and track every vehicle. Monitor availability in real time.',
  },
  {
    icon: Users,
    title: 'Customer Records',
    desc: 'Keep customer profiles, contact info and license details organized.',
  },
  {
    icon: ClipboardList,
    title: 'Rental Tracking',
    desc: 'Create rentals, calculate totals automatically, process returns instantly.',
  },
];

export default function Landing() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    void (async () => {
      const s: DashboardStats = await getStats();
      const customers = readTable<Customer>('customers');
      // Only build stats if real data exists.
      if (s.total_cars > 0 || customers.length > 0 || s.active_rentals > 0) {
        setStats({
          total_cars: s.total_cars,
          active_rentals: s.active_rentals,
          total_customers: customers.length,
        });
      }
    })();
  }, []);

  return (
    <div>
      {/* SECTION 1 — HERO (full viewport height) */}
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-container items-center px-4 py-16 md:px-8 lg:px-16">
        <div className="grid w-full items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-400">Manage your fleet</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-black md:text-5xl lg:text-6xl">
              Save <span className="text-brand-green">time</span> with our
              <br />
              car rental system
            </h1>
            <p className="mt-5 max-w-md text-base text-gray-500 md:text-lg">
              Manage your entire fleet, customers and rentals in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded bg-brand-green px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-greenHover"
              >
                Go to Dashboard <Check size={16} />
              </Link>
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 rounded bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                View Vehicles <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2 md:justify-end">
            <CarIllustration />
          </div>
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-container px-4 py-20 md:px-8 lg:px-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">How It Works</h2>
            <p className="mt-3 text-base text-gray-500">Get started in three simple steps</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="border-t-2 border-brand-green bg-white p-6">
                <div className="text-5xl font-light text-brand-green" style={{ fontWeight: 200 }}>
                  {step.num}
                </div>
                <h3 className="mt-4 text-lg font-bold text-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURES */}
      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 py-20 md:px-8 lg:px-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">Everything you need</h2>
            <p className="mt-3 text-base text-gray-500">
              A complete toolkit for modern car rental businesses
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="border border-gray-200 border-l-[3px] border-l-brand-green bg-white p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded bg-brand-greenSoft text-brand-green">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-black">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — STATS (only when real data exists) */}
      {stats && (
        <section className="bg-black">
          <div className="mx-auto grid max-w-container grid-cols-1 divide-y divide-white/10 px-4 py-16 text-center md:grid-cols-3 md:divide-x md:divide-y-0 md:px-8 lg:px-16">
            <div className="px-4 py-6">
              <div className="text-4xl font-light tracking-tight text-white md:text-5xl">{stats.total_cars}</div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">Total Cars</div>
            </div>
            <div className="px-4 py-6">
              <div className="text-4xl font-light tracking-tight text-white md:text-5xl">{stats.active_rentals}</div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">Active Rentals</div>
            </div>
            <div className="px-4 py-6">
              <div className="text-4xl font-light tracking-tight text-white md:text-5xl">{stats.total_customers}</div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">Total Customers</div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5 — CTA BANNER */}
      <section className="bg-black">
        <div className="mx-auto max-w-container px-4 py-20 text-center md:px-8 lg:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Ready to manage your fleet smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
            Start adding your vehicles and customers today.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded bg-brand-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-greenHover"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* SECTION 6 — FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-4 px-4 py-6 text-center md:flex-row md:px-8 md:text-left lg:px-16">
          <span className="text-lg font-bold text-black">DriveNow</span>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-black">Home</Link>
            <Link to="/cars" className="text-sm text-gray-600 hover:text-black">Vehicles</Link>
            <Link to="/customers" className="text-sm text-gray-600 hover:text-black">Customers</Link>
            <Link to="/rentals" className="text-sm text-gray-600 hover:text-black">Rentals</Link>
          </nav>
          <span className="text-sm text-gray-500">© 2026 DriveNow</span>
        </div>
      </footer>
    </div>
  );
}
