/**
 * WasteIQ — Premium Unified Communication Component
 * High-fidelity, Rapido-style communication hub.
 * Fixed Visibility & Accessibility for Dark Mode.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { getAblyClient, CHANNELS } from '@/lib/ably';
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  MapPin, 
  CheckCheck,
  Clock,
  ChevronDown,
  Phone,
  ShieldAlert,
  Building,
  AlertTriangle,
  Plus,
  User,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'SYSTEM' | 'QUICK_REPLY';
  createdAt: string;
  payload?: any;
}

interface ChatProps {
  complaintId: string;
  chatEnabled: boolean;
  isAdmin?: boolean;
  minimal?: boolean; 
  initialCallEnabled?: boolean;
  initialEscalationLevel?: 'NONE' | 'CALL' | 'GOVERNMENT';
}

export default function ComplaintChat({ 
  complaintId, 
  chatEnabled, 
  isAdmin = false, 
  minimal = false,
  initialCallEnabled = false, 
  initialEscalationLevel = 'NONE' 
}: ChatProps) {
  const t = useTranslations('chat');
  
  // Dummy session for demo
  const session = { user: { id: 'demo-user', role: isAdmin ? 'ADMIN' : 'CITIZEN' } };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [showCallUI, setShowCallUI] = useState(false);
  const [escalationLevel, setEscalationLevel] = useState<'NONE' | 'CALL' | 'GOVERNMENT'>(initialEscalationLevel as any);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll with behavior smooth
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Initial Data & Simulation
  useEffect(() => {
    const initialMsgs: Message[] = [
      {
        id: '1',
        senderId: 'system',
        senderRole: 'ADMIN',
        content: 'Welcome to WasteIQ Unified Support. We are here to assist you.',
        type: 'TEXT',
        createdAt: new Date().toISOString()
      }
    ];

    if (complaintId.startsWith('complaint-') || complaintId.startsWith('task-')) {
       initialMsgs.push({
          id: '2',
          senderId: 'driver',
          senderRole: 'DRIVER',
          content: 'I have received your request and I am heading to the site now.',
          type: 'TEXT',
          createdAt: new Date(Date.now() - 300000).toISOString()
       });
    }

    setMessages(initialMsgs);
    
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [complaintId]);

  const sendMessage = async (content: string, type: string = 'TEXT', payload: any = null) => {
    if (!content.trim() && type !== 'QUICK_REPLY') return;

    const userMsg: Message = {
      id: Math.random().toString(),
      senderId: session.user.id,
      senderRole: session.user.role as any,
      content,
      type: type as any,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate Flow: Chat -> Call Suggestion
    if (messages.length > 2 && escalationLevel === 'NONE') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'sys-call',
          senderId: 'system',
          senderRole: 'ADMIN',
          content: 'I noticed the conversation is ongoing. Would you prefer a direct call?',
          type: 'SYSTEM',
          createdAt: new Date().toISOString()
        }]);
        setEscalationLevel('CALL');
      }, 1000);
    }
    
    // Auto-reply
    setTimeout(() => {
      const replyText = escalationLevel === 'GOVERNMENT' 
        ? '[OFFICIAL] The Ward Office has been notified. An inspector has been dispatched.'
        : 'Received. I am processing this update.';
        
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        senderId: 'system',
        senderRole: escalationLevel === 'GOVERNMENT' ? 'GOVERNMENT' : 'ADMIN',
        content: replyText,
        type: 'TEXT',
        createdAt: new Date().toISOString()
      }]);
    }, 2000);
  };

  const handleCall = () => {
    setIsCalling(true);
    setShowCallUI(true);
    // Simulate call flow
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        senderId: 'system',
        senderRole: 'ADMIN',
        content: 'Call ended. Unresolved? You can now escalate to Municipal Emergency Support.',
        type: 'SYSTEM',
        createdAt: new Date().toISOString()
      }]);
      setIsCalling(false);
      setShowCallUI(false);
    }, 4000);
  };

  const handleGovEscalate = () => {
    setEscalationLevel('GOVERNMENT');
    toast.error('Case Escalated to Municipal Ward Office', {
      description: 'High-priority protocol initiated.',
      icon: <ShieldAlert className="text-error" />
    });
    setMessages(prev => [...prev, {
      id: 'gov-alert',
      senderId: 'system',
      senderRole: 'GOVERNMENT',
      content: '🚨 EMERGENCY ESCALATION: This ticket is now under Municipal Oversight.',
      type: 'SYSTEM',
      createdAt: new Date().toISOString()
    }]);
  };

  const handleQuickAction = (reply: any) => {
    sendMessage(`${reply.icon} ${reply.label}`, 'QUICK_REPLY', { action: reply.action });
  };

  const QUICK_REPLIES = [
    { label: 'ETA?', action: 'WHERE', icon: '📍' },
    { label: 'Done', action: 'FULL', icon: '✅' },
    { label: 'Emergency', action: 'SOS', icon: '🚨' },
    { label: 'Help', action: 'HELP', icon: '❓' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-[#0F172A] rounded-[48px] border border-outline-variant/30 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative">
      
      {/* Call Overlay (Premium Rapido Style) */}
      <AnimatePresence>
        {showCallUI && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-[60] bg-primary/95 backdrop-blur-2xl flex flex-col items-center justify-between text-white py-20 px-10 text-center"
          >
            <div className="flex flex-col items-center">
               <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center relative mb-8">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-white/20"
                  />
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl">
                     <Phone size={48} className="text-primary" fill="currentColor" />
                  </div>
               </div>
               <h2 className="text-4xl font-black tracking-tight mb-2 text-white">Connecting...</h2>
               <p className="text-lg opacity-80 font-medium text-white/80">End-to-End Encrypted Secure Line</p>
            </div>

            <div className="space-y-6 w-full max-w-xs">
               <div className="flex justify-center gap-8 mb-12">
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <User size={24} className="text-white" />
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Speaker</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <ImageIcon size={24} className="text-white" />
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Video</span>
                  </div>
               </div>
               <button 
                  onClick={() => setShowCallUI(false)}
                  className="w-full py-5 bg-error text-white rounded-[24px] font-black tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-error/40 flex items-center justify-center gap-3"
               >
                  DISCONNECT
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Glassmorphic */}
      <div className="p-6 pb-5 border-b border-outline-variant/20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className={`w-14 h-14 rounded-[22px] ${escalationLevel === 'GOVERNMENT' ? 'bg-error/20' : 'bg-primary/20'} flex items-center justify-center transition-all duration-500 group-hover:scale-105 shadow-inner`}>
               {escalationLevel === 'GOVERNMENT' ? (
                 <ShieldAlert size={28} className="text-error" />
               ) : (
                 <Zap size={28} className="text-primary" fill="currentColor" />
               )}
            </div>
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${isConnecting ? 'bg-slate-400' : 'bg-success'} shadow-sm`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <h4 className="title-lg font-black tracking-tight text-slate-900 dark:text-white">
                 {escalationLevel === 'GOVERNMENT' ? 'Municipal Response' : 'Field Support'}
               </h4>
               {escalationLevel === 'GOVERNMENT' && (
                 <motion.span 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="px-2 py-0.5 rounded-full bg-error text-[8px] font-black text-white uppercase tracking-tighter shadow-sm"
                 >
                   Critical
                 </motion.span>
               )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg ${
                escalationLevel === 'GOVERNMENT' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
              }`}>
                {escalationLevel === 'NONE' ? 'Standard Line' : escalationLevel === 'CALL' ? 'Priority Link' : 'Gov. Protocol'}
              </span>
              <div className="flex items-center gap-1.5 ml-1">
                 <div className={`w-1.5 h-1.5 rounded-full ${isConnecting ? 'bg-slate-400 animate-pulse' : 'bg-success'}`} />
                 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                   {isConnecting ? 'Syncing...' : 'Live Channel'}
                 </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {(escalationLevel === 'CALL' || escalationLevel === 'GOVERNMENT') && (
            <button 
              onClick={handleCall}
              className="w-12 h-12 rounded-2xl bg-success text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-success/30 ring-4 ring-success/10"
            >
              <Phone size={22} fill="currentColor" />
            </button>
          )}
          
          {escalationLevel !== 'GOVERNMENT' && (
            <button 
              onClick={handleGovEscalate}
              className="h-12 px-6 rounded-2xl bg-error/10 text-error border border-error/20 hover:bg-error hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
            >
              <ShieldAlert size={16} />
              Escalate
            </button>
          )}
        </div>
      </div>

      {/* Chat Area - Fluid Scrolling */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === session.user.id;
            const isSystem = msg.type === 'SYSTEM';
            const isSameAsPrevious = idx > 0 && messages[idx-1].senderId === msg.senderId;

            if (isSystem) {
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center my-8"
                >
                  <div className="px-6 py-3 rounded-[20px] bg-slate-100 dark:bg-slate-800/80 text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-[0.2em] border border-outline-variant/30 backdrop-blur-md text-center shadow-sm max-w-xs leading-relaxed">
                    {msg.content}
                    {msg.content.toLowerCase().includes('call') && (
                       <button 
                        onClick={handleCall} 
                        className="block mt-3 text-primary font-black border-t border-slate-200 dark:border-slate-700 pt-2 transition-opacity hover:opacity-70"
                       >
                         INITIATE CALL NOW
                       </button>
                    )}
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isMe ? 20 : -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSameAsPrevious ? 'mt-1' : 'mt-6'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[70%] group flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isSameAsPrevious && (
                     <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 px-2">
                       {isMe ? 'You' : msg.senderRole}
                     </span>
                  )}
                  <div 
                    className={`px-5 py-4 rounded-[32px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative transition-all group-hover:shadow-md ${
                      isMe 
                        ? 'bg-gradient-to-br from-primary to-primary-variant text-white rounded-tr-lg shadow-primary/20' 
                        : msg.senderRole === 'GOVERNMENT'
                          ? 'bg-gradient-to-br from-error to-error/80 text-white rounded-tl-lg shadow-error/20'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-tl-lg border border-outline-variant/30 backdrop-blur-sm shadow-sm'
                    }`}
                  >
                    <p className="body-sm font-medium leading-relaxed tracking-tight">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck size={10} className="text-primary" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Area - Floating Design */}
      <div className="p-6 pt-2 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#0F172A] dark:via-[#0F172A]/95">
        
        {/* Quick Suggestions - Compact Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-2 mask-fade-right">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply.action}
              onClick={() => handleQuickAction(reply)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest transition-all border border-outline-variant/30 shadow-sm active:scale-95"
            >
              <span className="mr-2">{reply.icon}</span>
              {reply.label}
            </button>
          ))}
        </div>

        {/* Smart Input Container */}
        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary-variant/20 rounded-[40px] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
           <div className="relative flex items-center gap-3 bg-white dark:bg-slate-800 rounded-[36px] p-2 pl-7 border border-outline-variant/40 group-focus-within:border-primary/60 transition-all shadow-xl shadow-black/[0.02]">
             <input 
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
               placeholder="Type a message..."
               className="flex-1 bg-transparent border-none outline-none py-4 text-sm font-bold tracking-tight text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
             />
             <div className="flex items-center gap-1 mr-1">
                <button className="p-3 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">
                   <ImageIcon size={20} />
                </button>
                <button 
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                    inputValue.trim() 
                      ? 'bg-primary text-white scale-100 rotate-0 shadow-primary/30' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500 scale-90 -rotate-45'
                  }`}
                >
                  <Send size={22} className={inputValue.trim() ? 'translate-x-0.5' : ''} />
                </button>
             </div>
           </div>
        </div>
        
        {/* Safe Area Padding for Mobile Bottom Bar */}
        <div className="h-4" />
      </div>
    </div>
  );
}
