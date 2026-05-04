/**
 * WasteIQ — Driver Layout
 * Mobile-first layout with bottom tab bar.
 * Designed for field use on phones/tablets.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { 
  Truck, 
  Route, 
  MapPin, 
  QrCode, 
  User,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { icon: Truck, label: 'Dashboard', href: '/driver' },
  { icon: Route, label: 'Route', href: '/driver/route' },
  { icon: MessageSquare, label: 'Support', href: '/driver/messages' },
  { icon: QrCode, label: 'Scan', href: '/driver/scan' },
  { icon: User, label: 'Profile', href: '/driver/profile' },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--surface)' }}>
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col h-screen sticky top-0 border-r overflow-hidden"
        style={{ background: 'var(--surface-lowest)', borderColor: 'var(--outline-variant)' }}
      >
        <div className="p-4 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-3 mb-10 no-underline group px-2">
            <img 
              src="/logo.png" 
              alt="WasteIQ Logo" 
              className="w-12 h-12 flex-shrink-0 object-contain group-hover:scale-110 transition-transform" 
            />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-2xl font-bold whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', letterSpacing: '-0.03em' }}
                >
                  WasteIQ
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.endsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-all group relative"
                  style={{
                    color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                    background: isActive ? 'var(--success-container)' : 'transparent',
                  }}
                >
                  <Icon size={20} className="flex-shrink-0" strokeWidth={isActive ? 2.5 : 1.5} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-semibold whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !isCollapsed && (
                    <motion.div 
                      layoutId="active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full" 
                      style={{ background: 'var(--primary)' }} 
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--outline-variant)' }}>
            <Link 
              href="/driver/profile" 
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-low transition-colors no-underline px-2"
            >
              <div
                className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                  color: 'white',
                }}
              >
                PK
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col whitespace-nowrap"
                  >
                    <span className="text-sm font-bold" style={{ color: 'var(--on-surface)' }}>Pradeep Kumar</span>
                    <span className="text-[10px]" style={{ color: 'var(--outline)' }}>Verified Driver</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>
          
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mt-4 flex items-center justify-center py-2 rounded-xl hover:bg-surface-low transition-colors border-none cursor-pointer text-outline"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ChevronRight size={20} />
            </motion.div>
          </button>
        </div>
      </motion.aside>

      {/* Main Stack */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile-Only Top Bar */}
        <nav
          className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3"
          style={{
            background: 'var(--surface-lowest)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src="/logo.png" alt="WasteIQ Logo" className="w-10 h-10 object-contain" />
            <span
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', letterSpacing: '-0.03em' }}
            >
              WasteIQ
            </span>
          </Link>
          <Link href="/driver/profile" className="no-underline">
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
          </Link>
        </nav>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-4 md:py-10 md:px-8 pb-24 md:pb-10">
          {children}
        </main>

        {/* Mobile-Only Bottom Tab Bar */}
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2"
          style={{
            background: 'var(--surface-lowest)',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.endsWith(item.href);
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
    </div>
  );
}
