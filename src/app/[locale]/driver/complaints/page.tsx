/**
 * WasteIQ — Driver Complaints Management
 * View assigned citizen requests and engage in real-time chat.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle,
  X,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';
import ComplaintChat from '@/components/complaints/ComplaintChat';

interface Complaint {
  id: string;
  title: string;
  location: string;
  time: string;
  status: 'IN_PROGRESS' | 'RESOLVED';
  citizenName: string;
}

const mockAssigned: Complaint[] = [
  { id: '2', title: 'Missed collection on Market Lane', location: 'Ward 08, Market Lane', time: '2h ago', status: 'IN_PROGRESS', citizenName: 'Priya Nair' },
  { id: '5', title: 'Overflowing Bin near Coastal Road', location: 'Ward 02, Coastal Road', time: '4h ago', status: 'IN_PROGRESS', citizenName: 'Ravi Patel' },
];

export default function DriverComplaintsPage() {
  const [complaints, setComplaints] = useState(mockAssigned);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const resolveComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'RESOLVED' as const } : c));
    toast.success('Complaint marked as resolved');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="headline-lg">Assigned Requests</h1>
        <p className="body-md opacity-70">Direct requests from citizens in your active zone.</p>
      </div>

      <div className="flex flex-col gap-4">
        {complaints.map((complaint) => (
          <motion.div
            key={complaint.id}
            layout
            className="card p-5 border-l-4 border-primary bg-surface-lowest"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                     {complaint.status}
                   </span>
                   <span className="text-[10px] font-bold text-outline uppercase">{complaint.time}</span>
                </div>
                <h3 className="title-md mb-1">{complaint.title}</h3>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                     <MapPin size={12} /> {complaint.location}
                   </div>
                   <div className="flex items-center gap-1 text-xs text-outline">
                     <span className="font-bold text-primary">{complaint.citizenName}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveChat(complaint.id)}
                  className="btn-primary px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Chat
                </button>
                <button 
                  onClick={() => resolveComplaint(complaint.id)}
                  className="p-3 rounded-xl bg-success-container/20 text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
                >
                  <CheckCircle size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {complaints.length === 0 && (
          <div className="card p-12 text-center opacity-50">
             <CheckCircle size={48} className="mx-auto mb-4 text-primary" />
             <p className="title-md">All requests resolved!</p>
          </div>
        )}
      </div>

      {/* Driver Chat Modal */}
      <AnimatePresence>
        {activeChat && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg relative"
            >
              <button 
                onClick={() => setActiveChat(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <X size={20} /> Minimize
              </button>
              <div className="bg-surface-lowest rounded-3xl overflow-hidden shadow-2xl border border-primary/30">
                 <div className="p-4 bg-primary text-white flex justify-between items-center">
                    <h4 className="title-sm flex items-center gap-2">
                      <Navigation size={16} />
                      Communicating with Citizen
                    </h4>
                    <span className="text-[10px] font-bold uppercase opacity-80">Live</span>
                 </div>
                 <ComplaintChat 
                    complaintId={activeChat} 
                    chatEnabled={complaints.find(c => c.id === activeChat)?.status === 'IN_PROGRESS'} 
                    minimal={true}
                 />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
