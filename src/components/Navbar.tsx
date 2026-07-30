import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Home' },
  { to: '/cars', label: 'Vehicles' },
  { to: '/customers', label: 'Customers' },
  { to: '/rentals', label: 'Rentals' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 md:px-8 lg:px-16">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-black text-white">
            <Car size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-black">DriveNow</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-green' : 'text-gray-600 hover:text-black'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-green" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="rounded bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-greenHover"
          >
            Sign Up
          </Link>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-gray-200 bg-white px-4 py-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-brand-greenSoft text-brand-green' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
