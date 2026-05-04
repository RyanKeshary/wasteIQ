'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * NotificationCenter Component
 * A premium, glassmorphic notification hub with categorized alerts and rich interactions.
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkRead,
  onClearAll,
  isOpen,
  onClose,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'error': return { icon: AlertCircle, color: 'var(--error)', bg: 'var(--error-container)' };
      case 'success': return { icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-container)' };
      case 'warning': return { icon: AlertCircle, color: 'var(--warning)', bg: 'var(--warning-container)' };
      default: return { icon: Info, color: 'var(--info)', bg: 'var(--info-container)' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 md:hidden bg-black/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 top-full mt-4 w-[360px] md:w-[420px] max-h-[600px] z-50 overflow-hidden glass-card shadow-2xl flex flex-col border border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(30px) saturate(180%)',
            }}
          >
            {/* Header */}
            <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell size={20} className="text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-[10px] text-white flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h3 className="headline-sm !text-lg m-0">Activity Center</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClearAll}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors text-outline hover:text-error"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors text-outline md:hidden"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-40">
                  <Bell size={48} strokeWidth={1} />
                  <p className="body-md mt-4">All caught up!</p>
                </div>
              ) : (
                notifications.map((notif, i) => {
                  const { icon: Icon, color, bg } = getTypeStyles(notif.type);
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => onMarkRead(notif.id)}
                      className={`group p-4 rounded-2xl transition-all cursor-pointer relative overflow-hidden ${
                        notif.read ? 'bg-transparent opacity-60' : 'bg-white shadow-sm hover:shadow-md'
                      }`}
                    >
                      {/* Read indicator line */}
                      {!notif.read && (
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-1.5"
                          style={{ background: color }}
                        />
                      )}

                      <div className="flex gap-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                          style={{ background: bg, color: color }}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="title-sm !text-[13px] leading-tight truncate">
                              {notif.title}
                            </h4>
                            <span className="mono-sm text-[10px] opacity-40 flex-shrink-0 mt-0.5">
                              {notif.time}
                            </span>
                          </div>
                          <p className="body-xs text-outline mt-1 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="flex-shrink-0 self-center">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          </div>
                        )}
                      </div>
                      
                      {/* Hover Action */}
                      <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                          <Check size={10} /> Mark as read
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-outline-variant bg-surface-low/50 text-center">
                <button 
                  className="text-xs font-bold text-primary hover:underline"
                  onClick={onClearAll}
                >
                  Archive all notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
