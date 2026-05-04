/**
 * WasteIQ — Admin Layout
 * Fixed left sidebar (240px expanded, 72px collapsed).
 * Top bar with search, notifications, user avatar.
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Menu,
  X,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import HelpGuide from '@/components/admin/HelpGuide';
import { toast } from 'sonner';
import NotificationCenter, { Notification } from '@/components/notifications/NotificationCenter';

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'CRITICAL: Bin #0482 Overflow', message: 'Mira Road East node has exceeded 90% capacity. Immediate dispatch required.', time: '2m ago', type: 'error', read: false },
    { id: '2', title: 'Route Optimization Ready', message: 'The AI engine has calculated a more efficient path for Ward 4-B.', time: '45m ago', type: 'success', read: false },
    { id: '3', title: 'Driver Delay Reported', message: 'Unit PR-12 is experiencing traffic delays in Bhayandar West.', time: '1h ago', type: 'warning', read: true },
  ]);
  
  const { emergencyMode, sidebarCollapsed, toggleSidebar, toggleEmergencyMode } = useAdminStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarWidth = sidebarCollapsed ? 72 : 240;
  // Adjust for locale prefixes
  const isSearchPage = 
    pathname === '/admin' || pathname.endsWith('/admin') ||
    pathname === '/admin/bins' || pathname.endsWith('/admin/bins') ||
    pathname === '/admin/drivers' || pathname.endsWith('/admin/drivers');

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface)' }}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ──────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? 240 : (sidebarCollapsed ? 72 : 240),
          x: isMobile ? (mobileMenuOpen ? 0 : -240) : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen z-40 flex flex-col"
        style={{
          background: 'var(--surface-lowest)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-4 py-3 min-h-[64px] no-underline group">
          <img 
            src="/logo.png" 
            alt="WasteIQ" 
            className="w-16 h-16 flex-shrink-0 object-contain group-hover:scale-110 transition-transform" 
          />
          <AnimatePresence mode="wait">
            {(!sidebarCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
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
          </AnimatePresence>
        </Link>

        {/* Nav Items */}
        <nav className="flex-1 py-2 flex flex-col gap-1 px-3 overflow-y-auto">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || pathname.endsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setMobileMenuOpen(false)}
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
                <AnimatePresence mode="wait">
                  {(!sidebarCollapsed || isMobile) && (
                    <motion.span
                      className="relative z-10 whitespace-nowrap"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
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
            {(!sidebarCollapsed || isMobile) && (
              <span className="whitespace-nowrap">
                {emergencyMode ? 'Emergency ON' : 'Emergency Mode'}
              </span>
            )}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center py-3 transition-colors hover:bg-surface-high"
          style={{
            background: 'var(--surface-low)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--outline)',
          }}
          aria-label="Toggle sidebar"
        >
          <motion.div
             animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
             <ChevronRight size={18} />
          </motion.div>
        </button>
      </motion.aside>

      {/* ── MAIN AREA ────────────────────────────────── */}
      <motion.div
        initial={false}
        animate={{ marginLeft: isMobile ? 0 : (sidebarCollapsed ? 72 : 240) }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col min-h-screen w-full"
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
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 mr-1 rounded-lg hover:bg-surface-low transition-colors"
                style={{ color: 'var(--on-surface)' }}
              >
                <Menu size={20} />
              </button>
            )}
            <span
              className="text-sm font-semibold hidden sm:inline-block"
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
          <div className="flex-1 flex justify-center mx-4">
            <AnimatePresence>
              {isSearchPage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="hidden md:flex items-center gap-2 w-full max-w-[400px]"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3 relative">
            <span
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: emergencyMode ? 'var(--error-container)' : 'var(--success-container)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 500,
                color: emergencyMode ? 'var(--error)' : 'var(--primary)',
              }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${emergencyMode ? 'animate-ping' : 'animate-pulse'}`}
                style={{ background: emergencyMode ? 'var(--error)' : 'var(--primary-container)' }}
              />
              {emergencyMode ? 'SYSTEM ALERT' : 'SYSTEM OK'}
            </span>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowHelp(false); }}
                className="p-2 rounded-lg relative hover:bg-surface-low transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--error)' }} />
              </button>
              
              <NotificationCenter
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
                onClearAll={() => setNotifications([])}
              />
            </div>

            {/* Help */}
            <div className="relative">
              <button
                onClick={() => { setShowHelp(true); setShowProfile(false); setShowNotifications(false); }}
                className="p-2 rounded-lg hover:bg-surface-low transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
                aria-label="Help"
              >
                <HelpCircle size={20} />
              </button>
              
              <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
            </div>

            <div className="relative">
              <div
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowHelp(false); }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer shadow-md hover:scale-105 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                }}
              >
                AD
              </div>
              
              <AnimatePresence>
                {showProfile && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 card shadow-2xl z-50 p-2 border-none"
                    style={{ background: 'var(--surface-lowest)' }}
                  >
                    <div className="px-4 py-3 border-b border-outline-variant mb-2 bg-surface-low rounded-xl">
                       <p className="text-xs font-bold leading-none">Administrator</p>
                       <p className="text-[10px] opacity-60 mt-1">ops-lead@wasteiq.io</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link 
                        href="/admin/settings"
                        onClick={() => setShowProfile(false)}
                        className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-surface-low text-xs flex items-center gap-3 transition-colors border-none cursor-pointer no-underline"
                        style={{ color: 'var(--on-surface)' }}
                      >
                        <Settings size={14} className="opacity-60" /> Operation Settings
                      </Link>
                      <Link 
                        href="/login"
                        className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-error-container/10 text-xs text-error flex items-center gap-3 transition-colors border-none cursor-pointer no-underline"
                      >
                        <LogOut size={14} className="opacity-60" /> Terminate Session
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              boxShadow: '0 4px 12px rgba(229, 57, 53, 0.4)',
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
              <span className="mono-sm bg-white/20 px-2 py-0.5 rounded-md" style={{ opacity: 0.9 }}>
                02:14:38
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.error('Emergency broadcast sent to all active drivers in the area.', { icon: '🚨' })}
                className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-white/30 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Broadcast Alert
              </button>
              <button
                onClick={() => toast.info('Rerouting all nearby units to high-priority overflow zones.', { icon: '🗺️' })}
                className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-white/30 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Dispatch Units
              </button>
              <button
                onClick={() => {
                  toggleEmergencyMode();
                  toast.success('Emergency mode deactivated. Resuming normal operations.');
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-white hover:text-red-600 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Deactivate
              </button>
            </div>
          </motion.div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </motion.div>
    </div>
  );
}
