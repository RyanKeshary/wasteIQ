'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Truck, CheckCircle, AlertTriangle, Users } from 'lucide-react';

interface Activity {
  id: number;
  icon: any;
  color: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

const activityPool = [
  { icon: Truck, color: '#00C16A', user: 'Driver PR-01', action: 'collected bin', target: 'WIQ-0482', time: 'Just now' },
  { icon: CheckCircle, color: '#39B8FD', user: 'Admin Sarah', action: 'optimized route', target: 'Ward 4-B', time: '1m ago' },
  { icon: Zap, color: '#FF8842', user: 'Sensor Node', action: 'reported overflow', target: 'WIQ-0923', time: '2m ago' },
  { icon: Users, color: '#9D4300', user: 'Citizen Rahul', action: 'raised feedback', target: 'Market Lane', time: '3m ago' },
  { icon: AlertTriangle, color: '#BA1A1A', user: 'System', action: 'detected anomaly', target: 'Sensor-X2', time: '5m ago' },
];

/**
 * LiveActivityShowcase
 * An elegant, floating vertical feed showing live system events.
 * Perfect for landing pages or high-level dashboards.
 */
const LiveActivityShowcase: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Initial batch
    setActivities(activityPool.slice(0, 3).map((a, i) => ({ ...a, id: i })));

    // Interval to add new activities
    const interval = setInterval(() => {
      setActivities((prev) => {
        const newItem = activityPool[Math.floor(Math.random() * activityPool.length)];
        const nextId = prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 0;
        const updated = [{ ...newItem, id: nextId }, ...prev];
        return updated.slice(0, 4); // Keep last 4
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[320px]">
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="mono-sm text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
          Live System Pulse
        </span>
      </div>
      
      <div className="relative space-y-3">
        <AnimatePresence initial={false}>
          {activities.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              layout
              className="glass p-4 rounded-2xl flex items-start gap-3 border border-white/20 shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-inner"
                style={{ background: `${item.color}15`, color: item.color }}
              >
                <item.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="title-sm !text-[12px] leading-none mb-1">
                  <span className="font-bold">{item.user}</span>
                </p>
                <p className="body-xs text-outline line-clamp-1">
                  {item.action} <span className="text-primary font-bold">{item.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="mono-sm text-[9px] opacity-40 uppercase tracking-tighter">
                    {item.time}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Bottom Fade Gradient to make it look like a list that goes on */}
        <div className="absolute -bottom-4 left-0 right-0 h-12 bg-gradient-to-t from-[var(--surface)] to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default LiveActivityShowcase;
