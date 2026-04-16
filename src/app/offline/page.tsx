'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: 'var(--surface)' }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card p-10 max-w-md w-full shadow-2xl flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--error-container)' }}>
          <WifiOff size={40} style={{ color: 'var(--error)' }} />
        </div>
        
        <h1 className="headline-md mb-4" style={{ fontFamily: 'var(--font-display)' }}>You're currently offline</h1>
        <p className="body-md mb-8" style={{ color: 'var(--on-surface-variant)' }}>
          WasteIQ needs an active internet connection to sync data. Some features might be unavailable until you reconnect.
        </p>

        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary w-full flex items-center justify-center gap-2 mb-4"
        >
          <RefreshCw size={18} /> Retry Connection
        </button>

        <Link href="/" className="text-sm font-semibold no-underline" style={{ color: 'var(--primary)' }}>
          Go back to dashboard
        </Link>
      </motion.div>
    </div>
  );
}
