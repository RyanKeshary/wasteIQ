/**
 * WasteIQ — Admin Routes Page
 * Route management with functional Start/Pause/Complete actions.
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Route, MapPin, Truck, Clock, Play, Pause, CheckCircle, Plus, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface RouteItem {
  id: string;
  name: string;
  zone: string;
  driver: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  progress: number;
  completed: number;
  total: number;
  eta: string;
  distance: string;
}

const initialRoutes: RouteItem[] = [
  { id: '1', name: 'Route A-06', zone: 'Mira Road (East)', driver: 'Pradeep Kumar', status: 'ACTIVE', progress: 67, completed: 8, total: 12, eta: '14 min', distance: '3.2 km' },
  { id: '2', name: 'Route B-12', zone: 'Bhayandar Market', driver: 'Rajesh Mehta', status: 'ACTIVE', progress: 40, completed: 4, total: 10, eta: '35 min', distance: '5.1 km' },
  { id: '3', name: 'Route C-08', zone: 'Kashimira', driver: 'Suresh Patil', status: 'COMPLETED', progress: 100, completed: 14, total: 14, eta: '—', distance: '7.8 km' },
  { id: '4', name: 'Route D-15', zone: 'Shanti Nagar', driver: 'Anil Verma', status: 'PENDING', progress: 0, completed: 0, total: 9, eta: '40 min', distance: '4.2 km' },
  { id: '5', name: 'Route E-03', zone: 'Coastal Strip', driver: 'Manoj Singh', status: 'COMPLETED', progress: 100, completed: 11, total: 11, eta: '—', distance: '6.4 km' },
];

const statusConfig = {
  PENDING: { bg: 'var(--surface-high)', color: 'var(--outline)', label: 'Pending' },
  ACTIVE: { bg: 'var(--success-container)', color: 'var(--primary)', label: '● Active' },
  PAUSED: { bg: 'var(--warning-container)', color: 'var(--warning)', label: '⏸ Paused' },
  COMPLETED: { bg: 'var(--info-container)', color: 'var(--info)', label: '✓ Completed' },
};

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState(initialRoutes);

  const startRoute = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'ACTIVE' as const, progress: 5, completed: 0 } : r))
    );
    toast.success('Route started', { description: 'Driver has been notified to begin collections.' });
  };

  const pauseRoute = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'PAUSED' as const } : r))
    );
    toast.warning('Route paused', { description: 'Driver has been notified.' });
  };

  const resumeRoute = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'ACTIVE' as const } : r))
    );
    toast.success('Route resumed', { description: 'Driver has been notified to continue.' });
  };

  const completeRoute = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'COMPLETED' as const, progress: 100, completed: r.total } : r))
    );
    toast.success('Route completed! 🎉', { description: 'Performance data has been recorded.' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="headline-lg mb-1">Route Management</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            {routes.filter((r) => r.status === 'ACTIVE').length} active routes today
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => toast.info('Route planner module coming soon')}
        >
          <Plus size={14} /> New Route
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route, i) => {
          const sc = statusConfig[route.status];
          return (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="title-md">{route.name}</h3>
                  <p className="flex items-center gap-1 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                    <MapPin size={12} /> {route.zone}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                  style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-mono)' }}
                >
                  {sc.label}
                </span>
              </div>

              {/* Driver */}
              <div className="flex items-center gap-2 mb-3">
                <Truck size={14} style={{ color: 'var(--outline)' }} />
                <span className="body-sm" style={{ color: 'var(--on-surface)' }}>{route.driver}</span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="mono-sm" style={{ color: 'var(--outline)' }}>
                    {route.completed}/{route.total} bins
                  </span>
                  <span className="mono-sm font-bold">{route.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-high)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${route.progress}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: route.status === 'COMPLETED'
                        ? 'var(--info)'
                        : 'linear-gradient(90deg, var(--primary), var(--primary-container))',
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  <Clock size={12} /> ETA: {route.eta}
                </span>
                <span className="flex items-center gap-1 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  <Navigation size={12} /> {route.distance}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {route.status === 'PENDING' && (
                  <button className="btn-primary text-xs py-2 px-4 flex-1" onClick={() => startRoute(route.id)}>
                    <Play size={12} /> Start Route
                  </button>
                )}
                {route.status === 'ACTIVE' && (
                  <>
                    <button className="btn-ghost text-xs py-2 px-4 flex-1" onClick={() => pauseRoute(route.id)}>
                      <Pause size={12} /> Pause
                    </button>
                    <button className="btn-primary text-xs py-2 px-4 flex-1" onClick={() => completeRoute(route.id)}>
                      <CheckCircle size={12} /> Complete
                    </button>
                  </>
                )}
                {route.status === 'PAUSED' && (
                  <>
                    <button className="btn-primary text-xs py-2 px-4 flex-1" onClick={() => resumeRoute(route.id)}>
                      <Play size={12} /> Resume
                    </button>
                    <button className="btn-ghost text-xs py-2 px-4 flex-1" onClick={() => completeRoute(route.id)}>
                      <CheckCircle size={12} /> Complete
                    </button>
                  </>
                )}
                {route.status === 'COMPLETED' && (
                  <button
                    className="btn-ghost text-xs py-2 px-4 flex-1"
                    onClick={() => toast.info(`Route ${route.name} performance report coming soon`)}
                  >
                    View Report
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
