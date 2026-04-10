/**
 * WasteIQ — Admin Bins List Page
 * Reference UI: wasteiq_admin_bins_management
 * 
 * Shows: Search + filters, sortable table with fill bars, zone/status chips, actions.
 */
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Eye,
  Plus,
  MoreVertical,
  Download,
  Trash2,
} from 'lucide-react';
import CountUp from '@/components/effects/CountUp';

// ── Mock Bin Data ───────────────────────────────────────────

interface MockBin {
  id: string;
  serialNumber: string;
  zone: string;
  ward: string;
  fillLevel: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  sensorOnline: boolean;
  batteryLevel: number;
  lastPing: string;
  lat: number;
  lng: number;
}

const mockBins: MockBin[] = [
  { id: '1', serialNumber: 'WIQ-0482', zone: 'Kashimira', ward: 'W-14', fillLevel: 92, status: 'ACTIVE', sensorOnline: true, batteryLevel: 78, lastPing: '14s ago', lat: 19.2805, lng: 72.8542 },
  { id: '2', serialNumber: 'WIQ-1247', zone: 'Bhayandar Market', ward: 'W-08', fillLevel: 85, status: 'ACTIVE', sensorOnline: true, batteryLevel: 45, lastPing: '22s ago', lat: 19.2903, lng: 72.8510 },
  { id: '3', serialNumber: 'WIQ-0891', zone: 'Shanti Nagar', ward: 'W-12', fillLevel: 71, status: 'MAINTENANCE', sensorOnline: false, batteryLevel: 12, lastPing: '4h ago', lat: 19.2756, lng: 72.8601 },
  { id: '4', serialNumber: 'WIQ-0334', zone: 'Mira Road (E)', ward: 'W-06', fillLevel: 58, status: 'ACTIVE', sensorOnline: true, batteryLevel: 91, lastPing: '8s ago', lat: 19.2812, lng: 72.8588 },
  { id: '5', serialNumber: 'WIQ-0176', zone: 'Coastal Strip', ward: 'W-02', fillLevel: 44, status: 'ACTIVE', sensorOnline: true, batteryLevel: 62, lastPing: '18s ago', lat: 19.2945, lng: 72.8475 },
  { id: '6', serialNumber: 'WIQ-0923', zone: 'Kamothe Naka', ward: 'W-16', fillLevel: 33, status: 'ACTIVE', sensorOnline: true, batteryLevel: 88, lastPing: '5s ago', lat: 19.2698, lng: 72.8534 },
  { id: '7', serialNumber: 'WIQ-0655', zone: 'Bhayandar (W)', ward: 'W-04', fillLevel: 98, status: 'ACTIVE', sensorOnline: true, batteryLevel: 55, lastPing: '3s ago', lat: 19.2887, lng: 72.8390 },
  { id: '8', serialNumber: 'WIQ-1102', zone: 'Navghar', ward: 'W-10', fillLevel: 15, status: 'OFFLINE', sensorOnline: false, batteryLevel: 0, lastPing: '12h ago', lat: 19.2621, lng: 72.8467 },
];

function getFillColor(level: number) {
  if (level >= 80) return 'var(--error)';
  if (level >= 60) return 'var(--warning)';
  return 'var(--primary)';
}

function getStatusChip(status: string) {
  switch (status) {
    case 'ACTIVE':
      return { bg: 'var(--success-container)', color: 'var(--primary)', label: 'Active' };
    case 'MAINTENANCE':
      return { bg: 'var(--warning-container)', color: 'var(--warning)', label: 'Maint.' };
    case 'OFFLINE':
      return { bg: 'var(--error-container)', color: 'var(--error)', label: 'Offline' };
    default:
      return { bg: 'var(--surface-high)', color: 'var(--outline)', label: status };
  }
}

type FilterStatus = 'ALL' | 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
type SortKey = 'serialNumber' | 'fillLevel' | 'zone' | 'batteryLevel';

export default function AdminBinsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('fillLevel');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    let data = [...mockBins];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (b) =>
          b.serialNumber.toLowerCase().includes(q) ||
          b.zone.toLowerCase().includes(q) ||
          b.ward.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') {
      data = data.filter((b) => b.status === statusFilter);
    }
    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDesc ? vb - va : va - vb;
      }
      return sortDesc
        ? String(vb).localeCompare(String(va))
        : String(va).localeCompare(String(vb));
    });
    return data;
  }, [search, statusFilter, sortKey, sortDesc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="headline-lg mb-1">Bin Management</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            {mockBins.length} registered bins across {new Set(mockBins.map((b) => b.zone)).size} zones
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Register Bin
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 text-center">
          <div
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--on-surface)' }}
          >
            <CountUp end={mockBins.length} />
          </div>
          <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Total</span>
        </div>
        <div className="card p-4 text-center">
          <div
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}
          >
            <CountUp end={mockBins.filter((b) => b.status === 'ACTIVE').length} />
          </div>
          <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Active</span>
        </div>
        <div className="card p-4 text-center">
          <div
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--error)' }}
          >
            <CountUp end={mockBins.filter((b) => b.fillLevel >= 80).length} />
          </div>
          <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Critical</span>
        </div>
        <div className="card p-4 text-center">
          <div
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--warning)' }}
          >
            <CountUp end={mockBins.filter((b) => !b.sensorOnline).length} />
          </div>
          <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>Offline</span>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--outline)' }}
          />
          <input
            type="text"
            className="input-field pl-10 w-full"
            placeholder="Search bins by serial, zone, or ward..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: '40px' }}
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex gap-2 flex-wrap">
          {(['ALL', 'ACTIVE', 'MAINTENANCE', 'OFFLINE'] as FilterStatus[]).map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: isActive ? 'var(--primary)' : 'var(--surface-low)',
                  color: isActive ? 'white' : 'var(--on-surface-variant)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        {/* Export */}
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
          style={{
            background: 'var(--surface-low)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--on-surface-variant)',
          }}
        >
          <Download size={14} /> Export
        </button>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--surface-low)',
                  borderBottom: '1px solid var(--outline-variant)',
                }}
              >
                {[
                  { key: 'serialNumber' as SortKey, label: 'Serial' },
                  { key: 'zone' as SortKey, label: 'Zone' },
                  { key: 'fillLevel' as SortKey, label: 'Fill Level' },
                  { key: 'batteryLevel' as SortKey, label: 'Battery' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="text-left px-4 py-3 cursor-pointer select-none"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: sortKey === col.key ? 'var(--primary)' : 'var(--outline)',
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown size={12} />
                    </span>
                  </th>
                ))}
                <th
                  className="px-4 py-3 text-left"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--outline)',
                  }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-3 text-left"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--outline)',
                  }}
                >
                  Last Ping
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((bin, i) => {
                const statusChip = getStatusChip(bin.status);
                return (
                  <motion.tr
                    key={bin.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid var(--outline-variant)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface-low)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Serial */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Trash2 size={14} style={{ color: 'var(--outline)' }} />
                        <span
                          className="font-semibold"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            color: 'var(--on-surface)',
                          }}
                        >
                          {bin.serialNumber}
                        </span>
                      </div>
                    </td>

                    {/* Zone */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} style={{ color: 'var(--outline)' }} />
                        <span className="body-sm">{bin.zone}</span>
                        <span className="chip chip-neutral text-[10px]">{bin.ward}</span>
                      </div>
                    </td>

                    {/* Fill Level */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3" style={{ minWidth: '140px' }}>
                        <div
                          className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ background: 'var(--surface-high)', maxWidth: '100px' }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${bin.fillLevel}%`,
                              background: getFillColor(bin.fillLevel),
                              boxShadow: bin.fillLevel >= 80
                                ? '0 0 8px rgba(186,26,26,0.3)'
                                : 'none',
                            }}
                          />
                        </div>
                        <span
                          className="mono-sm font-bold"
                          style={{ color: getFillColor(bin.fillLevel), minWidth: '32px' }}
                        >
                          {bin.fillLevel}%
                        </span>
                      </div>
                    </td>

                    {/* Battery */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {bin.batteryLevel <= 20 ? (
                          <BatteryLow size={14} style={{ color: 'var(--error)' }} />
                        ) : (
                          <Battery size={14} style={{ color: 'var(--outline)' }} />
                        )}
                        <span
                          className="mono-sm"
                          style={{
                            color:
                              bin.batteryLevel <= 20
                                ? 'var(--error)'
                                : 'var(--on-surface-variant)',
                          }}
                        >
                          {bin.batteryLevel}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          background: statusChip.bg,
                          color: statusChip.color,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {bin.sensorOnline ? (
                          <Wifi size={10} />
                        ) : (
                          <WifiOff size={10} />
                        )}
                        {statusChip.label}
                      </span>
                    </td>

                    {/* Last Ping */}
                    <td className="px-4 py-3">
                      <span
                        className="mono-sm"
                        style={{ color: 'var(--outline)' }}
                      >
                        {bin.lastPing}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded-lg"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--outline)',
                          }}
                          aria-label="View bin details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--outline)',
                          }}
                          aria-label="More actions"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: 'var(--surface-low)',
            borderTop: '1px solid var(--outline-variant)',
          }}
        >
          <span className="body-sm" style={{ color: 'var(--outline)' }}>
            Showing {filtered.length} of {mockBins.length} bins
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: 'var(--surface-lowest)',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--on-surface-variant)',
              }}
            >
              Previous
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: 'var(--primary)',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              1
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: 'var(--surface-lowest)',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--on-surface-variant)',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
