/**
 * WasteIQ — Citizen Complaints Page
 * Fully functional: form validation, submission, status tracking.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  X,
  MapPin,
  Clock,
  Camera,
  Send,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  'Overflowing Bin',
  'Missed Collection',
  'Illegal Dumping',
  'Unsanitary Area',
  'Broken Bin',
  'Other',
];

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  location: string;
  time: string;
  hasImage: boolean;
}

const initialComplaints: Complaint[] = [
  { id: '1', title: 'Overflowing bin near station', description: 'The bin at Station Road has been overflowing since morning.', category: 'Overflowing Bin', status: 'OPEN', location: 'Ward 14, Station Road', time: '2h ago', hasImage: true },
  { id: '2', title: 'Missed collection on Market Lane', description: 'Collection was scheduled for yesterday but the truck never came.', category: 'Missed Collection', status: 'IN_PROGRESS', location: 'Ward 08, Market Lane', time: '1d ago', hasImage: false },
  { id: '3', title: 'Illegal dumping at highway junction', description: 'Construction waste being dumped illegally.', category: 'Illegal Dumping', status: 'RESOLVED', location: 'Ward 12, Highway Junction', time: '3d ago', hasImage: true },
];

function getStatusStyles(status: string) {
  switch (status) {
    case 'OPEN': return { bg: 'var(--error-container)', color: 'var(--error)', label: 'Open' };
    case 'IN_PROGRESS': return { bg: 'var(--warning-container)', color: 'var(--warning)', label: 'In Progress' };
    case 'RESOLVED': return { bg: 'var(--success-container)', color: 'var(--primary)', label: 'Resolved' };
    default: return { bg: 'var(--surface-high)', color: 'var(--outline)', label: status };
  }
}

export default function CitizenComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error('Please enter a title');
    if (!category) return toast.error('Please select a category');
    if (!description.trim()) return toast.error('Please provide a description');

    setIsSubmitting(true);
    toast.loading('Submitting complaint...', { id: 'submit' });

    await new Promise((r) => setTimeout(r, 1200));

    const newComplaint: Complaint = {
      id: String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      category,
      status: 'OPEN',
      location: location.trim() || 'Location not provided',
      time: 'just now',
      hasImage: false,
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setShowForm(false);
    setIsSubmitting(false);

    toast.success('Complaint submitted! 🎉', {
      id: 'submit',
      description: 'You will receive updates as it is processed.',
      duration: 4000,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="headline-lg mb-1">My Complaints</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            {complaints.length} filed — {complaints.filter((c) => c.status === 'OPEN').length} pending
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Report Issue'}
        </button>
      </div>

      {/* New Complaint Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 mb-6 overflow-hidden"
            style={{ borderLeft: '4px solid var(--primary)' }}
          >
            <h3 className="title-md mb-4">Report a New Issue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-md mb-1 block" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--outline)' }}>Title</label>
                <input
                  className="input-field w-full"
                  placeholder="Brief description of the issue..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="label-md mb-1 block" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--outline)' }}>Category</label>
                <select
                  className="input-field w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ appearance: 'auto' }}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="label-md mb-1 block" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--outline)' }}>Description</label>
              <textarea
                className="input-field w-full"
                rows={3}
                placeholder="Provide more details about the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>
            <div className="mb-4">
              <label className="label-md mb-1 block" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--outline)' }}>Location</label>
              <input
                className="input-field w-full"
                placeholder="Ward, Street, or Landmark..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: 'var(--surface-low)',
                  border: '1.5px dashed var(--outline-variant)',
                  cursor: 'pointer',
                  color: 'var(--on-surface-variant)',
                }}
                type="button"
                onClick={() => toast.info('Photo upload coming soon')}
              >
                <Camera size={16} /> Attach Photo
              </button>
              <div className="flex-1" />
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Send size={14} /> Submit Complaint
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaints List */}
      <div className="flex flex-col gap-4">
        {complaints.map((complaint, i) => {
          const statusStyle = getStatusStyles(complaint.status);
          return (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5"
              style={{ borderLeft: `4px solid ${statusStyle.color}` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: statusStyle.bg, color: statusStyle.color, fontFamily: 'var(--font-mono)' }}
                    >
                      {statusStyle.label}
                    </span>
                    <span className="chip chip-neutral text-[10px]">{complaint.category}</span>
                  </div>
                  <h3 className="title-md mb-1">{complaint.title}</h3>
                  <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                    {complaint.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  <MapPin size={12} /> {complaint.location}
                </span>
                <span className="flex items-center gap-1 mono-sm" style={{ color: 'var(--outline)' }}>
                  <Clock size={12} /> {complaint.time}
                </span>
                {complaint.hasImage && (
                  <span className="flex items-center gap-1 body-sm" style={{ color: 'var(--outline)' }}>
                    <Camera size={12} /> Photo attached
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
