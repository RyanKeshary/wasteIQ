/**
 * WasteIQ — Driver Dashboard
 * Active route status, today's stats, and next stop preview.
 */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowUpRight,
  TrendingUp,
  Fuel,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import CountUp from '@/components/effects/CountUp';
import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import('@/components/common/RealMap'), {
  ssr: false,
});

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
    <div className="space-y-6">
      {/* Top Header Section — Desktop Only Info */}
      <div className="hidden lg:flex justify-between items-end mb-8">
        <div>
          <h1 className="headline-lg">Welcome back, Pradeep! 👋</h1>
          <p className="body-md mt-1" style={{ color: 'var(--on-surface-variant)' }}>
            System Status: <span className="font-bold text-success">Operational</span> • Zone: Mira Road (East)
          </p>
        </div>
        <div className="flex gap-4">
          <div className="card px-4 py-2 flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] font-bold uppercase text-outline">Weather</span>
            <span className="mono-sm font-bold">28°C Clear</span>
          </div>
          <div className="card px-4 py-2 flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] font-bold uppercase text-outline">Vehicle</span>
            <span className="mono-sm font-bold">MH-04-AX-2291</span>
          </div>
        </div>
      </div>

      {/* Greeting (Mobile Only) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden mb-6"
      >
        <h1 className="headline-lg mb-1">Hello, Pradeep 🚛</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          You have an active route today
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Main Column: Active Route & Map (8/12 on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Enhanced Active Route Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-0 overflow-hidden"
            style={{
              background: 'var(--surface-lowest)',
              borderLeft: '6px solid var(--primary)',
            }}
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="headline-sm">{mockRoute.name}</h2>
                    <span
                      className="text-[10px] font-bold uppercase px-3 py-1 rounded-full text-success bg-success-container"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      ● Live
                    </span>
                  </div>
                  <p className="flex items-center gap-1 body-md opacity-70">
                    <MapPin size={16} /> {mockRoute.zone} — Operations Command
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/driver/route" className="btn-primary no-underline px-6">
                    <Play size={18} /> Resume Voyage
                  </Link>
                </div>
              </div>

              {/* Desktop Analytics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card bg-surface-low p-4 text-center border-none">
                  <Clock size={18} className="mx-auto mb-2 text-primary" />
                  <div className="title-md">{mockRoute.eta}</div>
                  <span className="text-[10px] uppercase text-outline">Arrival ETA</span>
                </div>
                <div className="card bg-surface-low p-4 text-center border-none">
                  <Navigation size={18} className="mx-auto mb-2 text-secondary" />
                  <div className="title-md">3.2 km</div>
                  <span className="text-[10px] uppercase text-outline">Distance Left</span>
                </div>
                <div className="card bg-surface-low p-4 text-center border-none">
                  <Zap size={18} className="mx-auto mb-2 text-tertiary" />
                  <div className="title-md">94.2%</div>
                  <span className="text-[10px] uppercase text-outline">Route Quality</span>
                </div>
                <div className="card bg-surface-low p-4 text-center border-none">
                  <Trash2 size={18} className="mx-auto mb-2 text-primary" />
                  <div className="title-md">8/12</div>
                  <span className="text-[10px] uppercase text-outline">Nodes Cleared</span>
                </div>
              </div>

              {/* Professional Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">Deployment Progress</span>
                  <span className="mono-sm font-bold text-primary">{mockRoute.progress}% Completed</span>
                </div>
                <div className="w-full h-4 rounded-full bg-surface-high overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockRoute.progress}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container relative"
                  >
                    <div className="absolute inset-0 bg-[rgba(255,255,255,0.2)] animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Desktop-Only Map Preview Integrated into Card */}
            <div className="hidden lg:block h-80 bg-surface-high relative border-t border-outline-variant">
              <div className="h-48 md:h-full relative overflow-hidden">
               <RealMap 
                 center={[19.2856, 72.8541]} 
                 zoom={15}
                 markers={[
                   { position: [19.2856, 72.8541], title: 'Active Target: WIQ-0482', description: 'Priority level high' }
                 ]}
               />
               <div className="absolute top-4 right-4 z-10">
                  <div className="card bg-white/90 backdrop-blur px-3 py-1.5 flex items-center gap-2 border-none text-[10px] font-bold shadow-xl">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                     LIVE TELEMETRY
                  </div>
               </div>
            </div>
            </div>
          </motion.div>

          {/* Expanded Secondary Stats (Desktop) */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            <div className="card p-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary-container/10">
                 <CheckCircle className="text-primary" />
               </div>
               <div>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-outline">Lifetime Collections</p>
               </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-secondary-container/10">
                 <AlertTriangle className="text-secondary" />
               </div>
               <div>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-outline">Missed Bins (MTD)</p>
               </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-tertiary-container/10">
                 <Zap className="text-tertiary" />
               </div>
               <div>
                  <div className="text-2xl font-bold">A+</div>
                  <p className="text-xs text-outline">Safety Performance</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Queue & Feed (4/12 on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="title-lg">Upcoming Node Queue</h3>
              <span className="mono-sm text-outline">{nextStops.length} stops</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {nextStops.map((stop, i) => (
                <Link key={stop.binId} href="/driver/route" className="no-underline group">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="card card-interactive p-4 flex items-center gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold"
                      style={{
                        background: i === 0 ? 'var(--error-container)' : 'var(--surface-low)',
                        color: i === 0 ? 'var(--error)' : 'var(--outline)',
                        fontSize: '14px'
                      }}
                    >
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="mono-sm font-bold">{stop.binId}</span>
                        <div className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${i === 0 ? 'bg-error text-white' : 'bg-surface-high text-outline'}`}>
                          {stop.priority}
                        </div>
                      </div>
                      <p className="body-sm truncate" style={{ color: 'var(--on-surface-variant)' }}>
                        {stop.address}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="mono-sm font-bold" style={{ color: getFillColor(stop.fillLevel) }}>
                        {stop.fillLevel}%
                      </div>
                      <div className="text-[10px] text-outline font-medium">{stop.distance}</div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <button className="btn-secondary w-full mt-6 text-sm py-3 border-dashed border-2">
              View Full Logistics Sheet
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Stats Box (Mirroring current mobile view) */}
      <div className="lg:hidden grid grid-cols-2 gap-3 pb-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-primary">8</div>
          <span className="body-sm text-outline">Bins Collected</span>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-on-surface">4.8</div>
          <span className="body-sm text-outline">Today's Rating</span>
        </div>
      </div>
    </div>
  );
}
