/**
 * WasteIQ — Driver Layout
 * Mobile-first layout with bottom tab bar.
 * Designed for field use on phones/tablets.
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Recycle, Truck, Route, MapPin, QrCode, User } from 'lucide-react';

const navItems = [
  { icon: Truck, label: 'Dashboard', href: '/driver' },
  { icon: Route, label: 'Route', href: '/driver/route' },
  { icon: QrCode, label: 'Scan', href: '/driver/scan' },
  { icon: User, label: 'Profile', href: '/driver/profile' },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      {/* Top Bar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: 'var(--surface-lowest)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex items-center gap-2">
          <Recycle size={22} style={{ color: 'var(--primary)' }} strokeWidth={2.5} />
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', letterSpacing: '-0.03em' }}
          >
            WasteIQ
          </span>
          <span
            className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
            style={{
              background: 'var(--info-container)',
              color: 'var(--info)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
            }}
          >
            DRIVER
          </span>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
            color: 'white',
            fontFamily: 'var(--font-display)',
          }}
        >
          P
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-[600px] mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2"
        style={{
          background: 'var(--surface-lowest)',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl no-underline transition-all"
              style={{
                color: isActive ? 'var(--primary)' : 'var(--outline)',
                background: isActive ? 'var(--success-container)' : 'transparent',
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
