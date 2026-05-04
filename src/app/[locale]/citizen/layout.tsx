/**
 * WasteIQ — Citizen Layout
 * Clean layout with simple top navbar. No sidebar.
 * Citizen-facing: softer, friendlier design than admin.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, MapPin, Star, Bell, LogOut, User, Settings, Check, QrCode, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter, { Notification } from '@/components/notifications/NotificationCenter';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/citizen' },
  { icon: MapPin, label: 'Nearby Bins', href: '/citizen/bins' },
  { icon: QrCode, label: 'Scan Bin', href: '/citizen/scan' },
  { icon: MessageSquare, label: 'Messages', href: '/citizen/messages' },
  { icon: ShieldAlert, label: 'Reports', href: '/citizen/complaints' },
  { icon: Star, label: 'Rate Area', href: '/citizen/rate' },
];

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Bin Collected', message: 'Bin WIQ-0482 in your ward was collected successfully.', time: '2h ago', type: 'success', read: false },
    { id: '2', title: 'Community Cleanup', message: 'Scheduled community cleanup tomorrow at 8am. Join us at Garden Colony.', time: '1d ago', type: 'info', read: true },
    { id: '3', title: 'Service Update', message: 'Waste collection timing for Mira Road (E) shifted to 7:00 AM.', time: '2d ago', type: 'warning', read: true },
  ]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between py-3 gap-8">
          {/* Logo */}
          <Link href="/citizen" className="flex items-center gap-2 no-underline flex-shrink-0">
            <img src="/logo.png" alt="WasteIQ" className="w-10 h-10 object-contain" />
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

          {/* Dynamic Page Context */}
          <div className="flex-1 px-4 flex items-center md:hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: 'var(--surface-high)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--on-surface-variant)' }}>
                {navItems.find(item => pathname === item.href || pathname.endsWith(item.href))?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              // Account for locale segments in the pathname (e.g., /hi/citizen/complaints matches /citizen/complaints)
              const isActive = pathname === item.href || pathname.endsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all whitespace-nowrap"
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
          <div className="flex items-center gap-4 relative flex-shrink-0">
            <LanguageSwitcher />
            
            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                className="p-2 rounded-lg relative transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
                aria-label="Notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
              >
                <Bell size={18} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--error)' }} />
                )}
              </button>

              <NotificationCenter
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
                onClearAll={() => setNotifications([])}
              />
            </div>

            {/* Profile Menu */}
            <div ref={profileRef} className="relative">
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
              >
                C
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden glass shadow-xl z-50 border p-2"
                    style={{ borderColor: 'var(--outline-variant)', background: 'var(--surface)' }}
                  >
                    <div className="px-3 py-3 border-b mb-2" style={{ borderColor: 'var(--outline-variant)' }}>
                      <p className="font-bold text-sm">Amit Kumar</p>
                      <p className="text-xs" style={{ color: 'var(--outline)' }}>amit@example.com</p>
                    </div>
                    
                    <Link 
                      href="/citizen/account" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 no-underline transition-colors block"
                      style={{ color: 'var(--on-surface)' }}
                    >
                      <Settings size={16} /> Account Settings
                    </Link>

                    <Link 
                      href="/login" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 no-underline transition-colors block"
                      style={{ color: 'var(--error)' }}
                    >
                      <LogOut size={16} /> Sign out
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
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
          // Account for locale segments in the pathname
          const isActive = pathname === item.href || pathname.endsWith(item.href);
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
