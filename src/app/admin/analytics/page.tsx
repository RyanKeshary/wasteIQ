/**
 * WasteIQ — Admin Analytics Page
 * High-level analytics dashboard with summary metrics and charts.
 */
'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Recycle,
  Gauge,
  ArrowUpRight,
} from 'lucide-react';
import CountUp from '@/components/effects/CountUp';

export default function AdminAnalyticsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="headline-lg mb-1">Analytics Overview</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            City-wide waste management performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range, i) => (
            <button
              key={range}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: i === 1 ? 'var(--primary)' : 'var(--surface-lowest)',
                color: i === 1 ? 'white' : 'var(--on-surface-variant)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Waste Collected', value: 452.8, suffix: ' tons', color: 'var(--primary)', icon: Recycle, trend: '+14%' },
          { label: 'Collection Rate', value: 94.2, suffix: '%', color: 'var(--primary)', icon: Gauge, trend: '+2.1%' },
          { label: 'Carbon Offset', value: 12480, suffix: 'kg', color: 'var(--secondary)', icon: Leaf, trend: '+8.3%' },
          { label: 'Diversion Rate', value: 75, suffix: '%', color: 'var(--tertiary)', icon: TrendingUp, trend: '+4.7%' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} style={{ color: stat.color }} />
                <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  <ArrowUpRight size={12} /> {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.suffix === ' tons' || stat.suffix === '%' ? 1 : 0} />
              </div>
              <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>{stat.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="title-md mb-4">Weekly Collection Trend</h3>
          <div className="flex items-end gap-2 h-48 px-4 pb-4" style={{ background: 'var(--surface-low)', borderRadius: 'var(--radius-lg)' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const heights = [65, 78, 72, 85, 92, 70, 55];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${heights[i]}%`,
                      background: `linear-gradient(to top, var(--primary), var(--primary-container))`,
                      opacity: 0.6 + (i / 7) * 0.4,
                    }}
                  />
                  <span className="text-[9px] font-bold" style={{ color: 'var(--outline)' }}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="title-md mb-4">Waste Composition</h3>
          <div className="flex items-center gap-8 h-48">
            {/* Horizontal stacked bar */}
            <div className="flex-1 flex flex-col gap-3">
              {[
                { label: 'Organic', pct: 42, color: 'var(--primary)' },
                { label: 'Recyclable', pct: 28, color: 'var(--secondary)' },
                { label: 'Mixed', pct: 18, color: 'var(--tertiary)' },
                { label: 'Hazardous', pct: 12, color: 'var(--error)' },
              ].map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between mb-1">
                    <span className="body-sm">{cat.label}</span>
                    <span className="mono-sm font-bold">{cat.pct}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-high)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.pct}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zone Performance Grid */}
      <div className="card p-6">
        <h3 className="title-md mb-4">Zone Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { zone: 'Mira Road (E)', score: 96 },
            { zone: 'Bhayandar Mkt', score: 88 },
            { zone: 'Kashimira', score: 91 },
            { zone: 'Coastal Strip', score: 84 },
            { zone: 'Shanti Nagar', score: 79 },
            { zone: 'Kamothe Naka', score: 93 },
          ].map((z) => (
            <div
              key={z.zone}
              className="p-4 rounded-xl text-center"
              style={{
                background: z.score >= 90 ? 'var(--success-container)' : z.score >= 80 ? 'var(--surface-low)' : 'var(--warning-container)',
              }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: z.score >= 90 ? 'var(--primary)' : z.score >= 80 ? 'var(--on-surface)' : 'var(--warning)',
                }}
              >
                {z.score}%
              </div>
              <span className="body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: '11px' }}>{z.zone}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
