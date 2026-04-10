/**
 * WasteIQ — Admin Layout
 * Fixed left sidebar (240px expanded, 72px collapsed).
 * Top bar with search, notifications, user avatar.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Recycle,
  LayoutDashboard,
  Trash2,
  Route,
  Users,
  MessageSquare,
  BarChart3,
  Activity,
  MapPin,
  AlertTriangle,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Trash2, label: 'Bins', href: '/admin/bins' },
  { icon: AlertTriangle, label: 'Alerts', href: '/admin/alerts' },
  { icon: Route, label: 'Routes', href: '/admin/routes' },
  { icon: Users, label: 'Drivers', href: '/admin/drivers' },
  { icon: MessageSquare, label: 'Complaints', href: '/admin/complaints' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Activity, label: 'Heatmap', href: '/admin/heatmap' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { emergencyMode, sidebarCollapsed, toggleSidebar, toggleEmergencyMode } = useAdminStore();

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface)' }}>
      {/* ── SIDEBAR ──────────────────────────────────── */}
      <aside
        className="fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300"
        style={{
          width: sidebarWidth,
          background: 'var(--surface-lowest)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 min-h-[64px]">
          <Recycle size={24} style={{ color: 'var(--primary)' }} strokeWidth={2.5} />
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--primary)',
                letterSpacing: '-0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              WasteIQ
            </motion.span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-2 flex flex-col gap-1 px-3 overflow-y-auto">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-3 px-3 py-3 rounded-xl no-underline transition-all group"
                style={{
                  background: isActive ? 'var(--success-container)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                  borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminNav"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'var(--success-container)' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative z-10 transition-transform group-hover:scale-110" />
                {!sidebarCollapsed && (
                  <motion.span
                    className="relative z-10 whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Emergency Mode Toggle */}
        <div className="px-3 pb-3">
          <button
            onClick={toggleEmergencyMode}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
            style={{
              background: emergencyMode ? 'rgba(186, 26, 26, 0.08)' : 'transparent',
              color: emergencyMode ? 'var(--error)' : 'var(--on-surface-variant)',
              border: emergencyMode ? '1.5px solid var(--error)' : '1.5px solid transparent',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <Zap
              size={20}
              className={emergencyMode ? 'animate-pulse' : ''}
              style={{ color: emergencyMode ? 'var(--error)' : 'var(--outline)' }}
            />
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap">
                {emergencyMode ? 'Emergency ON' : 'Emergency Mode'}
              </span>
            )}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center py-3 transition-colors"
          style={{
            background: 'var(--surface-low)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--outline)',
          }}
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>

      {/* ── MAIN AREA ────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 min-h-[60px]"
          style={{
            background: 'var(--surface-lowest)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--on-surface)' }}
            >
              Admin Panel
            </span>
            {emergencyMode && (
              <span
                className="chip chip-error text-[10px] font-bold uppercase animate-pulse"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                ⚠ EMERGENCY
              </span>
            )}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-[400px] mx-8">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--outline)' }}
              />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search bins, drivers, alerts..."
                style={{ height: '40px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <span
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'var(--success-container)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 500,
                color: 'var(--primary)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--primary-container)' }}
              />
              SYSTEM OK
            </span>
            <button
              className="p-2 rounded-lg relative"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: 'var(--error)' }}
              />
            </button>
            <button
              className="p-2 rounded-lg"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
              aria-label="Help"
            >
              <HelpCircle size={20} />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                color: 'white',
                fontFamily: 'var(--font-display)',
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* Emergency Banner */}
        {emergencyMode && (
          <motion.div
            initial={{ translateY: -60 }}
            animate={{ translateY: 0 }}
            className="flex items-center justify-between px-6 py-3"
            style={{
              background: 'linear-gradient(135deg, #C62828, #E53935)',
              color: 'white',
            }}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="animate-pulse" />
              <span
                className="text-sm font-bold uppercase"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
              >
                ⚠ Emergency Mode Active
              </span>
              <span className="mono-sm" style={{ opacity: 0.8 }}>
                02:14:38
              </span>
            </div>
            <button
              onClick={toggleEmergencyMode}
              className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Deactivate
            </button>
          </motion.div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
