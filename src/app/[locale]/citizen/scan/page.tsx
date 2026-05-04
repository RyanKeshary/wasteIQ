/**
 * WasteIQ — Citizen QR Scan Page
 * Allows citizens to scan bin QR codes for reporting and status.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, CheckCircle, AlertTriangle, MessageCircle, Star, Info } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import jsQR from 'jsqr';

interface BinData {
  id: string;
  qrCode: string;
  address: string;
  fillLevel: number;
  type: string;
  status: 'CLEAN' | 'NEEDS_ATTENTION' | 'OVERFLOW';
}

const mockBins: BinData[] = [
  { id: '1', qrCode: 'WIQ-0482', address: 'Station Road, Mira Road (E)', fillLevel: 42, type: 'DRY', status: 'CLEAN' },
  { id: '2', qrCode: 'WIQ-0334', address: 'Market Lane, Bhayandar', fillLevel: 67, type: 'WET', status: 'CLEAN' },
  { id: '3', qrCode: 'WIQ-0176', address: 'Garden Colony', fillLevel: 23, type: 'MIXED', status: 'CLEAN' },
  { id: '4', qrCode: 'WIQ-0923', address: 'Coastal Road', fillLevel: 88, type: 'RECYCLABLE', status: 'NEEDS_ATTENTION' },
];

type ScanState = 'scanning' | 'processing' | 'result';

export default function CitizenScanPage() {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [binData, setBinData] = useState<BinData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scanningRef = useRef(false);

  const startCamera = async () => {
    try {
      const constraints = { video: { facingMode: 'environment' } };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
      scanningRef.current = true;
      requestAnimationFrame(scanLoop);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera permission denied or not available.');
    }
  };

  const stopCamera = () => {
    scanningRef.current = false;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const scanLoop = () => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        scanningRef.current = false;
        handleDecodedCode(code.data);
        return;
      }
    }
    requestAnimationFrame(scanLoop);
  };

  const handleDecodedCode = (data: string) => {
    setScanState('processing');
    toast.loading('Identifying Bin...', { id: 'scan-cit' });

    setTimeout(() => {
      const found = mockBins.find(b => b.qrCode === data) || {
        id: 'new',
        qrCode: data,
        address: 'Mira-Bhayandar Ward 4',
        fillLevel: Math.floor(Math.random() * 100),
        type: 'GENERAL',
        status: 'CLEAN'
      };
      setBinData(found);
      setScanState('result');
      toast.success('Bin Identified: ' + data, { id: 'scan-cit' });
    }, 1200);
  };

  useEffect(() => {
    if (scanState === 'scanning') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [scanState]);

  return (
    <div className="max-w-[600px] mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="headline-md">Scan Smart Bin</h1>
        <p className="body-md text-outline">Scan the QR code on any WasteIQ bin to see its status or report a problem.</p>
      </div>

      <AnimatePresence mode="wait">
        {scanState === 'scanning' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-black relative shadow-2xl border-4 border-white">
              <canvas ref={canvasRef} className="hidden" />
              {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <AlertTriangle size={48} className="text-error mb-4" />
                  <p className="title-sm">{error}</p>
                </div>
              ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
              )}
              
              {/* Scanner HUD */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
                 <div className="w-full h-full border-2 border-primary/50 rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                    <motion.div 
                      animate={{ top: ['5%', '95%'] }} 
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      className="absolute left-4 right-4 h-0.5 bg-primary/80 shadow-[0_0_15px_var(--primary)]" 
                    />
                 </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => handleDecodedCode('WIQ-0482')}
                className="btn-secondary flex items-center gap-2"
              >
                <Camera size={18} /> Simulate Scan (WIQ-0482)
              </button>
            </div>
          </motion.div>
        )}

        {scanState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-20"
          >
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
            <p className="title-md">Syncing with WasteIQ Cloud...</p>
          </motion.div>
        )}

        {scanState === 'result' && binData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-6 bg-surface-lowest border-2 border-primary/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="title-md">{binData.qrCode}</h3>
                  <p className="body-sm text-outline">{binData.address}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex justify-between items-center">
                    <span className="body-sm font-semibold">Fill Level</span>
                    <span className="title-sm">{binData.fillLevel}%</span>
                 </div>
                 <div className="w-full h-3 rounded-full bg-surface-low overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${binData.fillLevel}%` }}
                      className={`h-full ${binData.fillLevel > 80 ? 'bg-error' : 'bg-primary'}`}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 rounded-xl bg-surface-low">
                    <div className="text-[10px] font-bold text-outline uppercase">Waste Type</div>
                    <div className="body-sm font-semibold mt-1">{binData.type}</div>
                 </div>
                 <div className="p-3 rounded-xl bg-surface-low">
                    <div className="text-[10px] font-bold text-outline uppercase">Status</div>
                    <div className="body-sm font-semibold mt-1 flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${binData.status === 'CLEAN' ? 'bg-success' : 'bg-warning'}`} />
                       {binData.status.replace('_', ' ')}
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
               <Link href={`/citizen/complaints?binId=${binData.qrCode}`} className="btn-primary no-underline flex items-center justify-center gap-2 h-14">
                  <MessageCircle size={20} /> Report an Issue
               </Link>
               <Link href={`/citizen/rate?binId=${binData.qrCode}`} className="btn-ghost no-underline flex items-center justify-center gap-2 h-14">
                  <Star size={20} /> Rate Cleanliness
               </Link>
               <button onClick={() => setScanState('scanning')} className="btn-secondary h-14">
                  Scan Another Bin
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
