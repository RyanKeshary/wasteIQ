/**
 * WasteIQ — Citizen Messaging Hub
 * Unified communication for reports and support.
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  MessageSquare, 
  Search, 
  ChevronRight, 
  Clock, 
  User, 
  Truck, 
  CheckCircle,
  Phone,
  ShieldAlert,
  Plus,
  Info,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import ComplaintChat from '@/components/complaints/ComplaintChat';
import { useTranslations } from 'next-intl';

export default function MessagingPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('support');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<any[]>([
    {
      id: 'support',
      title: 'WasteIQ Live Support',
      lastMessage: 'How can we help you today?',
      time: 'Just now',
      unread: true,
      driver: 'System Assistant',
      status: 'SUPPORT',
      category: 'General Help',
      escalationLevel: 'NONE'
    },
    {
      id: 'complaint-1',
      title: 'Missed Collection - Market Lane',
      lastMessage: 'I am arriving in 5 minutes.',
      time: '2m ago',
      unread: true,
      driver: 'Ajay Solanki',
      status: 'IN_PROGRESS',
      category: 'Missed Collection',
      escalationLevel: 'CALL'
    },
    {
      id: 'complaint-2',
      title: 'Overflowing Bin - Station Road',
      lastMessage: 'The site has been cleared. Thank you.',
      time: '1h ago',
      unread: false,
      driver: 'Rajesh Kumar',
      status: 'RESOLVED',
      category: 'Overflowing Bin',
      escalationLevel: 'NONE'
    },
    {
      id: 'complaint-3',
      title: 'Illegal Dumping - North Highway',
      lastMessage: 'GOVERNMENT INSPECTOR ASSIGNED',
      time: '3h ago',
      unread: false,
      driver: 'Team Alpha',
      status: 'OPEN',
      category: 'Illegal Dumping',
      escalationLevel: 'GOVERNMENT'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6 p-4 md:p-0 overflow-hidden">
      {/* Sidebar / Chat List */}
      <div className={`w-full md:w-[400px] flex flex-col gap-6 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between px-2">
          <div>
             <h1 className="text-3xl font-black tracking-tight m-0 flex items-center gap-3">
               Messages
               <span className="flex h-6 px-2 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                  {chats.filter(c => c.unread).length} New
               </span>
             </h1>
             <p className="text-outline text-xs font-bold uppercase tracking-widest mt-1">Mira-Bhayandar Ward Support</p>
          </div>
          <button className="w-12 h-12 rounded-2xl bg-surface-high/50 hover:bg-primary/10 flex items-center justify-center text-outline hover:text-primary transition-all">
            <Sparkles size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative group mx-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search active reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-low border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/50"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar px-2">
          {filteredChats.map((chat) => (
            <motion.button
              key={chat.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full p-5 rounded-[28px] flex items-center gap-4 transition-all relative overflow-hidden group ${
                activeChatId === chat.id 
                  ? 'bg-white dark:bg-surface-high/20 shadow-xl shadow-black/[0.03] ring-1 ring-outline-variant/30' 
                  : 'bg-transparent hover:bg-surface-high/30'
              }`}
            >
              {activeChatId === chat.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"
                />
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative transition-transform group-hover:scale-110 ${
                chat.status === 'SUPPORT' ? 'bg-primary/10 text-primary' : 
                chat.status === 'CRITICAL' ? 'bg-error/10 text-error' : 'bg-surface-high/50 text-outline'
              }`}>
                {chat.status === 'SUPPORT' ? <Zap size={24} fill="currentColor" /> : 
                 chat.status === 'CRITICAL' ? <ShieldAlert size={24} /> : <User size={24} />}
                
                {chat.unread && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </span>
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-black tracking-tight truncate ${activeChatId === chat.id ? 'text-primary' : 'text-on-surface'}`}>
                    {chat.title}
                  </h3>
                  <span className="text-[10px] font-bold text-outline-variant whitespace-nowrap">{chat.time}</span>
                </div>
                <p className={`text-xs truncate font-medium ${chat.unread ? 'text-on-surface font-bold' : 'text-outline-variant'}`}>
                  {chat.lastMessage}
                </p>
                <div className="flex items-center gap-2 mt-2">
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${
                      chat.status === 'SUPPORT' ? 'bg-primary/5 text-primary' : 'bg-surface-high/80 text-outline'
                   }`}>
                      {chat.category}
                   </span>
                   {chat.escalationLevel === 'GOVERNMENT' && (
                      <span className="flex items-center gap-1 text-[8px] font-black text-error uppercase">
                         <ShieldAlert size={10} /> Escalated
                      </span>
                   )}
                </div>
              </div>
            </motion.button>
          ))}
          
          {chats.length <= 1 && (
            <div className="p-8 mt-4 rounded-3xl bg-primary/5 border border-primary/10 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                 <Plus size={32} className="text-primary" />
              </div>
              <h3 className="title-sm mb-1">No active reports</h3>
              <p className="body-xs mb-6 text-outline">Need to report a waste issue?</p>
              <Link href="/citizen/complaints?new=true" className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 no-underline shadow-lg shadow-primary/20">
                Submit Report
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-full bg-white dark:bg-black/20 rounded-[48px] border border-outline-variant/30 overflow-hidden relative shadow-inner ${!activeChatId ? 'hidden md:flex items-center justify-center opacity-40' : 'flex'}`}>
        {activeChatId ? (
          <div className="h-full w-full flex flex-col">
            {/* Mobile Header */}
            <div className="md:hidden p-5 border-b border-outline-variant/20 flex items-center gap-4 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
              <button 
                onClick={() => setActiveChatId(null)}
                className="p-3 hover:bg-surface-high rounded-full transition-colors"
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <div className="flex-1">
                <h3 className="text-base font-black tracking-tight">{activeChat?.driver}</h3>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{activeChat?.status}</p>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-3 hover:bg-surface-high rounded-2xl transition-colors">
                    <Phone size={20} />
                 </button>
              </div>
            </div>
            
            <ComplaintChat 
              complaintId={activeChatId} 
              chatEnabled={activeChat?.status !== 'RESOLVED'} 
              initialEscalationLevel={activeChat?.escalationLevel || 'NONE'}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 p-12 text-center">
            <div className="w-32 h-32 rounded-[40px] bg-surface-high/50 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[40px] animate-pulse" />
              <MessageSquare size={64} strokeWidth={1} className="text-outline relative z-10" />
            </div>
            <div className="max-w-xs">
              <h2 className="text-2xl font-black tracking-tight mb-2">Select a Report</h2>
              <p className="text-sm font-medium text-outline-variant leading-relaxed">
                Choose a conversation from the sidebar to connect with our field teams and support staff.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Details Panel - Hidden on Mobile */}
      <AnimatePresence mode="wait">
        {activeChatId && activeChatId !== 'support' && (
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="hidden xl:flex flex-col w-[340px] gap-6 overflow-y-auto custom-scrollbar"
          >
            {/* Report Context Card */}
            <div className="bg-white dark:bg-surface-high/10 rounded-[40px] p-6 border border-outline-variant/30 shadow-xl shadow-black/[0.02] space-y-6">
              <div className="flex items-start justify-between">
                <div>
                   <h3 className="text-lg font-black tracking-tight">Report Info</h3>
                   <p className="text-[10px] font-black text-outline uppercase tracking-widest mt-1">Reference: MB-99{activeChatId}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-high text-outline">
                  <Info size={20} />
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-[18px] bg-primary/5 text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Pick-up Location</p>
                    <p className="text-sm font-bold leading-relaxed">{activeChat?.title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-[18px] bg-secondary/5 text-secondary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Incident Time</p>
                    <p className="text-sm font-bold">{activeChat?.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-[18px] bg-success/5 text-success">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Assigned Unit</p>
                    <p className="text-sm font-bold text-primary">{activeChat?.driver}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/30">
                <Link 
                  href={`/citizen/complaints?id=${activeChatId}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-surface-high hover:bg-primary/10 hover:text-primary transition-all text-xs font-black uppercase tracking-widest no-underline group"
                >
                  View Detail Hub
                  <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-6 rounded-[32px] bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
                 <Zap size={12} fill="currentColor" />
                 Pro Tip
              </h4>
              <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
                You can attach images of the resolved site directly in the chat to help us close the ticket faster.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
