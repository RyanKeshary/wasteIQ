/**
 * WasteIQ — Citizen Dashboard
 * Personal waste management overview.
 * Shows: greeting, quick actions, recent complaints, nearby alerts, green score.
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MessageSquare,
  MapPin,
  Star,
  Leaf,
  Trophy,
  AlertTriangle,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle,
} from 'lucide-react';
import CountUp from '@/components/effects/CountUp';

const quickActions = [
  { icon: MessageSquare, label: 'Report Issue', href: '/citizen/complaints?new=true', color: 'var(--primary)' },
  { icon: MapPin, label: 'Find Bins', href: '/citizen/bins', color: 'var(--secondary)' },
  { icon: Star, label: 'Rate Area', href: '/citizen/rate', color: '#F59E0B' },
];

const recentComplaints = [
  { id: '1', title: 'Overflowing bin near station', status: 'OPEN', time: '2h ago' },
  { id: '2', title: 'Missed collection on Market Lane', status: 'IN_PROGRESS', time: '1d ago' },
  { id: '3', title: 'Illegal dumping at highway junction', status: 'RESOLVED', time: '3d ago' },
];

const nearbyAlerts = [
  { message: 'Collection scheduled for Ward 14 at 6:00 AM tomorrow', type: 'schedule' },
  { message: 'Bin WIQ-0482 near your area is 92% full — avoid overflow', type: 'warning' },
];

function getComplaintStatusStyles(status: string) {
  switch (status) {
    case 'OPEN': return { bg: 'var(--error-container)', color: 'var(--error)', label: 'Open' };
    case 'IN_PROGRESS': return { bg: 'var(--warning-container)', color: 'var(--warning)', label: 'In Progress' };
    case 'RESOLVED': return { bg: 'var(--success-container)', color: 'var(--primary)', label: 'Resolved' };
    default: return { bg: 'var(--surface-high)', color: 'var(--outline)', label: status };
  }
}

export default function CitizenDashboard() {
  return (
    <div>
      {/* Active Chat Shortcut - Highly visible easy button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <Link href="/citizen/messages" className="no-underline">
          <div 
            className="card p-4 flex items-center justify-between border-none shadow-lg relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              color: 'white'
            }}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center relative">
                <MessageSquare size={24} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-primary animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Support Hub</p>
                <h3 className="title-md text-white m-0">Messaging & Support</h3>
                <p className="text-xs opacity-70">Talk to drivers or municipal staff about your reports</p>
              </div>
            </div>
            <button 
              className="btn-tonal bg-white/10 hover:bg-white/20 text-white border-none py-2 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              Open Inbox
            </button>
            
            {/* Background decorative pulse */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" />
          </div>
        </Link>
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="headline-lg mb-1">Good Morning, Citizen 👋</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          Your ward: <strong>W-14, Mira Road East</strong> — Last collection: Today, 6:15 AM
        </p>
      </motion.div>

      {/* Green Score + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(0,193,106,0.06), rgba(0,109,57,0.04))' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--success-container)' }}
          >
            <Trophy size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
              <CountUp end={340} />
            </div>
            <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Green Score Points</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-6 flex items-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--info-container)' }}
          >
            <MessageSquare size={28} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              <CountUp end={3} />
            </div>
            <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Total Complaints</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 flex items-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(0,193,106,0.08)' }}
          >
            <Leaf size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
              <CountUp end={94} suffix="%" />
            </div>
            <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Area Cleanliness</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <h2 className="title-md mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="card card-interactive p-5 flex flex-col items-center text-center gap-3 no-underline"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${action.color}15` }}
                >
                  <Icon size={22} style={{ color: action.color }} />
                </div>
                <span className="title-sm" style={{ fontSize: '13px' }}>{action.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Two Column: Complaints + Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="title-md">My Complaints</h3>
            <Link
              href="/citizen/complaints"
              className="flex items-center gap-1 text-xs font-medium no-underline"
              style={{ color: 'var(--primary)' }}
            >
              View All <ChevronRight size={12} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentComplaints.map((c) => {
              const statusStyle = getComplaintStatusStyles(c.status);
              return (
                <div
                  key={c.id}
                  className="p-3 rounded-xl flex items-center gap-3"
                  style={{ background: 'var(--surface-low)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: statusStyle.bg }}
                  >
                    {c.status === 'RESOLVED' ? (
                      <CheckCircle size={14} style={{ color: statusStyle.color }} />
                    ) : (
                      <Clock size={14} style={{ color: statusStyle.color }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="title-sm truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                        style={{ background: statusStyle.bg, color: statusStyle.color, fontFamily: 'var(--font-mono)' }}
                      >
                        {statusStyle.label}
                      </span>
                      <span className="mono-sm" style={{ color: 'var(--outline)', fontSize: '10px' }}>{c.time}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--outline)' }} />
                </div>
              );
            })}
          </div>

          <Link
            href="/citizen/complaints?new=true"
            className="btn-primary w-full mt-4 no-underline text-sm"
          >
            <Plus size={14} /> Report New Issue
          </Link>
        </motion.div>

        {/* Area Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <h3 className="title-md mb-4">Area Updates</h3>
          <div className="flex flex-col gap-3">
            {nearbyAlerts.map((alert, i) => (
              <div
                key={i}
                className="p-3 rounded-xl flex gap-3"
                style={{
                  background: 'var(--surface-low)',
                  borderLeft: `3px solid ${alert.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`,
                }}
              >
                {alert.type === 'warning' ? (
                  <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <Clock size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                )}
                <p className="body-sm" style={{ color: 'var(--on-surface)' }}>{alert.message}</p>
              </div>
            ))}
          </div>

          {/* Collection Schedule */}
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--success-container)' }}>
            <h4 className="title-sm mb-2" style={{ color: 'var(--primary)' }}>Next Collection</h4>
            <div className="flex items-center justify-between">
              <span className="body-sm font-medium">Tomorrow, 6:00 AM</span>
              <span className="chip chip-success text-[10px]">On Schedule</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
