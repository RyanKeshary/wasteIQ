/**
 * WasteIQ — Driver Field Messaging
 * Dedicated hub for driver-citizen coordination.
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  ChevronRight, 
  Clock, 
  User, 
  ShieldAlert,
  ChevronLeft,
  Navigation,
  AlertTriangle,
  Plus,
  Zap,
  MapPin
} from 'lucide-react';
import ComplaintChat from '@/components/complaints/ComplaintChat';
import { useTranslations } from 'next-intl';

export default function DriverMessagingPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('task-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<any[]>([
    {
      id: 'task-1',
      title: 'Missed Collection - Market Lane',
      lastMessage: 'I am waiting near the red gate.',
      time: '2m ago',
      unread: true,
      citizen: 'Rajesh Sharma',
      status: 'IN_PROGRESS',
      category: 'Missed Collection',
      escalationLevel: 'NONE'
    },
    {
      id: 'task-2',
      title: 'Hazardous Waste - Ward 14',
      lastMessage: 'Team is approaching the site.',
      time: '15m ago',
      unread: false,
      citizen: 'Priya Patel',
      status: 'OPEN',
      category: 'Hazardous Waste',
      escalationLevel: 'CALL'
    },
    {
      id: 'task-3',
      title: 'SOS: Medical Waste Spill',
      lastMessage: 'GOVERNMENT INSPECTOR ASSIGNED',
      time: 'Just now',
      unread: true,
      citizen: 'Dr. Amit Shah',
      status: 'CRITICAL',
      category: 'Emergency SOS',
      escalationLevel: 'GOVERNMENT'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.citizen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6 p-4 md:p-0 overflow-hidden">
      {/* Task List / Sidebar */}
      <div className={`w-full md:w-[400px] flex flex-col gap-6 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight m-0">Citizen Support</h1>
            <p className="text-outline text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">Field Dispatch Operations</p>
          </div>
          <div className="w-12 h-12 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary relative">
            <MessageSquare size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-error rounded-full border-2 border-surface animate-pulse" />
          </div>
        </div>

        {/* Search */}
        <div className="relative group mx-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search active reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-low border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all placeholder:text-outline-variant/50"
          />
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar px-2">
          {filteredChats.map((chat) => (
            <motion.button
              key={chat.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full p-5 rounded-[32px] flex items-center gap-4 transition-all relative overflow-hidden group ${
                activeChatId === chat.id 
                  ? 'bg-white dark:bg-surface-high/20 shadow-xl shadow-black/[0.03] ring-1 ring-outline-variant/30' 
                  : 'bg-transparent hover:bg-surface-high/30'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative ${
                chat.status === 'CRITICAL' ? 'bg-error/10 text-error' : 'bg-surface-high/50 text-outline'
              }`}>
                {chat.status === 'CRITICAL' ? <ShieldAlert size={24} /> : <User size={24} />}
                {chat.unread && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-surface" />
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-black tracking-tight truncate ${activeChatId === chat.id ? 'text-primary' : 'text-on-surface'}`}>
                    {chat.citizen}
                  </h3>
                  <span className="text-[9px] font-bold text-outline-variant">{chat.time}</span>
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest truncate ${chat.unread ? 'text-primary' : 'text-outline-variant'}`}>
                  {chat.category}
                </p>
                <p className="text-xs truncate text-outline-variant mt-1 font-medium italic">
                  "{chat.lastMessage}"
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col h-full bg-white dark:bg-black/20 rounded-[48px] border border-outline-variant/30 overflow-hidden relative shadow-inner ${!activeChatId ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {activeChatId ? (
          <div className="h-full w-full flex flex-col overflow-hidden">
            {/* Context Header */}
            <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between bg-white/80 backdrop-blur-xl z-20">
               <div className="flex items-center gap-4">
                  <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 hover:bg-surface-high rounded-full">
                     <ChevronLeft size={24} />
                  </button>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">{activeChat?.citizen}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{activeChat?.status}</span>
                       <span className="w-1 h-1 rounded-full bg-outline-variant" />
                       <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{activeChat?.category}</span>
                    </div>
                  </div>
               </div>
               <button className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                  <Navigation size={20} />
               </button>
            </div>
            
            <ComplaintChat 
              complaintId={activeChatId} 
              chatEnabled={activeChat?.status !== 'RESOLVED'} 
              isAdmin={false}
              initialEscalationLevel={activeChat?.escalationLevel || 'NONE'}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 p-12 text-center opacity-40">
            <MessageSquare size={64} strokeWidth={1} className="text-outline" />
            <h2 className="headline-sm">Field Communication</h2>
          </div>
        )}
      </div>

      {/* Right Details Panel - Optimized for Driver View */}
      <AnimatePresence mode="wait">
        {activeChatId && (
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="hidden xl:flex flex-col w-[340px] gap-6"
          >
            <div className="bg-white dark:bg-surface-high/10 rounded-[40px] p-6 border border-outline-variant/30 shadow-xl shadow-black/[0.02] space-y-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-black tracking-tight">Task Details</h3>
                <AlertTriangle size={20} className="text-warning" />
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-2">Pick-up Location</p>
                  <div className="flex items-start gap-3">
                     <MapPin size={16} className="text-primary mt-0.5" />
                     <p className="text-sm font-bold leading-tight">{activeChat?.category} - Ward 14</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-2">Citizen</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-high flex items-center justify-center text-outline">
                      <User size={18} />
                    </div>
                    <p className="text-sm font-black">{activeChat?.citizen}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant/20">
                  <div>
                    <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Report Time</p>
                    <p className="text-xs font-mono font-bold text-primary">{activeChat?.time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Status</p>
                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                      {activeChat?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  className="w-full bg-success text-white py-4 rounded-[22px] font-black tracking-[0.1em] flex items-center justify-center gap-3 shadow-xl shadow-success/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Navigation size={20} />
                  Start Navigation
                </button>
              </div>
            </div>

            <div className="p-6 rounded-[32px] bg-surface border border-outline-variant/30 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline mb-3">Internal Note</h4>
              <p className="text-xs font-bold text-outline-variant leading-relaxed relative z-10">
                Ensure you upload a 'Before' and 'After' photo of the site to close this task successfully.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
