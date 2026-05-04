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
  { id: '1', qrCode: 'WIQ-0482', address: 'Station Road, Mira Road (E)', distance: '120m', distanceM: 120, fillLevel: 42, type: 'DRY', sensorOnline: true, lat: 19.281, lng: 72.855 },
  { id: '2', qrCode: 'WIQ-0334', address: 'Market Lane, Bhayandar', distance: '280m', distanceM: 280, fillLevel: 67, type: 'WET', sensorOnline: true, lat: 19.288, lng: 72.859 },
  { id: '3', qrCode: 'WIQ-0176', address: 'Garden Colony', distance: '450m', distanceM: 450, fillLevel: 23, type: 'MIXED', sensorOnline: true, lat: 19.295, lng: 72.851 },
  { id: '4', qrCode: 'WIQ-0923', address: 'Coastal Road', distance: '620m', distanceM: 620, fillLevel: 88, type: 'RECYCLABLE', sensorOnline: false, lat: 19.278, lng: 72.862 },
  { id: '5', qrCode: 'WIQ-0655', address: 'Temple Street', distance: '800m', distanceM: 800, fillLevel: 15, type: 'DRY', sensorOnline: true, lat: 19.284, lng: 72.848 },
  { id: '6', qrCode: 'WIQ-0112', address: 'Silver Park Circle', distance: '920m', distanceM: 920, fillLevel: 30, type: 'WET', sensorOnline: true, lat: 19.272, lng: 72.852 },
  { id: '7', qrCode: 'WIQ-0789', address: 'Poonam Sagar Complex', distance: '1.1km', distanceM: 1100, fillLevel: 75, type: 'MIXED', sensorOnline: true, lat: 19.286, lng: 72.865 },
  { id: '8', qrCode: 'WIQ-0245', address: 'Indraprastha Shopping', distance: '1.3km', distanceM: 1300, fillLevel: 12, type: 'DRY', sensorOnline: true, lat: 19.291, lng: 72.845 },
  { id: '9', qrCode: 'WIQ-0556', address: 'Beverly Park Road', distance: '1.5km', distanceM: 1500, fillLevel: 82, type: 'RECYCLABLE', sensorOnline: true, lat: 19.275, lng: 72.858 },
  { id: '10', qrCode: 'WIQ-0881', address: 'Sector 5, Shanti Nagar', distance: '1.7km', distanceM: 1700, fillLevel: 55, type: 'WET', sensorOnline: true, lat: 19.283, lng: 72.861 },
  { id: '11', qrCode: 'WIQ-1021', address: 'Maxus Mall Road', distance: '1.9km', distanceM: 1900, fillLevel: 98, type: 'DRY', sensorOnline: true, lat: 19.289, lng: 72.849 },
  { id: '12', qrCode: 'WIQ-0667', address: 'Jesal Park Chowpatty', distance: '2.1km', distanceM: 2100, fillLevel: 25, type: 'MIXED', sensorOnline: true, lat: 19.280, lng: 72.853 },
  { id: '13', qrCode: 'WIQ-0442', address: 'Hatkesh Udyog Nagar', distance: '2.3km', distanceM: 2300, fillLevel: 40, type: 'RECYCLABLE', sensorOnline: true, lat: 19.293, lng: 72.857 },
  { id: '14', qrCode: 'WIQ-0990', address: 'Deepak Hospital Lane', distance: '2.5km', distanceM: 2500, fillLevel: 60, type: 'WET', sensorOnline: true, lat: 19.277, lng: 72.847 },
  { id: '15', qrCode: 'WIQ-0312', address: 'Pleasant Park Road', distance: '2.7km', distanceM: 2700, fillLevel: 18, type: 'DRY', sensorOnline: true, lat: 19.285, lng: 72.863 },
  { id: '16', qrCode: 'WIQ-1102', address: 'Cineprime Road', distance: '2.9km', distanceM: 2900, fillLevel: 33, type: 'WET', sensorOnline: true, lat: 19.292, lng: 72.850 },
  { id: '17', qrCode: 'WIQ-1245', address: 'Bhayandar Flyover', distance: '3.1km', distanceM: 3100, fillLevel: 77, type: 'MIXED', sensorOnline: true, lat: 19.287, lng: 72.842 },
  { id: '18', qrCode: 'WIQ-0992', address: 'GCC Club Road', distance: '3.3km', distanceM: 3300, fillLevel: 15, type: 'RECYCLABLE', sensorOnline: true, lat: 19.274, lng: 72.868 },
  { id: '19', qrCode: 'WIQ-0448', address: 'Hatkesh Plaza', distance: '3.5km', distanceM: 3500, fillLevel: 89, type: 'DRY', sensorOnline: true, lat: 19.282, lng: 72.870 },
  { id: '20', qrCode: 'WIQ-0811', address: 'New Golden Nest', distance: '3.7km', distanceM: 3700, fillLevel: 22, type: 'WET', sensorOnline: true, lat: 19.298, lng: 72.855 },
  { id: '21', qrCode: 'WIQ-0567', address: 'S.V. Road Junction', distance: '3.9km', distanceM: 3900, fillLevel: 61, type: 'MIXED', sensorOnline: true, lat: 19.270, lng: 72.850 },
  { id: '22', qrCode: 'WIQ-0223', address: 'Ramdev Park', distance: '4.1km', distanceM: 4100, fillLevel: 44, type: 'RECYCLABLE', sensorOnline: true, lat: 19.285, lng: 72.840 },
  { id: '23', qrCode: 'WIQ-0678', address: 'Poonam Garden', distance: '4.3km', distanceM: 4300, fillLevel: 91, type: 'DRY', sensorOnline: true, lat: 19.290, lng: 72.865 },
  { id: '24', qrCode: 'WIQ-0119', address: 'Western Park', distance: '4.5km', distanceM: 4500, fillLevel: 5, type: 'WET', sensorOnline: true, lat: 19.276, lng: 72.845 },
  { id: '25', qrCode: 'WIQ-0885', address: 'Rashmi Pride', distance: '4.7km', distanceM: 4700, fillLevel: 68, type: 'MIXED', sensorOnline: true, lat: 19.283, lng: 72.852 },
  { id: '26', qrCode: 'WIQ-0342', address: 'Unique Gardens', distance: '4.9km', distanceM: 4900, fillLevel: 35, type: 'RECYCLABLE', sensorOnline: true, lat: 19.291, lng: 72.858 },
  { id: '27', qrCode: 'WIQ-0712', address: 'Evershine Enclave', distance: '5.1km', distanceM: 5100, fillLevel: 84, type: 'DRY', sensorOnline: true, lat: 19.279, lng: 72.864 },
  { id: '28', qrCode: 'WIQ-0445', address: 'Lodha Aqua', distance: '5.3km', distanceM: 5300, fillLevel: 20, type: 'WET', sensorOnline: true, lat: 19.288, lng: 72.847 },
  { id: '29', qrCode: 'WIQ-0912', address: 'Penkarpada Road', distance: '5.5km', distanceM: 5500, fillLevel: 71, type: 'MIXED', sensorOnline: true, lat: 19.294, lng: 72.852 },
  { id: '30', qrCode: 'WIQ-0229', address: 'Delta Garden', distance: '5.7km', distanceM: 5700, fillLevel: 50, type: 'RECYCLABLE', sensorOnline: true, lat: 19.282, lng: 72.860 },
  { id: '31', qrCode: 'WIQ-0661', address: 'Medetiya Nagar', distance: '5.9km', distanceM: 5900, fillLevel: 14, type: 'DRY', sensorOnline: true, lat: 19.286, lng: 72.854 },
  { id: '32', qrCode: 'WIQ-0812', address: 'Srishti Complex', distance: '6.1km', distanceM: 6100, fillLevel: 95, type: 'WET', sensorOnline: true, lat: 19.275, lng: 72.862 },
  { id: '33', qrCode: 'WIQ-0449', address: 'Mandpeshwar Road', distance: '6.3km', distanceM: 6300, fillLevel: 38, type: 'MIXED', sensorOnline: true, lat: 19.280, lng: 72.844 },
  { id: '34', qrCode: 'WIQ-1002', address: 'Dahisar Check Naka', distance: '6.5km', distanceM: 6500, fillLevel: 62, type: 'RECYCLABLE', sensorOnline: true, lat: 19.292, lng: 72.867 },
  { id: '35', qrCode: 'WIQ-0552', address: 'Anand Nagar', distance: '6.7km', distanceM: 6700, fillLevel: 9, type: 'DRY', sensorOnline: true, lat: 19.273, lng: 72.856 },
  { id: '36', qrCode: 'WIQ-0994', address: 'Rawal Nagar', distance: '6.9km', distanceM: 6900, fillLevel: 86, type: 'WET', sensorOnline: true, lat: 19.289, lng: 72.860 },
  { id: '37', qrCode: 'WIQ-0447', address: 'Navghar Road', distance: '7.1km', distanceM: 7100, fillLevel: 27, type: 'MIXED', sensorOnline: true, lat: 19.281, lng: 72.848 },
  { id: '38', qrCode: 'WIQ-0771', address: 'Bhayandar West Station', distance: '7.3km', distanceM: 7300, fillLevel: 79, type: 'RECYCLABLE', sensorOnline: true, lat: 19.296, lng: 72.846 },
  { id: '39', qrCode: 'WIQ-0225', address: 'Maxus Cinema Lane', distance: '7.5km', distanceM: 7500, fillLevel: 53, type: 'DRY', sensorOnline: true, lat: 19.277, lng: 72.871 },
  { id: '40', qrCode: 'WIQ-0883', address: 'Kanakia Road', distance: '7.7km', distanceM: 7700, fillLevel: 12, type: 'WET', sensorOnline: true, lat: 19.284, lng: 72.866 },
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
