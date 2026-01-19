'use client';

import Link from 'next/link';
import { useState } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Forum', href: '/forum' },
  { name: 'Events', href: '/events' },
  { name: 'Get Involved', href: '/get-involved' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-volcanic text-parchment sticky top-0 z-50">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <BulbIcon className="w-10 h-10 text-daffodil" />
            <div className="hidden sm:block">
              <div className="font-serif text-lg font-semibold leading-tight">
                Mt Tabor Bulb Society
              </div>
              <div className="text-xs text-parchment-400 italic">
                Growing Community / Community Grows
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-parchment-200 hover:text-daffodil transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/forum?action=new"
              className="btn bg-daffodil text-volcanic hover:bg-daffodil-400 text-sm py-2"
            >
              Share Your Blooms
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-organic text-parchment-200 hover:text-parchment hover:bg-volcanic-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <CloseIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-volcanic-600 mt-2 pt-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-parchment-200 hover:text-daffodil px-3 py-2 rounded-organic hover:bg-volcanic-600 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/forum?action=new"
                className="btn bg-daffodil text-volcanic hover:bg-daffodil-400 text-sm mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Share Your Blooms
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function BulbIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
      <path d="M9 20h6v1a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1z" opacity="0.7" />
      <path d="M10 19h4v1h-4z" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
