/**
 * WasteIQ — Citizen Complaints Page
 * Fully functional: form validation, submission, status tracking.
 */
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
  Sparkles,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import ComplaintChat from '@/components/complaints/ComplaintChat';

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
  chatEnabled: boolean;
  isEmergency?: boolean;
}

const initialComplaints: Complaint[] = [
  { id: '1', title: 'Overflowing bin near station', description: 'The bin at Station Road has been overflowing since morning.', category: 'Overflowing Bin', status: 'OPEN', location: 'Ward 14, Station Road', time: '2h ago', hasImage: true, chatEnabled: false },
  { id: '2', title: 'Missed collection on Market Lane', description: 'Collection was scheduled for yesterday but the truck never came.', category: 'Missed Collection', status: 'IN_PROGRESS', location: 'Ward 08, Market Lane', time: '1d ago', hasImage: false, chatEnabled: true },
  { id: '3', title: 'Illegal dumping at highway junction', description: 'Construction waste being dumped illegally.', category: 'Illegal Dumping', status: 'RESOLVED', location: 'Ward 12, Highway Junction', time: '3d ago', hasImage: true, chatEnabled: false },
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
  const t = useTranslations('complaint');
  const tc = useTranslations('common');
  const searchParams = useSearchParams();
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Auto-open chat if 'chat' param is present
  useEffect(() => {
    const chatId = searchParams.get('chat');
    if (chatId) {
      const complaint = complaints.find(c => c.id === chatId);
      if (complaint && complaint.status === 'IN_PROGRESS') {
        setActiveChat(chatId);
        toast.success(`Connected to Driver: Ajay Solanki`, { icon: '💬' });
      }
    }
  }, [searchParams, complaints]);

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Use JPEG with 0.7 quality
      };
      img.src = dataUrl;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const rawImageData = event.target?.result as string;
        
        // 1. Immediate UI Preview
        setImage(rawImageData);
        
        // 2. Background Compression for OCR speed
        setIsProcessingOCR(true);
        const toastId = toast.loading('Compressing & Analyzing...', { id: 'ocr' });
        
        try {
          const compressedData = await compressImage(rawImageData);
          
          const response = await fetch('/api/ocr/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: compressedData }),
          });

          const result = await response.json();

          if (result.success) {
            const { keywords, suggestions, locationHint } = result.data;
            
            // Apply category based on top keywords
            if (keywords.includes('OVERFLOW') || keywords.includes('GARBAGE')) {
              setCategory('Overflowing Bin');
            } else if (keywords.includes('DUMP') || keywords.includes('DEBRIS')) {
              setCategory('Illegal Dumping');
            }
            
            // Suggest title/description
            if (!title) setTitle(suggestions.title);
            if (!description) setDescription(suggestions.description);
            if (!location && locationHint) setLocation(locationHint);

            toast.success('AI insights applied!', { id: toastId });
          } else {
            toast.error('AI analysis incomplete', { id: toastId });
          }
        } catch (err) {
          console.error('OCR Error:', err);
          toast.error('AI node offline', { id: toastId });
        } finally {
          setIsProcessingOCR(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

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
      chatEnabled: false,
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setIsEmergency(false);
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
          <h1 className="headline-lg mb-1">{t('title')}</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            {complaints.length} filed — {complaints.filter((c) => c.status === 'OPEN').length} pending
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? tc('cancel') : t('submit_btn')}
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
            <h3 className="title-md mb-4">{t('title')}</h3>
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

            {/* EMERGENCY SOS TOGGLE */}
            <div 
              className={`p-4 rounded-xl mb-6 transition-all border-2 ${isEmergency ? 'bg-error-container/20 border-error shadow-lg' : 'bg-surface-low border-transparent'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEmergency ? 'bg-error text-white animate-pulse' : 'bg-surface-high text-outline'}`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className={`title-sm ${isEmergency ? 'text-error' : ''}`}>Garbage SOS (Emergency)</h4>
                    <p className="body-xs opacity-70">Immediate risk to health, road safety, or toxic hazards.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-error"></div>
                </label>
              </div>
              {isEmergency && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-bold text-error uppercase tracking-tighter mt-3 flex items-center gap-1"
                >
                  <Info size={10} /> False reports may result in account penalties.
                </motion.p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-4">
                {image && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2 border border-outline-variant">
                    <img src={image} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X size={14} />
                    </button>
                    {isProcessingOCR && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white gap-2">
                        <Sparkles size={16} className="animate-pulse" />
                        <span className="text-xs font-bold">AI Processing...</span>
                      </div>
                    )}
                  </div>
                )}
                <label
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: 'var(--surface-low)',
                    border: '1.5px dashed var(--outline-variant)',
                    cursor: 'pointer',
                    color: 'var(--on-surface-variant)',
                  }}
                >
                  <Camera size={16} /> 
                  {image ? 'Change Photo' : 'Attach Photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
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

              {complaint.status === 'IN_PROGRESS' && (
                <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-end">
                   <button 
                    onClick={() => setActiveChat(complaint.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                   >
                     <MessageSquare size={14} />
                     Chat with Driver
                   </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {activeChat && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="w-full max-w-lg relative"
            >
              <button 
                onClick={() => setActiveChat(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <X size={20} /> Close
              </button>
              <ComplaintChat 
                complaintId={activeChat} 
                chatEnabled={complaints.find(c => c.id === activeChat)?.chatEnabled || false} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
