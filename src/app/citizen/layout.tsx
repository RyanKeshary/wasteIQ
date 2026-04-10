/**
 * WasteIQ — Citizen Layout
 * Clean layout with simple top navbar. No sidebar.
 * Citizen-facing: softer, friendlier design than admin.
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Recycle, Home, MessageSquare, MapPin, Star, Bell, LogOut, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/citizen' },
  { icon: MessageSquare, label: 'My Complaints', href: '/citizen/complaints' },
  { icon: MapPin, label: 'Nearby Bins', href: '/citizen/bins' },
  { icon: Star, label: 'Rate Area', href: '/citizen/rate' },
];

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      {/* Top Navigation Bar */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'var(--surface-lowest)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/citizen" className="flex items-center gap-2 no-underline">
            <Recycle size={22} style={{ color: 'var(--primary)' }} strokeWidth={2.5} />
            <span
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', letterSpacing: '-0.03em' }}
            >
              WasteIQ
            </span>
            <span
              className="hidden sm:inline text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--success-container)',
                color: 'var(--primary)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
              }}
            >
              CITIZEN
            </span>
          </Link>

          {/* Nav Tabs */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all"
                  style={{
                    background: isActive ? 'var(--success-container)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg relative"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                color: 'white',
                fontFamily: 'var(--font-display)',
              }}
            >
              C
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 px-2"
        style={{
          background: 'var(--surface-lowest)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.06)',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg no-underline"
              style={{
                color: isActive ? 'var(--primary)' : 'var(--outline)',
              }}
            >
              <Icon size={20} />
              <span className="text-[9px] font-bold uppercase">{item.label.split(' ').pop()}</span>
            </Link>
          );
        })}
      </div>

      {/* Page Content */}
      <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        {children}
      </main>
    </div>
  );
}
