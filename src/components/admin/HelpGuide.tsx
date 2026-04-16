'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Book, 
  MessageSquare, 
  Terminal, 
  HelpCircle, 
  ExternalLink,
  Search,
  Zap,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
          />

          {/* Guide Container */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#121212] z-[1001] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-primary text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <LifeBuoy size={24} />
                </div>
                <div>
                  <h2 className="title-lg">WasteIQ Guide</h2>
                  <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Command Center Assistance</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors border-none bg-transparent text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Docs Area */}
            <div className="p-6 bg-surface-lowest">
               <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  <input 
                    type="text" 
                    placeholder="Search documentation..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-high border border-outline-variant focus:border-primary outline-none text-sm transition-all"
                  />
               </div>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
               {/* Quick Links Group */}
               <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-outline mb-4">Quick Assistance</h3>
                  <div className="grid grid-cols-2 gap-3">
                     {[
                       { icon: Book, label: 'Standard Ops', desc: 'Manuals' },
                       { icon: ShieldCheck, label: 'Safety', desc: 'Protocols' },
                       { icon: Terminal, label: 'API Keys', desc: 'Management' },
                       { icon: Zap, label: 'Status', desc: 'System Live' },
                     ].map((item) => (
                       <button 
                         key={item.label}
                         className="flex flex-col items-start p-4 rounded-2xl bg-surface-low hover:bg-surface-high transition-all text-left group border-none"
                       >
                         <item.icon size={20} className="mb-2 text-primary group-hover:scale-110 transition-transform" />
                         <span className="text-xs font-bold">{item.label}</span>
                         <span className="text-[10px] opacity-60">{item.desc}</span>
                       </button>
                     ))}
                  </div>
               </section>

               {/* Tutorial Section */}
               <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-outline mb-4">Latest Tutorials</h3>
                  <div className="space-y-3">
                     {[
                       'Managing high-priority zones',
                       'Optimizing route efficiency',
                       'Handling sensor offline alerts'
                     ].map((t) => (
                       <div key={t} className="flex items-center justify-between p-4 rounded-2xl bg-surface-lowest border border-outline-variant hover:border-primary transition-all cursor-pointer group">
                          <span className="text-sm font-medium">{t}</span>
                          <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                       </div>
                     ))}
                  </div>
               </section>

               {/* Contact AI Support */}
               <section className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 rounded-lg bg-primary text-white"><MessageSquare size={18} /></div>
                     <h4 className="font-bold text-sm">Need deep assistance?</h4>
                  </div>
                  <p className="text-xs opacity-70 mb-4 leading-relaxed">
                     Our WasteIQ AI is trained on municipal protocols and can help you resolve complex logistical bottlenecks instantly.
                  </p>
                  <button className="w-full py-3 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all border-none">
                     Start AI Session
                  </button>
               </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-outline-variant bg-surface-lowest">
               <div className="flex justify-between items-center text-[10px] font-bold opacity-50 uppercase tracking-widest">
                  <span>WasteIQ v2.4.0</span>
                  <span>Mira-Bhayandar Unified Portal</span>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
