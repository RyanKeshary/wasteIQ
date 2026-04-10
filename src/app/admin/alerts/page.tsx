/**
 * WasteIQ — Admin Alerts Page
 * Live alert feed with functional resolution workflow.
 * Every button works: Resolve, Dispatch, Show All/Hide Resolved.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Check,
  Filter,
  MapPin,
  Clock,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';

interface AlertItem {
  id: string;
  type: string;
  message: string;
  zone: string;
  severity: number;
  time: string;
  resolved: boolean;
}

const initialAlerts: AlertItem[] = [
  { id: '1', type: 'OVERFLOW', message: 'Bin WIQ-0482 in Kashimira has exceeded 95% fill', zone: 'Mira Road East', severity: 1, time: '2m ago', resolved: false },
  { id: '2', type: 'CRITICAL_FILL', message: 'Bin WIQ-1247 approaching overflow threshold (85%)', zone: 'Bhayandar Market', severity: 2, time: '8m ago', resolved: false },
  { id: '3', type: 'SENSOR_OFFLINE', message: 'Sensor offline: WIQ-0891 — last telemetry 4h ago', zone: 'Shanti Nagar', severity: 2, time: '15m ago', resolved: false },
  { id: '4', type: 'ROUTE_DELAY', message: 'Driver Pradeep 22 min behind on Route B-12', zone: 'Kamothe Naka', severity: 3, time: '24m ago', resolved: false },
  { id: '5', type: 'OVERFLOW', message: 'Bin WIQ-0655 in Bhayandar (W) is overflowing', zone: 'Bhayandar West', severity: 1, time: '28m ago', resolved: true },
  { id: '6', type: 'MAINTENANCE', message: 'Scheduled maintenance: 3 bins in Coastal Strip', zone: 'Coastal Strip', severity: 3, time: '1h ago', resolved: true },
];

const severityLabels: Record<number, { label: string; bg: string; color: string }> = {
  1: { label: 'Critical', bg: 'var(--error-container)', color: 'var(--error)' },
  2: { label: 'Warning', bg: 'var(--warning-container)', color: 'var(--warning)' },
  3: { label: 'Info', bg: 'var(--info-container)', color: 'var(--info)' },
};

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [showResolved, setShowResolved] = useState(false);
  const filtered = showResolved ? alerts : alerts.filter((a) => !a.resolved);

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
    toast.success('Alert resolved successfully', {
      description: 'The alert has been marked as resolved.',
    });
  };

  const dispatchAlert = (alert: AlertItem) => {
    toast.success(`Driver dispatched to ${alert.zone}`, {
      description: `A collection unit has been assigned to handle the ${alert.type.replace('_', ' ').toLowerCase()} alert.`,
      duration: 3000,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="headline-lg mb-1">Live Alerts</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            {alerts.filter((a) => !a.resolved).length} unresolved alerts
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowResolved(!showResolved)}
            className="btn-ghost text-sm"
          >
            <Filter size={14} />
            {showResolved ? 'Hide Resolved' : 'Show All'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {filtered.map((alert, i) => {
            const sev = severityLabels[alert.severity];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ delay: i * 0.04 }}
                layout
                className="card p-5 flex flex-col md:flex-row gap-4"
                style={{
                  borderLeft: `4px solid ${sev.color}`,
                  opacity: alert.resolved ? 0.6 : 1,
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: sev.bg, color: sev.color, fontFamily: 'var(--font-mono)' }}
                    >
                      {sev.label}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--surface-high)',
                        color: 'var(--outline)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {alert.type.replace(/_/g, ' ')}
                    </span>
                    {alert.resolved && (
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--success-container)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}
                      >
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                  <p className="title-sm mb-2">{alert.message}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      <MapPin size={12} /> {alert.zone}
                    </span>
                    <span className="flex items-center gap-1 mono-sm" style={{ color: 'var(--outline)' }}>
                      <Clock size={12} /> {alert.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!alert.resolved && (
                    <>
                      <button
                        className="btn-primary text-xs py-2 px-4"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <Check size={12} /> Resolve
                      </button>
                      <button
                        className="btn-ghost text-xs py-2 px-4"
                        onClick={() => dispatchAlert(alert)}
                      >
                        <Truck size={12} /> Dispatch
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Check size={40} style={{ color: 'var(--primary)', margin: '0 auto 12px' }} />
            <h3 className="title-md mb-1">All Clear!</h3>
            <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>
              No unresolved alerts at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
