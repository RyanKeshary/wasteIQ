/**
 * WasteIQ — Admin Operations Dashboard
 * The main admin view. Reference UI: wasteiq_admin_dashboard_with_footer
 * 
 * Shows: 4 stat cards, city map, live alert feed, fill level chart, AI insights.
 */
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/admin/LiveMap'), { ssr: false });
import { motion } from 'framer-motion';
import {
  Trash2,
  AlertTriangle,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  Clock,
  Brain,
  ChevronRight,
} from 'lucide-react';
import ScrollReveal from '@/components/effects/ScrollReveal';
import CountUp from '@/components/effects/CountUp';

// ── Mock Data ───────────────────────────────────────────────

const statCards = [
  {
    label: 'Total Bins',
    value: 1242,
    trend: '+12',
    trendUp: true,
    color: 'var(--primary)',
    bgColor: 'var(--success-container)',
    icon: Trash2,
  },
  {
    label: 'Overflow Now',
    value: 18,
    trend: '-3',
    trendUp: false,
    color: 'var(--error)',
    bgColor: 'var(--error-container)',
    icon: AlertTriangle,
  },
  {
    label: 'Critical Bins',
    value: 47,
    trend: '+5',
    trendUp: true,
    color: 'var(--tertiary)',
    bgColor: 'var(--warning-container)',
    icon: Activity,
  },
  {
    label: 'Avg Fill Level',
    value: 62,
    suffix: '%',
    trend: '+2.1%',
    trendUp: true,
    color: 'var(--secondary)',
    bgColor: 'var(--info-container)',
    icon: TrendingUp,
  },
];

const mockAlerts = [
  {
    id: '1',
    type: 'OVERFLOW',
    message: 'Bin #0482 in Kashimira has reached 98% capacity',
    zone: 'Mira Road East',
    severity: 1,
    time: '2m ago',
    color: 'var(--error)',
  },
  {
    id: '2',
    type: 'CRITICAL_FILL',
    message: 'Bin #1247 approaching critical threshold (85%)',
    zone: 'Bhayandar Market',
    severity: 2,
    time: '8m ago',
    color: 'var(--tertiary)',
  },
  {
    id: '3',
    type: 'SENSOR_OFFLINE',
    message: 'Sensor offline on Bin #0891 — last ping 4h ago',
    zone: 'Shanti Nagar',
    severity: 2,
    time: '15m ago',
    color: 'var(--outline)',
  },
  {
    id: '4',
    type: 'ROUTE_DELAY',
    message: 'Driver Pradeep delayed by 22 min on Route B-12',
    zone: 'Kamothe Naka',
    severity: 3,
    time: '24m ago',
    color: 'var(--secondary)',
  },
];

const mockInsights = [
  {
    title: 'Market Zone Overload',
    insight: 'Bhayandar Market zone shows 34% higher fill rates than average. Recommend adding 2 evening collection runs.',
    action: 'Adjust Schedule',
    severity: 'high' as const,
  },
  {
    title: 'Route Efficiency Drop',
    insight: 'North sector routes showing 12% longer completion times due to construction on MG Road.',
    action: 'Reroute Fleet',
    severity: 'medium' as const,
  },
  {
    title: 'Sensor Batch Warning',
    insight: '8 sensors in Coastal Strip reporting low battery (<15%). Schedule maintenance within 48h.',
    action: 'Create Ticket',
    severity: 'low' as const,
  },
];

const severityColors = {
  high: { bg: 'var(--error-container)', text: 'var(--error)' },
  medium: { bg: 'var(--warning-container)', text: 'var(--warning)' },
  low: { bg: 'var(--info-container)', text: 'var(--info)' },
};

export default function AdminDashboard() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="headline-lg mb-1">Operations Dashboard</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          Real-time city waste management — Mira-Bhayandar
        </p>
      </div>

      {/* ── 4 Stat Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="card p-5 relative overflow-hidden"
            >
              {/* Top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                style={{ background: stat.color }}
              />
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: stat.bgColor }}
                >
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
                <span
                  className="flex items-center gap-0.5 text-xs font-semibold"
                  style={{
                    color: stat.trendUp ? 'var(--primary)' : 'var(--error)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </span>
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <CountUp end={stat.value} suffix={stat.suffix || ''} />
              </div>
              <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ── Map + Alert Feed ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Map (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 card p-0 overflow-hidden"
          style={{ minHeight: '400px' }}
        >
          <div
            className="w-full h-full relative"
            style={{ minHeight: '400px' }}
          >
            <LiveMap />
          </div>
        </motion.div>

        {/* Live Alert Feed (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={loaded ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="card p-5 flex flex-col"
          style={{ maxHeight: '500px' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="title-md">Live Alerts</h3>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
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
              LIVE
            </div>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {mockAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="p-3 rounded-xl flex gap-3"
                style={{
                  background: 'var(--surface-low)',
                  borderLeft: `3px solid ${alert.color}`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="body-sm font-medium mb-1" style={{ color: 'var(--on-surface)' }}>
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="chip chip-neutral text-[10px]">{alert.zone}</span>
                    <span
                      className="mono-sm"
                      style={{ color: 'var(--outline)', fontSize: '10px' }}
                    >
                      {alert.time}
                    </span>
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold self-start px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: i === 0 ? 'var(--error-container)' : 'var(--surface-high)',
                    color: i === 0 ? 'var(--error)' : 'var(--outline)',
                  }}
                >
                  P{alert.severity}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Charts + AI Insights ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fill Level Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="lg:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="title-md">Fill Level Trend — 24h</h3>
            <span className="mono-sm" style={{ color: 'var(--outline)' }}>
              Last updated: 14:32 IST
            </span>
          </div>
          {/* Chart placeholder */}
          <div
            className="w-full rounded-xl flex items-end gap-1 px-4 pb-4 pt-8"
            style={{ height: '200px', background: 'var(--surface-low)' }}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const h = 30 + Math.random() * 50;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-md transition-all"
                  style={{
                    height: `${h}%`,
                    background:
                      h > 70
                        ? 'var(--tertiary-container)'
                        : h > 50
                          ? 'var(--primary-container)'
                          : 'var(--primary)',
                    opacity: 0.7 + (i / 24) * 0.3,
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* AI Insight Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={loaded ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain size={18} style={{ color: 'var(--primary)' }} />
            <h3 className="title-md">AI Insights</h3>
          </div>

          <div className="flex flex-col gap-3">
            {mockInsights.map((insight, i) => (
              <div
                key={i}
                className="p-3 rounded-xl"
                style={{ background: 'var(--surface-low)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: severityColors[insight.severity].bg,
                      color: severityColors[insight.severity].text,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {insight.severity}
                  </span>
                  <h4 className="title-sm flex-1">{insight.title}</h4>
                </div>
                <p className="body-sm mb-2" style={{ color: 'var(--on-surface-variant)' }}>
                  {insight.insight}
                </p>
                <button
                  className="text-xs font-semibold flex items-center gap-1"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {insight.action} <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
