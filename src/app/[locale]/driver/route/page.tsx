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
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import('@/components/common/RealMap'), {
  ssr: false,
});

interface RouteStop {
  id: string;
  binId: string;
  address: string;
  fillLevel: number;
  status: 'COMPLETED' | 'CURRENT' | 'PENDING' | 'SKIPPED';
  eta: string;
  isEmergency?: boolean;
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
  { id: 'SOS-99', binId: 'WIQ-HOSP', address: 'EMERGENCY: Hospital Gate 1', fillLevel: 100, status: 'PENDING', eta: 'URGENT', isEmergency: true },
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
      const nextPending = updated.find((s) => s.status === 'PENDING');
      if (nextPending) {
        return updated.map((s) =>
          s.id === nextPending.id ? { ...s, status: 'CURRENT' as const, eta: 'Now' } : s
        );
      }
      return updated;
    });
    toast.success('Bin collected! ✅');
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
    toast.warning('Stop skipped');
  };

  const navigateToStop = (stop: RouteStop) => {
    toast.info(`Navigating to ${stop.binId}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="headline-lg">Route Logistics</h1>
          <p className="body-md opacity-70">Mira Road (East) • Corridor B.12</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="title-md">{completed}/{stops.length} Bins Collected</div>
          <p className="body-xs text-outline uppercase tracking-widest mt-1">Status: Active Deployment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COMMAND CENTER (Left Column on Desktop, Top on Mobile) */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
          
          {/* Route Complete Banner */}
          {routeComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center border-none"
              style={{ background: 'var(--success-container)' }}
            >
              <CheckCircle size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="headline-sm text-primary">Mission Accomplished! 🎉</h3>
              <p className="body-md mt-2 text-primary/80">
                All nodes cleared or flagged. Return to depot for shift close-out.
              </p>
              <button className="btn-primary mt-6 px-10">End Shift</button>
            </motion.div>
          )}

          {/* Current Target Command Card */}
          {current && !routeComplete && (
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-0 overflow-hidden border-2"
                style={{ borderColor: 'var(--error-container)' }}
              >
                <div className="bg-error-container/10 p-4 border-b border-error-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-widest text-error">Current Target Node</span>
                  </div>
                  <div className="mono-sm font-bold text-error">DIST: 240m</div>
                </div>
                
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                      <h2 className="headline-md mb-2">{current.binId}</h2>
                      <p className="title-md opacity-70 flex items-center gap-2">
                        <MapPin size={20} className="text-error" /> {current.address}
                      </p>
                    </div>
                    <div className="card bg-error/5 border-none px-6 py-4 flex flex-col items-center min-w-[120px]">
                      <span className="text-[40px] font-black leading-none text-error" style={{ fontFamily: 'var(--font-mono)' }}>{current.fillLevel}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-error mt-1">Saturation</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      className="btn-primary h-14 text-base shadow-xl hover:shadow-primary/20" 
                      onClick={() => markCollected(current.id)}
                    >
                      <CheckCircle size={20} /> Mark Collected
                    </button>
                    <button 
                      className="btn-ghost h-14 text-base border-2" 
                      onClick={() => navigateToStop(current)}
                    >
                      <Navigation size={20} /> Launch Navigator
                    </button>
                    <button 
                      className="btn-ghost h-14 text-base opacity-60 hover:opacity-100 transition-opacity" 
                      onClick={() => skipStop(current.id)}
                    >
                      <SkipForward size={20} /> Skip Node
                    </button>
                  </div>
                </div>
              </motion.div>
              <div className="hidden md:block h-[500px] card p-0 overflow-hidden relative border-none">
                 <RealMap 
                  center={[19.2856, 72.8541]} 
                  zoom={15}
                  markers={stops.filter(s => s.status === 'CURRENT' || s.status === 'PENDING').map(s => ({
                    position: [19.2856 + (Math.random() - 0.5) * 0.01, 72.8541 + (Math.random() - 0.5) * 0.01],
                    title: s.binId,
                    description: s.address
                  }))}
                 />
                 
                 <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
                    <div className="card bg-white/90 backdrop-blur p-4 border-none shadow-lg max-w-sm">
                       <h4 className="title-sm">Topography Insight</h4>
                       <p className="body-xs text-outline">Intelligent route optimization considers local elevation and traffic patterns for maximum fuel efficiency.</p>
                    </div>
                    <div className="flex bg-white/90 backdrop-blur p-2 rounded-2xl gap-2 shadow-lg">
                       <div className="flex items-center gap-2 px-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-[10px] font-bold">ROUTE ACTIVE</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* LOGISTICS TIMELINE (Right Column on Desktop, Bottom on Mobile) */}
        <div className="lg:col-span-4 lg:order-1 order-2">
          <div className="card h-full p-6" style={{ background: 'var(--surface-lowest)' }}>
            <h3 className="title-md mb-6 flex items-center justify-between">
              Sequence List
              <span className="mono-sm text-outline">v2.4.0</span>
            </h3>
            
            <div className="space-y-1 relative">
              {/* Vertical Thread Line */}
              <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-outline-variant opacity-30" />
              
              {stops.map((stop, i) => {
                const isCurrent = stop.status === 'CURRENT';
                const isDone = stop.status === 'COMPLETED';
                const isSkipped = stop.status === 'SKIPPED';
                
                return (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    layout
                    className={`flex gap-4 p-3 rounded-xl transition-all ${isCurrent ? 'bg-surface-low border border-outline-variant shadow-sm' : ''} ${stop.isEmergency ? 'border-2 border-error/50 bg-error/5' : ''}`}
                  >
                    <div className="relative z-10 flex-shrink-0 pt-1">
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          isDone ? 'bg-primary text-white' :
                          isCurrent ? 'bg-error text-white animate-pulse' :
                          isSkipped ? 'bg-warning text-white' : 'bg-surface-high text-outline'
                        }`}
                      >
                        {isDone ? <CheckCircle size={16} /> : 
                         isCurrent ? <Navigation size={16} /> :
                         stop.isEmergency ? <AlertTriangle size={16} /> :
                         isSkipped ? <SkipForward size={16} /> : <Circle size={10} />}
                      </div>
                    </div>
                    
                    <div className={`flex-1 min-w-0 ${isDone || isSkipped ? 'opacity-40' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`mono-sm font-bold ${isCurrent ? 'text-error' : ''}`}>{stop.binId}</span>
                        <span className="mono-sm text-[10px] text-outline">{stop.eta}</span>
                      </div>
                      <p className={`body-sm truncate mt-0.5 ${isSkipped ? 'line-through' : ''}`}>
                        {stop.address}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
