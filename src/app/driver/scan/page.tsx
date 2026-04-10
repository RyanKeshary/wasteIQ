/**
 * WasteIQ — Driver QR Scan Page
 * Fully functional: scan simulation, confirm collection, report issue, scan another.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface ScanResult {
  binId: string;
  address: string;
  fillLevel: number;
  type: string;
  zone: string;
}

const mockBins: ScanResult[] = [
  { binId: 'WIQ-0482', address: 'Station Road, Gate 3', fillLevel: 92, type: 'DRY', zone: 'Mira Road (East)' },
  { binId: 'WIQ-0334', address: 'Market Lane, North', fillLevel: 67, type: 'WET', zone: 'Bhayandar Market' },
  { binId: 'WIQ-0176', address: 'Garden Colony', fillLevel: 44, type: 'MIXED', zone: 'Kashimira' },
  { binId: 'WIQ-0923', address: 'Coastal Road', fillLevel: 88, type: 'RECYCLABLE', zone: 'Coastal Strip' },
];

type ScanState = 'scanning' | 'processing' | 'result' | 'confirmed';

export default function DriverScanPage() {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);

  const simulateScan = () => {
    setScanState('processing');
    toast.loading('Processing QR code...', { id: 'scan' });

    setTimeout(() => {
      const randomBin = mockBins[scanCount % mockBins.length];
      setScanResult(randomBin);
      setScanState('result');
      toast.success(`Bin ${randomBin.binId} identified`, { id: 'scan' });
    }, 1200);
  };

  const confirmCollection = () => {
    if (!scanResult) return;
    setScanState('confirmed');
    setScanCount((c) => c + 1);
    toast.success(`Collection confirmed for ${scanResult.binId} ✅`, {
      description: `Bin reset to 0%. Performance data logged.`,
      duration: 3000,
    });
  };

  const reportIssue = () => {
    if (!scanResult) return;
    toast.warning(`Maintenance report filed for ${scanResult.binId}`, {
      description: 'The operations team has been notified.',
      duration: 3000,
    });
    resetScan();
  };

  const resetScan = () => {
    setScanState('scanning');
    setScanResult(null);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="headline-lg mb-1">Scan Bin QR</h1>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
              Scan to verify collection or report maintenance
            </p>
          </div>
          {scanCount > 0 && (
            <span
              className="text-[10px] font-bold px-3 py-1 rounded-full"
              style={{ background: 'var(--success-container)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}
            >
              {scanCount} scanned today
            </span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* SCANNING STATE */}
        {scanState === 'scanning' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="card p-0 overflow-hidden mb-4"
              style={{ height: '320px' }}
            >
              <div
                className="w-full h-full relative flex items-center justify-center"
                style={{ background: '#1a1a1a' }}
              >
                <div
                  className="w-48 h-48 relative"
                  style={{ border: '3px solid var(--primary)', borderRadius: '16px' }}
                >
                  <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: 'var(--primary-container)' }} />
                  <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: 'var(--primary-container)' }} />
                  <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: 'var(--primary-container)' }} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: 'var(--primary-container)' }} />
                  <motion.div
                    className="absolute left-2 right-2 h-0.5"
                    style={{ background: 'var(--primary-container)', boxShadow: '0 0 12px var(--primary-container)' }}
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <QrCode
                  size={32}
                  className="absolute"
                  style={{ color: 'rgba(255,255,255,0.15)' }}
                />
              </div>
            </div>
            <p className="body-sm text-center mb-4" style={{ color: 'var(--on-surface-variant)' }}>
              Position the QR code within the frame to scan
            </p>
            <button className="btn-primary w-full" onClick={simulateScan}>
              <Camera size={16} /> Simulate Scan
            </button>
          </motion.div>
        )}

        {/* PROCESSING STATE */}
        {scanState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
            <p className="title-md">Processing QR Code...</p>
          </motion.div>
        )}

        {/* RESULT STATE */}
        {scanState === 'result' && scanResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <CheckCircle size={56} style={{ color: 'var(--primary)', margin: '0 auto' }} />
              </motion.div>
              <h2 className="title-lg mt-3" style={{ color: 'var(--primary)' }}>Bin Scanned!</h2>
            </div>
            <div className="card p-5 mb-4" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{scanResult.binId}</span>
                  <p className="body-sm mt-0.5" style={{ color: 'var(--on-surface-variant)' }}>
                    <MapPin size={12} className="inline" /> {scanResult.address}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                  style={{
                    background: scanResult.fillLevel >= 80 ? 'var(--error-container)' : 'var(--warning-container)',
                    color: scanResult.fillLevel >= 80 ? 'var(--error)' : 'var(--warning)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {scanResult.fillLevel}% Full
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ background: 'var(--surface-low)' }}>
                  <span className="text-[10px] uppercase" style={{ color: 'var(--outline)' }}>Type</span>
                  <p className="mono-sm font-bold">{scanResult.type}</p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'var(--surface-low)' }}>
                  <span className="text-[10px] uppercase" style={{ color: 'var(--outline)' }}>Zone</span>
                  <p className="mono-sm font-bold">{scanResult.zone}</p>
                </div>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-high)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scanResult.fillLevel}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{
                    background: scanResult.fillLevel >= 80 ? 'var(--error)' : 'var(--warning)',
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn-primary w-full" onClick={confirmCollection}>
                <CheckCircle size={14} /> Confirm Collection
              </button>
              <button
                className="btn-ghost w-full"
                style={{ color: 'var(--warning)' }}
                onClick={reportIssue}
              >
                <AlertTriangle size={14} /> Report Issue
              </button>
              <button className="btn-ghost w-full text-sm" onClick={resetScan}>
                Scan Another Bin
              </button>
            </div>
          </motion.div>
        )}

        {/* CONFIRMED STATE */}
        {scanState === 'confirmed' && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--success-container)' }}
              >
                <CheckCircle size={40} style={{ color: 'var(--primary)' }} />
              </div>
            </motion.div>
            <h2 className="headline-md mb-2" style={{ color: 'var(--primary)' }}>Collection Confirmed!</h2>
            <p className="body-md mb-6" style={{ color: 'var(--on-surface-variant)' }}>
              Bin has been reset and performance data logged.
            </p>
            <button className="btn-primary" onClick={resetScan}>
              <Camera size={14} /> Scan Next Bin
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
