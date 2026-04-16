/**
 * WasteIQ — Admin Heatmap Page
 * Zone activity heatmap visualization.
 */
'use client';

import { Activity, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/admin/LiveMap'), {
  ssr: false,
});

const zones = [
  { name: 'Mira Road (E)', activity: 92, bins: 245 },
  { name: 'Bhayandar Market', activity: 87, bins: 189 },
  { name: 'Kashimira', activity: 78, bins: 156 },
  { name: 'Coastal Strip', activity: 65, bins: 134 },
  { name: 'Shanti Nagar', activity: 71, bins: 112 },
  { name: 'Kamothe Naka', activity: 84, bins: 98 },
  { name: 'Bhayandar (W)', activity: 89, bins: 178 },
  { name: 'Navghar', activity: 56, bins: 67 },
  { name: 'Uttan Road', activity: 43, bins: 45 },
];

function getHeatColor(activity: number) {
  if (activity >= 80) return { bg: 'rgba(186, 26, 26, 0.12)', border: 'var(--error)', text: 'var(--error)' };
  if (activity >= 60) return { bg: 'rgba(255, 136, 66, 0.12)', border: 'var(--warning)', text: 'var(--warning)' };
  return { bg: 'rgba(0, 193, 106, 0.08)', border: 'var(--primary)', text: 'var(--primary)' };
}

export default function AdminHeatmapPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="headline-lg mb-1">Zone Activity Heatmap</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          Real-time waste activity density across operational zones
        </p>
      </div>

      {/* Map Content */}
      <div
        className="card p-0 overflow-hidden mb-6 relative z-0"
        style={{ height: '350px' }}
      >
        <LiveMap />
      </div>

      {/* Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const heat = getHeatColor(zone.activity);
          return (
            <div
              key={zone.name}
              className="card p-5"
              style={{ borderLeft: `4px solid ${heat.border}` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="title-md">{zone.name}</h3>
                  <p className="flex items-center gap-1 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                    <MapPin size={12} /> {zone.bins} bins
                  </p>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: heat.text }}
                >
                  {zone.activity}%
                </div>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-high)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${zone.activity}%`, background: heat.border }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
