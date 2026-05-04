/**
 * WasteIQ — Admin Drivers Page
 * Driver management with functional Contact/Track/Toggle buttons.
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Truck, Phone, MapPin, Clock, ToggleLeft, ToggleRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface DriverItem {
  id: string;
  name: string;
  employeeId: string;
  vehicle: string;
  zone: string;
  status: 'active' | 'idle' | 'offline';
  binsToday: number;
  tripProgress: number;
  tripTotal: number;
  rating: number;
  phone: string;
}

const initialDrivers: DriverItem[] = [
  { id: '1', name: 'Pradeep Kumar', employeeId: 'DRV-001', vehicle: 'MH-04-AB-1234', zone: 'Mira Road (E)', status: 'active', binsToday: 8, tripProgress: 67, tripTotal: 12, rating: 4.8, phone: '+91 98765 43210' },
  { id: '2', name: 'Rajesh Mehta', employeeId: 'DRV-002', vehicle: 'MH-04-CD-5678', zone: 'Bhayandar Market', status: 'active', binsToday: 4, tripProgress: 40, tripTotal: 10, rating: 4.5, phone: '+91 98765 43211' },
  { id: '3', name: 'Suresh Patil', employeeId: 'DRV-003', vehicle: 'MH-04-EF-9012', zone: 'Kashimira', status: 'idle', binsToday: 14, tripProgress: 100, tripTotal: 14, rating: 4.9, phone: '+91 98765 43212' },
  { id: '4', name: 'Anil Verma', employeeId: 'DRV-004', vehicle: 'MH-04-GH-3456', zone: 'Shanti Nagar', status: 'offline', binsToday: 0, tripProgress: 0, tripTotal: 9, rating: 4.2, phone: '+91 98765 43213' },
  { id: '5', name: 'Manoj Singh', employeeId: 'DRV-005', vehicle: 'MH-04-IJ-7890', zone: 'Coastal Strip', status: 'idle', binsToday: 11, tripProgress: 100, tripTotal: 11, rating: 4.6, phone: '+91 98765 43214' },
];

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: 'var(--success-container)', color: 'var(--primary)', label: '● On Route' },
  idle: { bg: 'var(--info-container)', color: 'var(--info)', label: '● Idle' },
  offline: { bg: 'var(--surface-high)', color: 'var(--outline)', label: '○ Offline' },
};

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);

  const callDriver = (driver: DriverItem) => {
    toast.success(`Calling ${driver.name}...`, {
      description: `Phone: ${driver.phone}`,
      duration: 3000,
    });
  };

  const messageDriver = (driver: DriverItem) => {
    toast.success(`Message sent to ${driver.name}`, {
      description: 'The driver will receive a push notification.',
    });
  };

  const trackDriver = (driver: DriverItem) => {
    if (driver.status === 'offline') {
      toast.error(`Cannot track ${driver.name} — driver is offline`);
    } else {
      toast.info(`Tracking ${driver.name}`, {
        description: `Zone: ${driver.zone} — Live location on map`,
      });
    }
  };

  const toggleDriverStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const newStatus = d.status === 'offline' ? 'idle' : 'offline';
        toast.info(`${d.name} set to ${newStatus}`, {
          description: newStatus === 'offline' ? 'Driver will not receive new routes.' : 'Driver is now available for assignment.',
        });
        return { ...d, status: newStatus as 'idle' | 'offline' };
      })
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="headline-lg mb-1">Fleet Drivers</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            {drivers.filter((d) => d.status !== 'offline').length} active of {drivers.length} total
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver, i) => {
          const sc = statusConfig[driver.status];
          return (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {driver.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="title-sm">{driver.name}</h3>
                    <span className="mono-sm" style={{ color: 'var(--outline)' }}>{driver.employeeId}</span>
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-mono)' }}
                >
                  {sc.label}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2 mb-4">
                <span className="flex items-center gap-2 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  <Truck size={13} /> {driver.vehicle}
                </span>
                <span className="flex items-center gap-2 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  <MapPin size={13} /> {driver.zone}
                </span>
              </div>

              {/* Trip Progress */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="mono-sm" style={{ color: 'var(--outline)' }}>
                    Today: {driver.binsToday} bins
                  </span>
                  <span className="mono-sm font-bold">{driver.tripProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-high)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${driver.tripProgress}%`,
                      background: 'var(--primary)',
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium"
                  style={{ background: 'var(--surface-low)', border: 'none', cursor: 'pointer', color: 'var(--on-surface)' }}
                  onClick={() => callDriver(driver)}
                >
                  <Phone size={12} /> Call
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium"
                  style={{ background: 'var(--surface-low)', border: 'none', cursor: 'pointer', color: 'var(--on-surface)' }}
                  onClick={() => messageDriver(driver)}
                >
                  <MessageSquare size={12} /> Msg
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium"
                  style={{ background: 'var(--surface-low)', border: 'none', cursor: 'pointer', color: 'var(--on-surface)' }}
                  onClick={() => trackDriver(driver)}
                >
                  <MapPin size={12} /> Track
                </button>
                <button
                  className="p-2 rounded-lg"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => toggleDriverStatus(driver.id)}
                  title="Toggle availability"
                >
                  {driver.status === 'offline' ? (
                    <ToggleLeft size={18} style={{ color: 'var(--outline)' }} />
                  ) : (
                    <ToggleRight size={18} style={{ color: 'var(--primary)' }} />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
