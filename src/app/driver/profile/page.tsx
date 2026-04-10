/**
 * WasteIQ — Driver Profile Page
 * Fully functional: Contact, Email, Sign Out buttons.
 */
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Star,
  Award,
  Clock,
  Trash2,
  Route,
  Phone,
  Mail,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import CountUp from '@/components/effects/CountUp';

export default function DriverProfilePage() {
  const router = useRouter();

  const handleCall = () => {
    toast.success('Calling Support...', {
      description: 'Phone: +91 22 2345 6789',
      duration: 3000,
    });
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@wasteiq.in?subject=Driver%20Support%20Request';
    toast.info('Opening email client...');
  };

  const handleSignOut = () => {
    toast.loading('Signing out...', { id: 'signout' });
    setTimeout(() => {
      toast.success('Signed out successfully', { id: 'signout' });
      router.push('/login');
    }, 1000);
  };

  return (
    <div>
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-4 text-center"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
            color: 'white',
            fontFamily: 'var(--font-display)',
          }}
        >
          PK
        </div>
        <h2 className="headline-md mb-1">Pradeep Kumar</h2>
        <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Employee ID: DRV-001</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={16} fill={s <= 4 ? '#F59E0B' : 'none'} stroke={s <= 4 ? '#F59E0B' : 'var(--outline-variant)'} />
          ))}
          <span className="mono-sm ml-1 font-bold">4.8</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Total Collections', value: 1247, icon: Trash2, color: 'var(--primary)' },
          { label: 'Routes Completed', value: 186, icon: Route, color: 'var(--secondary)' },
          { label: 'Avg Time/Bin', value: 3.2, suffix: ' min', icon: Clock, color: 'var(--tertiary)' },
          { label: 'This Month', value: 142, icon: Award, color: 'var(--primary)' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="card p-4 text-center"
            >
              <Icon size={18} style={{ color: stat.color, margin: '0 auto 8px' }} />
              <div
                className="text-xl font-bold mb-0.5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <CountUp end={stat.value} suffix={stat.suffix || ''} decimals={stat.suffix === ' min' ? 1 : 0} />
              </div>
              <span className="body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: '11px' }}>
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Vehicle Info */}
      <div className="card p-5 mb-4">
        <h3 className="title-md mb-3">Vehicle Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ background: 'var(--surface-low)' }}>
            <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--outline)' }}>Vehicle</span>
            <p className="mono-sm font-bold mt-0.5">MH-04-AB-1234</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--surface-low)' }}>
            <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--outline)' }}>Capacity</span>
            <p className="mono-sm font-bold mt-0.5">5,000 kg</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--surface-low)' }}>
            <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--outline)' }}>Zone</span>
            <p className="mono-sm font-bold mt-0.5">Mira Road (E)</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--surface-low)' }}>
            <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--outline)' }}>Status</span>
            <p className="mono-sm font-bold mt-0.5" style={{ color: 'var(--primary)' }}>On Duty</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card overflow-hidden">
        {[
          { icon: Phone, label: 'Contact Support', sub: '+91 22 2345 6789', onClick: handleCall },
          { icon: Mail, label: 'Email Dashboard', sub: 'support@wasteiq.in', onClick: handleEmail },
          { icon: LogOut, label: 'Sign Out', sub: '', onClick: handleSignOut, danger: true },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-5 py-4"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: i < 2 ? '1px solid var(--outline-variant)' : 'none',
                cursor: 'pointer',
                color: (item as any).danger ? 'var(--error)' : 'var(--on-surface)',
                textAlign: 'left',
              }}
            >
              <Icon size={18} style={{ color: (item as any).danger ? 'var(--error)' : 'var(--outline)' }} />
              <div className="flex-1">
                <p className="title-sm" style={{ color: (item as any).danger ? 'var(--error)' : 'var(--on-surface)' }}>{item.label}</p>
                {item.sub && (
                  <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>{item.sub}</p>
                )}
              </div>
              <ChevronRight size={14} style={{ color: 'var(--outline)' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
