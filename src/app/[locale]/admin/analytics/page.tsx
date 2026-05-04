/**
 * WasteIQ — Admin Analytics Page
 * High-level analytics dashboard with summary metrics and charts.
 */
'use client';

import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Recycle,
  Gauge,
  ArrowUpRight,
  Info
} from 'lucide-react';
import CountUp from '@/components/effects/CountUp';

const trendData = [
  { name: 'Mon', tons: 45 },
  { name: 'Tue', tons: 52 },
  { name: 'Wed', tons: 48 },
  { name: 'Thu', tons: 61 },
  { name: 'Fri', tons: 55 },
  { name: 'Sat', tons: 67 },
  { name: 'Sun', tons: 40 },
];

const compositionData = [
  { name: 'Organic', value: 42, color: 'var(--primary)' },
  { name: 'Recyclable', value: 28, color: 'var(--secondary)' },
  { name: 'Mixed', value: 18, color: 'var(--tertiary)' },
  { name: 'Hazardous', value: 12, color: 'var(--error)' },
];

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
        <div className="card p-6 min-h-[350px]">
          <h3 className="title-md mb-6">Weekly Collection Flux</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="fluxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--outline)' }} />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-lowest)', borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tons" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#fluxGradient)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 min-h-[350px]">
          <h3 className="title-md mb-6">Volume Composition</h3>
          <div className="h-64 w-full flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 flex flex-col gap-3 ml-4">
               {compositionData.map((cat) => (
                 <div key={cat.name} className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[10px] font-bold uppercase opacity-60">{cat.name}</span>
                       <span className="text-xs font-bold">{cat.value}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-low overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.value}%` }}
                          className="h-full rounded-full" 
                          style={{ background: cat.color }} 
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
