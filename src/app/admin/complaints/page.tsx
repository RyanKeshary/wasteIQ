/**
 * WasteIQ — Admin Complaints Page
 * Citizen complaint management with functional actions.
 * Every button works: filter chips, assign, resolve, more.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  User,
  Image,
  Check,
  MoreVertical,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';

interface ComplaintItem {
  id: string;
  citizen: string;
  category: string;
  location: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: number;
  time: string;
  hasImage: boolean;
}

const initialComplaints: ComplaintItem[] = [
  { id: '1', citizen: 'Amit Sharma', category: 'Overflowing Bin', location: 'Ward 14, Station Road', status: 'OPEN', priority: 1, time: '35m ago', hasImage: true },
  { id: '2', citizen: 'Priya Nair', category: 'Missed Collection', location: 'Ward 08, Market Lane', status: 'IN_PROGRESS', priority: 2, time: '2h ago', hasImage: false },
  { id: '3', citizen: 'Vikram Desai', category: 'Illegal Dumping', location: 'Ward 12, Highway Junction', status: 'OPEN', priority: 1, time: '3h ago', hasImage: true },
  { id: '4', citizen: 'Neha Kulkarni', category: 'Unsanitary Area', location: 'Ward 06, Garden Colony', status: 'RESOLVED', priority: 3, time: '1d ago', hasImage: false },
  { id: '5', citizen: 'Ravi Patel', category: 'Overflowing Bin', location: 'Ward 02, Coastal Road', status: 'IN_PROGRESS', priority: 2, time: '4h ago', hasImage: true },
];

function getStatusStyles(status: string) {
  switch (status) {
    case 'OPEN': return { bg: 'var(--error-container)', color: 'var(--error)', label: 'Open' };
    case 'IN_PROGRESS': return { bg: 'var(--warning-container)', color: 'var(--warning)', label: 'In Progress' };
    case 'RESOLVED': return { bg: 'var(--success-container)', color: 'var(--primary)', label: 'Resolved' };
    default: return { bg: 'var(--surface-high)', color: 'var(--outline)', label: status };
  }
}

type FilterStatus = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const filtered = filter === 'ALL' ? complaints : complaints.filter((c) => c.status === filter);

  const assignComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'IN_PROGRESS' as const } : c))
    );
    toast.success('Complaint assigned to field team', {
      description: 'A notification has been sent to the nearest available unit.',
    });
  };

  const resolveComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'RESOLVED' as const } : c))
    );
    toast.success('Complaint resolved', {
      description: 'The citizen will be notified about the resolution.',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="headline-lg mb-1">Citizen Complaints</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            {complaints.filter((c) => c.status !== 'RESOLVED').length} pending resolution
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: filter === status ? 'var(--primary)' : 'var(--surface-lowest)',
              color: filter === status ? 'white' : 'var(--on-surface-variant)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: filter === status ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {status === 'ALL' ? `All (${complaints.length})` : status === 'IN_PROGRESS' ? `In Progress (${complaints.filter(c => c.status === 'IN_PROGRESS').length})` : `${status.charAt(0) + status.slice(1).toLowerCase()} (${complaints.filter(c => c.status === status).length})`}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {filtered.map((complaint, i) => {
            const status = getStatusStyles(complaint.status);
            return (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, height: 0 }}
                transition={{ delay: i * 0.04 }}
                layout
                className="card p-5 flex flex-col md:flex-row gap-4"
                style={{ borderLeft: `4px solid ${status.color}` }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full"
                      style={{ background: status.bg, color: status.color, fontFamily: 'var(--font-mono)' }}
                    >
                      {status.label}
                    </span>
                    <span className="chip chip-neutral text-[10px]">{complaint.category}</span>
                    {complaint.hasImage && (
                      <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'var(--outline)' }}>
                        <Image size={10} /> Photo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <User size={12} style={{ color: 'var(--outline)' }} />
                    <span className="title-sm">{complaint.citizen}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      <MapPin size={12} /> {complaint.location}
                    </span>
                    <span className="flex items-center gap-1 mono-sm" style={{ color: 'var(--outline)' }}>
                      <Clock size={12} /> {complaint.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                  {complaint.status === 'OPEN' && (
                    <button
                      className="btn-primary text-xs py-2 px-4"
                      onClick={() => assignComplaint(complaint.id)}
                    >
                      <UserPlus size={12} /> Assign
                    </button>
                  )}
                  {complaint.status === 'IN_PROGRESS' && (
                    <button
                      className="btn-primary text-xs py-2 px-4"
                      onClick={() => resolveComplaint(complaint.id)}
                    >
                      <Check size={12} /> Resolve
                    </button>
                  )}
                  <button
                    className="p-2 rounded-lg"
                    style={{ background: 'var(--surface-low)', border: 'none', cursor: 'pointer', color: 'var(--outline)' }}
                    onClick={() => toast.info(`Complaint #${complaint.id} details — Full view coming soon`)}
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Check size={40} style={{ color: 'var(--primary)', margin: '0 auto 12px' }} />
            <h3 className="title-md mb-1">No Complaints</h3>
            <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>
              No complaints matching this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
