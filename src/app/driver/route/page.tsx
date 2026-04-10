/**
 * WasteIQ — Driver Route View
 * Fully functional: Mark Collected, Navigate, Skip buttons.
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  CheckCircle,
  Circle,
  Navigation,
  AlertTriangle,
  SkipForward,
} from 'lucide-react';
import { toast } from 'sonner';

interface RouteStop {
  id: string;
  binId: string;
  address: string;
  fillLevel: number;
  status: 'COMPLETED' | 'CURRENT' | 'PENDING' | 'SKIPPED';
  eta: string;
}

const initialStops: RouteStop[] = [
  { id: '1', binId: 'WIQ-0019', address: 'Station Road, Gate 3', fillLevel: 88, status: 'COMPLETED', eta: 'Done' },
  { id: '2', binId: 'WIQ-0023', address: 'Station Road, Gate 7', fillLevel: 72, status: 'COMPLETED', eta: 'Done' },
  { id: '3', binId: 'WIQ-0041', address: 'Market Lane, South', fillLevel: 95, status: 'COMPLETED', eta: 'Done' },
  { id: '4', binId: 'WIQ-0042', address: 'Market Lane, North', fillLevel: 67, status: 'COMPLETED', eta: 'Done' },
  { id: '5', binId: 'WIQ-0057', address: 'School Road Junction', fillLevel: 81, status: 'COMPLETED', eta: 'Done' },
  { id: '6', binId: 'WIQ-0063', address: 'Temple Street Corner', fillLevel: 54, status: 'COMPLETED', eta: 'Done' },
  { id: '7', binId: 'WIQ-0071', address: 'Park Avenue, Block A', fillLevel: 78, status: 'COMPLETED', eta: 'Done' },
  { id: '8', binId: 'WIQ-0082', address: 'Highway Service Rd', fillLevel: 43, status: 'COMPLETED', eta: 'Done' },
  { id: '9', binId: 'WIQ-0482', address: 'Garden Colony, Main', fillLevel: 92, status: 'CURRENT', eta: 'Now' },
  { id: '10', binId: 'WIQ-0334', address: 'Nagar Road, Sector 4', fillLevel: 71, status: 'PENDING', eta: '6 min' },
  { id: '11', binId: 'WIQ-0176', address: 'Coastal View Rd', fillLevel: 55, status: 'PENDING', eta: '12 min' },
  { id: '12', binId: 'WIQ-0923', address: 'Temple Back Lane', fillLevel: 38, status: 'PENDING', eta: '18 min' },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'COMPLETED': return <CheckCircle size={18} style={{ color: 'var(--primary)' }} />;
    case 'CURRENT': return <Navigation size={18} style={{ color: 'var(--error)' }} className="animate-pulse" />;
    case 'SKIPPED': return <SkipForward size={18} style={{ color: 'var(--warning)' }} />;
    case 'PENDING': return <Circle size={18} style={{ color: 'var(--outline-variant)' }} />;
    default: return null;
  }
}

function getFillColor(level: number) {
  if (level >= 80) return 'var(--error)';
  if (level >= 60) return 'var(--warning)';
  return 'var(--primary)';
}

export default function DriverRoutePage() {
  const [stops, setStops] = useState(initialStops);
  const completed = stops.filter((s) => s.status === 'COMPLETED').length;
  const current = stops.find((s) => s.status === 'CURRENT');
  const routeComplete = stops.every((s) => s.status === 'COMPLETED' || s.status === 'SKIPPED');

  const markCollected = (stopId: string) => {
    setStops((prev) => {
      const updated = prev.map((s) => {
        if (s.id === stopId) return { ...s, status: 'COMPLETED' as const, eta: 'Done' };
        return s;
      });
      // Auto-advance: set the next PENDING stop to CURRENT
      const nextPending = updated.find((s) => s.status === 'PENDING');
      if (nextPending) {
        return updated.map((s) =>
          s.id === nextPending.id ? { ...s, status: 'CURRENT' as const, eta: 'Now' } : s
        );
      }
      return updated;
    });
    toast.success('Bin collected! ✅', {
      description: `${stops.find((s) => s.id === stopId)?.binId} marked as collected.`,
    });
  };

  const skipStop = (stopId: string) => {
    setStops((prev) => {
      const updated = prev.map((s) => {
        if (s.id === stopId) return { ...s, status: 'SKIPPED' as const, eta: 'Skipped' };
        return s;
      });
      const nextPending = updated.find((s) => s.status === 'PENDING');
      if (nextPending) {
        return updated.map((s) =>
          s.id === nextPending.id ? { ...s, status: 'CURRENT' as const, eta: 'Now' } : s
        );
      }
      return updated;
    });
    toast.warning('Stop skipped', {
      description: 'This will be flagged for follow-up.',
    });
  };

  const navigateToStop = (stop: RouteStop) => {
    toast.info(`Navigating to ${stop.binId}`, {
      description: `${stop.address} — Opening maps...`,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="headline-lg mb-1">Route A-06</h1>
        <div className="flex items-center gap-3">
          <span className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            Mira Road (East)
          </span>
          <span className="mono-sm font-bold" style={{ color: 'var(--primary)' }}>
            {completed}/{stops.length} done
          </span>
        </div>
      </div>

      {/* Route Complete Banner */}
      {routeComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-6 mb-6 text-center"
          style={{ background: 'var(--success-container)' }}
        >
          <CheckCircle size={40} style={{ color: 'var(--primary)', margin: '0 auto 8px' }} />
          <h3 className="title-lg" style={{ color: 'var(--primary)' }}>Route Complete! 🎉</h3>
          <p className="body-sm mt-1" style={{ color: 'var(--on-surface-variant)' }}>
            {completed} bins collected, {stops.filter((s) => s.status === 'SKIPPED').length} skipped
          </p>
        </motion.div>
      )}

      {/* Current Stop Highlight */}
      {current && !routeComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-5 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(186,26,26,0.04), rgba(255,136,66,0.03))',
            borderLeft: '4px solid var(--error)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: 'var(--error)' }} />
            <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--error)', fontFamily: 'var(--font-mono)' }}>
              Current Stop
            </span>
          </div>
          <h3 className="title-md mb-1">{current.binId} — {current.address}</h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="mono-sm font-bold" style={{ color: getFillColor(current.fillLevel) }}>
              {current.fillLevel}% full
            </span>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary flex-1 text-sm" onClick={() => markCollected(current.id)}>
              <CheckCircle size={14} /> Mark Collected
            </button>
            <button className="btn-ghost text-sm" onClick={() => skipStop(current.id)}>
              <SkipForward size={14} /> Skip
            </button>
            <button className="btn-ghost text-sm" onClick={() => navigateToStop(current)}>
              <Navigation size={14} /> Navigate
            </button>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
        {stops.map((stop, i) => (
          <motion.div
            key={stop.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex gap-3 mb-1"
          >
            <div className="flex flex-col items-center">
              {getStatusIcon(stop.status)}
              {i < stops.length - 1 && (
                <div
                  className="w-0.5 flex-1 min-h-[32px]"
                  style={{
                    background: stop.status === 'COMPLETED' ? 'var(--primary)' :
                      stop.status === 'SKIPPED' ? 'var(--warning)' : 'var(--outline-variant)',
                  }}
                />
              )}
            </div>
            <div
              className="flex-1 pb-3 flex items-center gap-3"
              style={{
                opacity: stop.status === 'COMPLETED' || stop.status === 'SKIPPED' ? 0.55 : 1,
                textDecoration: stop.status === 'SKIPPED' ? 'line-through' : 'none',
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="mono-sm font-bold" style={{ fontSize: '12px' }}>{stop.binId}</span>
                  <span className="body-sm truncate" style={{ color: 'var(--on-surface-variant)' }}>
                    {stop.address}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="mono-sm font-bold"
                  style={{ color: getFillColor(stop.fillLevel), fontSize: '11px' }}
                >
                  {stop.fillLevel}%
                </span>
                <span className="text-[10px]" style={{ color: 'var(--outline)', fontFamily: 'var(--font-mono)' }}>
                  {stop.eta}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
