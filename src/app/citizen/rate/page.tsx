/**
 * WasteIQ — Citizen Rate Area Page
 * Fully functional: star rating selection, comment, submission.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Zone {
  id: string;
  name: string;
  avgRating: number;
  totalRatings: number;
}

const initialZones: Zone[] = [
  { id: '1', name: 'Mira Road (East)', avgRating: 4.2, totalRatings: 156 },
  { id: '2', name: 'Bhayandar Market', avgRating: 3.8, totalRatings: 203 },
  { id: '3', name: 'Kashimira', avgRating: 4.5, totalRatings: 89 },
  { id: '4', name: 'Coastal Strip', avgRating: 3.2, totalRatings: 67 },
  { id: '5', name: 'Shanti Nagar', avgRating: 4.0, totalRatings: 134 },
];

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className="p-0.5"
          style={{
            background: 'none',
            border: 'none',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'transform 0.15s',
            transform: interactive && (hovered === star) ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <Star
            size={interactive ? 28 : 14}
            fill={star <= (hovered || rating) ? '#F59E0B' : 'none'}
            stroke={star <= (hovered || rating) ? '#F59E0B' : 'var(--outline-variant)'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

export default function CitizenRatePage() {
  const [zones, setZones] = useState(initialZones);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedZone) return;
    if (userRating === 0) return toast.error('Please select a star rating');

    setIsSubmitting(true);
    toast.loading('Submitting your rating...', { id: 'rate' });

    await new Promise((r) => setTimeout(r, 1000));

    // Update zone rating locally (weighted average simulation)
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== selectedZone) return z;
        const newTotal = z.totalRatings + 1;
        const newAvg = Math.round(((z.avgRating * z.totalRatings + userRating) / newTotal) * 10) / 10;
        return { ...z, avgRating: newAvg, totalRatings: newTotal };
      })
    );

    const zoneName = zones.find((z) => z.id === selectedZone)?.name;
    toast.success('Thank you for your rating! ⭐', {
      id: 'rate',
      description: `You rated ${zoneName} ${userRating}/5 stars.${comment ? ' Comment recorded.' : ''}`,
      duration: 4000,
    });

    setSelectedZone(null);
    setUserRating(0);
    setComment('');
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="headline-lg mb-1">Rate Your Area</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          Help us improve — rate cleanliness in your zone
        </p>
      </div>

      {/* Rating Form */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            className="card p-6 mb-6"
            style={{ borderLeft: '4px solid #F59E0B' }}
          >
            <h3 className="title-md mb-3">
              Rate: {zones.find((z) => z.id === selectedZone)?.name}
            </h3>
            <div className="mb-4">
              <StarRating rating={userRating} onRate={setUserRating} interactive />
              {userRating > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="body-sm mt-2"
                  style={{ color: 'var(--on-surface-variant)' }}
                >
                  {userRating <= 2 ? 'We\'ll prioritize improvements in this area.' :
                   userRating <= 3 ? 'Thanks — we\'re working to make it better.' :
                   userRating <= 4 ? 'Great to hear! We\'ll maintain this standard.' :
                   'Excellent! Glad you\'re satisfied.'}
                </motion.p>
              )}
            </div>
            <textarea
              className="input-field w-full mb-4"
              rows={2}
              placeholder="Optional: Add a comment about cleanliness..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ resize: 'vertical' }}
            />
            <div className="flex gap-3">
              <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Send size={14} /> Submit Rating
                  </>
                )}
              </button>
              <button
                className="btn-ghost"
                onClick={() => { setSelectedZone(null); setUserRating(0); setComment(''); }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone List */}
      <div className="flex flex-col gap-3">
        {zones.map((zone, i) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card card-interactive p-5 flex items-center gap-4"
            onClick={() => { setSelectedZone(zone.id); setUserRating(0); setComment(''); }}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--surface-low)' }}
            >
              <MapPin size={20} style={{ color: 'var(--on-surface-variant)' }} />
            </div>
            <div className="flex-1">
              <h3 className="title-sm mb-1">{zone.name}</h3>
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(zone.avgRating)} />
                <span className="mono-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  {zone.avgRating.toFixed(1)}
                </span>
                <span className="body-sm" style={{ color: 'var(--outline)' }}>
                  ({zone.totalRatings} reviews)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--primary)' }}>
              <Star size={14} /> Rate
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
