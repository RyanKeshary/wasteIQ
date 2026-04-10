/**
 * WasteIQ — Driver Dashboard
 * Active route status, today's stats, and next stop preview.
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Truck,
  MapPin,
  Clock,
  Trash2,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Play,
  ChevronRight,
  Gauge,
  Zap,
} from 'lucide-react';
import CountUp from '@/components/effects/CountUp';

const mockRoute = {
  name: 'Route A-06',
  zone: 'Mira Road (East)',
  progress: 67,
  completed: 8,
  total: 12,
  eta: '14 min',
  distance: '3.2 km remaining',
};

const nextStops = [
  { binId: 'WIQ-0482', address: 'Station Road', fillLevel: 92, priority: 'P1', distance: '200m' },
  { binId: 'WIQ-0334', address: 'Market Lane', fillLevel: 78, priority: 'P2', distance: '450m' },
  { binId: 'WIQ-0176', address: 'Garden Colony', fillLevel: 65, priority: 'P2', distance: '800m' },
  { binId: 'WIQ-0923', address: 'Temple Street', fillLevel: 44, priority: 'P3', distance: '1.1 km' },
];

function getFillColor(level: number) {
  if (level >= 80) return 'var(--error)';
  if (level >= 60) return 'var(--warning)';
  return 'var(--primary)';
}

export default function DriverDashboard() {
  return (
    <div>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="headline-lg mb-1">Hello, Pradeep 🚛</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          You have an active route today
        </p>
      </motion.div>

      {/* Active Route Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5 mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(0,193,106,0.04), rgba(0,109,57,0.02))',
          borderLeft: '4px solid var(--primary)',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="title-lg">{mockRoute.name}</h2>
            <p className="flex items-center gap-1 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
              <MapPin size={12} /> {mockRoute.zone}
            </p>
          </div>
          <span
            className="text-[10px] font-bold uppercase px-3 py-1 rounded-full animate-pulse"
            style={{
              background: 'var(--success-container)',
              color: 'var(--primary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ● Active
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Route Progress</span>
            <span className="mono-sm font-bold">{mockRoute.completed}/{mockRoute.total} bins</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-high)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mockRoute.progress}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-container))' }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-2 rounded-lg text-center" style={{ background: 'var(--surface-lowest)' }}>
            <Clock size={14} style={{ color: 'var(--primary)', margin: '0 auto 4px' }} />
            <div className="mono-sm font-bold">{mockRoute.eta}</div>
            <span className="text-[9px]" style={{ color: 'var(--outline)' }}>ETA</span>
          </div>
          <div className="p-2 rounded-lg text-center" style={{ background: 'var(--surface-lowest)' }}>
            <Navigation size={14} style={{ color: 'var(--secondary)', margin: '0 auto 4px' }} />
            <div className="mono-sm font-bold">3.2 km</div>
            <span className="text-[9px]" style={{ color: 'var(--outline)' }}>Left</span>
          </div>
          <div className="p-2 rounded-lg text-center" style={{ background: 'var(--surface-lowest)' }}>
            <Gauge size={14} style={{ color: 'var(--tertiary)', margin: '0 auto 4px' }} />
            <div className="mono-sm font-bold">94%</div>
            <span className="text-[9px]" style={{ color: 'var(--outline)' }}>Efficiency</span>
          </div>
        </div>
      </motion.div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4 text-center"
        >
          <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
            <CountUp end={8} />
          </div>
          <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Bins Collected</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-4 text-center"
        >
          <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            <CountUp end={4.8} decimals={1} />
          </div>
          <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Today's Rating</span>
        </motion.div>
      </div>

      {/* Next Stops */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="title-md mb-3">Next Stops</h3>
        <div className="flex flex-col gap-2">
          {nextStops.map((stop, i) => (
            <Link key={stop.binId} href="/driver/route" className="no-underline">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className="card card-interactive p-4 flex items-center gap-3"
              >
                {/* Rank */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: i === 0 ? 'var(--error-container)' : 'var(--surface-low)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: i === 0 ? 'var(--error)' : 'var(--outline)',
                  }}
                >
                  {i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="mono-sm font-bold">{stop.binId}</span>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: i === 0 ? 'var(--error-container)' : 'var(--surface-high)',
                        color: i === 0 ? 'var(--error)' : 'var(--outline)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {stop.priority}
                    </span>
                  </div>
                  <p className="body-sm truncate" style={{ color: 'var(--on-surface-variant)' }}>
                    {stop.address}
                  </p>
                </div>

                {/* Fill + Distance */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className="mono-sm font-bold"
                    style={{ color: getFillColor(stop.fillLevel) }}
                  >
                    {stop.fillLevel}%
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--outline)' }}>
                    {stop.distance}
                  </span>
                </div>

                <ChevronRight size={14} style={{ color: 'var(--outline)', flexShrink: 0 }} />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
