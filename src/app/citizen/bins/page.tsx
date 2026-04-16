/**
 * WasteIQ — Citizen Nearby Bins Page
 * Functional: Navigate buttons open Google Maps, sort toggle works.
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/admin/LiveMap'), {
  ssr: false,
});

interface NearbyBin {
  id: string;
  qrCode: string;
  address: string;
  distance: string;
  distanceM: number;
  fillLevel: number;
  type: string;
  sensorOnline: boolean;
  lat: number;
  lng: number;
}

const nearbyBins: NearbyBin[] = [
  { id: '1', qrCode: 'WIQ-0482', address: 'Station Road, Mira Road (E)', distance: '120m', distanceM: 120, fillLevel: 42, type: 'DRY', sensorOnline: true, lat: 19.2815, lng: 72.8456 },
  { id: '2', qrCode: 'WIQ-0334', address: 'Market Lane, Bhayandar', distance: '280m', distanceM: 280, fillLevel: 67, type: 'WET', sensorOnline: true, lat: 19.2892, lng: 72.8501 },
  { id: '3', qrCode: 'WIQ-0176', address: 'Garden Colony', distance: '450m', distanceM: 450, fillLevel: 23, type: 'MIXED', sensorOnline: true, lat: 19.2780, lng: 72.8400 },
  { id: '4', qrCode: 'WIQ-0923', address: 'Coastal Road', distance: '620m', distanceM: 620, fillLevel: 88, type: 'RECYCLABLE', sensorOnline: false, lat: 19.2750, lng: 72.8380 },
  { id: '5', qrCode: 'WIQ-0655', address: 'Temple Street', distance: '800m', distanceM: 800, fillLevel: 15, type: 'DRY', sensorOnline: true, lat: 19.2900, lng: 72.8520 },
];

function getFillColor(level: number) {
  if (level >= 80) return 'var(--error)';
  if (level >= 60) return 'var(--warning)';
  return 'var(--primary)';
}

const typeColors: Record<string, string> = {
  DRY: 'var(--secondary)',
  WET: 'var(--primary)',
  MIXED: 'var(--outline)',
  RECYCLABLE: 'var(--info)',
  HAZARDOUS: 'var(--error)',
};

type SortMode = 'distance' | 'fill';

export default function CitizenBinsPage() {
  const [sortMode, setSortMode] = useState<SortMode>('distance');
  const sorted = [...nearbyBins].sort((a, b) =>
    sortMode === 'distance' ? a.distanceM - b.distanceM : b.fillLevel - a.fillLevel
  );

  const navigateToBin = (bin: NearbyBin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`;
    window.open(url, '_blank');
    toast.success(`Opening directions to ${bin.qrCode}`, {
      description: bin.address,
    });
  };

  const toggleSort = () => {
    const newMode = sortMode === 'distance' ? 'fill' : 'distance';
    setSortMode(newMode);
    toast(newMode === 'distance' ? 'Sorted by distance' : 'Sorted by fill level', {
      duration: 1500,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="headline-lg mb-1">Nearby Bins</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            {nearbyBins.length} bins within 1km of your location
          </p>
        </div>
        <button className="btn-ghost text-xs" onClick={toggleSort}>
          <ArrowUpDown size={14} />
          {sortMode === 'distance' ? 'By Distance' : 'By Fill %'}
        </button>
      </div>

      {/* Map Interactive View */}
      <div className="card p-0 overflow-hidden mb-6 relative z-0" style={{ height: '350px' }}>
        <LiveMap />
      </div>

      {/* Bin List */}
      <div className="flex flex-col gap-3">
        {sorted.map((bin, i) => (
          <motion.div
            key={bin.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            layout
            className="card card-interactive p-4 flex items-center gap-4"
          >
            {/* Fill Gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="var(--surface-high)" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20" fill="none"
                  stroke={getFillColor(bin.fillLevel)}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(bin.fillLevel / 100) * 125.6} 125.6`}
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <span
                className="absolute text-[10px] font-bold"
                style={{ fontFamily: 'var(--font-mono)', color: getFillColor(bin.fillLevel) }}
              >
                {bin.fillLevel}%
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="mono-sm font-bold">{bin.qrCode}</span>
                <span
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  style={{ background: `${typeColors[bin.type]}15`, color: typeColors[bin.type], fontFamily: 'var(--font-mono)' }}
                >
                  {bin.type}
                </span>
                {!bin.sensorOnline && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--error-container)', color: 'var(--error)', fontFamily: 'var(--font-mono)' }}>
                    OFFLINE
                  </span>
                )}
              </div>
              <p className="body-sm truncate" style={{ color: 'var(--on-surface-variant)' }}>
                {bin.address}
              </p>
            </div>

            {/* Distance + Navigate */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="mono-sm font-bold" style={{ color: 'var(--on-surface)' }}>{bin.distance}</span>
              <button
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
                style={{
                  background: 'var(--success-container)',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--primary)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToBin(bin);
                }}
              >
                <Navigation size={10} /> Navigate
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
