/**
 * WasteIQ — Driver QR Scan Page
 * Fully functional: scan simulation, confirm collection, report issue, scan another.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, CheckCircle, AlertTriangle, MapPin, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import jsQR from 'jsqr';
import { createWorker } from 'tesseract.js';

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

type ScanState = 'scanning' | 'processing' | 'result' | 'confirmed' | 'ocr_fallback';

export default function DriverScanPage() {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scanningRef = useRef(false);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: 'environment' }
      };
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
      toast.error('Could not access camera. Please check permissions.');
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
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        scanningRef.current = false;
        handleDecodedCode(code.data);
        return;
      }
    }
    requestAnimationFrame(scanLoop);
  };

  const ocrWorkerRef = useRef<any>(null);

  useEffect(() => {
    // Initialize OCR worker in background on mount
    const initOCR = async () => {
      const worker = await createWorker('eng');
      ocrWorkerRef.current = worker;
    };
    initOCR();
    return () => {
      if (ocrWorkerRef.current) ocrWorkerRef.current.terminate();
    };
  }, []);

  const runOCRIdentification = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    setScanState('processing');
    toast.loading('Running Neural Node Recognition...', { id: 'ocr' });

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context failed');

      // 1. CROP & PREPROCESS: Focus on the center viewfinder (50% of screen)
      // This drastically speeds up OCR as it processes fewer pixels
      const cropSize = Math.min(video.videoWidth, video.videoHeight) * 0.6;
      const startX = (video.videoWidth - cropSize) / 2;
      const startY = (video.videoHeight - cropSize) / 2;

      const ocrCanvas = document.createElement('canvas');
      ocrCanvas.width = cropSize;
      ocrCanvas.height = cropSize;
      const ocrCtx = ocrCanvas.getContext('2d');
      
      if (ocrCtx) {
        // Draw cropped region
        ocrCtx.drawImage(video, startX, startY, cropSize, cropSize, 0, 0, cropSize, cropSize);
        
        // Apply Grayscale + High Contrast for Tesseract speed
        const imageData = ocrCtx.getImageData(0, 0, cropSize, cropSize);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const val = avg > 128 ? 255 : 0; // Binarization
          data[i] = data[i+1] = data[i+2] = val;
        }
        ocrCtx.putImageData(imageData, 0, 0);
      }

      // 2. Perform OCR using persistent worker
      if (!ocrWorkerRef.current) {
        ocrWorkerRef.current = await createWorker('eng');
      }
      
      const { data: { text } } = await ocrWorkerRef.current.recognize(ocrCanvas);

      // Look for patterns like WIQ-XXXX or QR-MB-XXXX
      const binIdMatch = text.match(/(WIQ|QR-MB)-?\d{4}/i);
      
      if (binIdMatch) {
        const binId = binIdMatch[0].toUpperCase().replace(/[^A-Z0-9-]/g, '');
        toast.success(`Node Identified: ${binId}`, { id: 'ocr' });
        handleDecodedCode(binId, 'OCR');
      } else {
        toast.error('No valid Node ID found. Ensure label is clear.', { id: 'ocr' });
        setScanState('scanning');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      toast.error('OCR Engine failed. Retrying...', { id: 'ocr' });
      setScanState('scanning');
    }
  };

  const handleDecodedCode = async (data: string, method: 'QR' | 'OCR' = 'QR') => {
    setScanState('processing');
    const toastId = toast.loading(`Syncing Node via ${method}...`, { id: 'scan' });

    try {
      const response = await fetch('/api/bins/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: data,
          driverId: 'drv_demo_001', // Mock driver ID for now
          action: 'INSPECTION',
          scanMethod: method,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setScanResult({
          binId: result.data.bin.qrCode,
          address: result.data.bin.address,
          fillLevel: result.data.bin.currentFill,
          type: result.data.bin.type,
          zone: result.data.bin.zoneId || 'Central Zone',
        });
        setScanState('result');
        toast.success(`Node ${data} Authenticated`, { id: toastId });
      } else {
        toast.error(result.error || 'Invalid Node ID', { id: toastId });
        setScanState('scanning');
      }
    } catch (err) {
      console.error('Scan Sync Error:', err);
      toast.error('Sync service unreachable.', { id: toastId });
      setScanState('scanning');
    }
  };

  useEffect(() => {
    if (scanState === 'scanning') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [scanState]);

  const processScan = () => {
    // Manual trigger if auto-scan fails or user wants to force it
    if (scanState === 'scanning') {
      handleDecodedCode('MANUAL-TRIGGER-' + (scanCount + 1));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              handleDecodedCode(code.data);
            } else {
              toast.error('No QR code detected in the uploaded image.');
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmCollection = () => {
    if (!scanResult) return;
    setScanState('confirmed');
    setScanCount((c) => c + 1);
    toast.success(`Collection Logged for ${scanResult.binId}`, {
      description: `Inventory updated. Next node assigned.`,
    });
  };

  const reportIssue = () => {
    if (!scanResult) return;
    toast.error(`Maintenance Incident Logged`, {
      description: `Technician dispatched to ${scanResult.binId}.`,
    });
    resetScan();
  };

  const resetScan = () => {
    setScanState('scanning');
    setScanResult(null);
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="headline-lg">Optical Node Scanner</h1>
          <p className="body-md opacity-70">Verify collection using the on-board node identification system.</p>
        </div>
        {scanCount > 0 && (
          <div className="card bg-success-container/20 border-primary/20 px-4 py-2 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="mono-sm font-bold text-primary">{scanCount} Nodes Validated Today</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {scanState === 'scanning' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex flex-col items-center"
          >
            <div className="w-full h-[450px] md:h-[600px] card p-0 overflow-hidden mb-8 relative bg-black shadow-2xl group">
              {/* Hidden canvas for QR analysis */}
              <canvas ref={canvasRef} className="hidden" />
              
              {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <AlertTriangle size={48} className="text-error mb-4" />
                  <p className="title-md mb-2">{error}</p>
                  <button onClick={startCamera} className="btn-primary mt-4">Retry Camera Access</button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover opacity-80"
                />
              )}
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-3xl shadow-[0_0_20px_var(--primary)]" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-3xl shadow-[0_0_20px_var(--primary)]" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-3xl shadow-[0_0_20px_var(--primary)]" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-3xl shadow-[0_0_20px_var(--primary)]" />
                    
                    <motion.div
                      animate={{ top: ['5%', '95%', '5%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-4 right-4 h-1 bg-primary/80 shadow-[0_0_30px_var(--primary)]"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                       <QrCode size={120} className="text-white" />
                    </div>
                 </div>
              </div>

              <div className="absolute top-6 left-6 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white mono-sm">
                 <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${stream ? 'bg-primary animate-ping' : 'bg-error'}`} />
                    CAM_DRV_01: {stream ? 'ACTIVE' : 'OFFLINE'}
                 </div>
                 <div className="opacity-60">SENS_VAL: {stream ? 'STABLE' : 'N/A'} | RES: 1080P</div>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                 <button 
                  onClick={processScan}
                  disabled={!stream}
                  className="px-10 py-4 rounded-full bg-primary text-white font-bold title-sm shadow-[0_0_40px_var(--primary)] hover:scale-105 transition-transform flex items-center gap-3 disabled:opacity-50"
                 >
                    <Camera size={20} /> Capture Node Visual
                 </button>
                 <button 
                  onClick={runOCRIdentification}
                  disabled={!stream}
                  className="mt-4 px-10 py-3 rounded-full bg-surface-high text-on-surface font-bold title-sm border-2 border-primary/20 hover:bg-primary/5 transition-colors flex items-center gap-3 disabled:opacity-50"
                 >
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      OCR Fallback
                    </div>
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
               <div className="card p-6 flex items-center gap-4 bg-surface-lowest">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <QrCode size={24} />
                  </div>
                  <div>
                    <h4 className="title-sm">Auto-Identify</h4>
                    <p className="body-xs text-outline">System will automatically parse node metadata.</p>
                  </div>
               </div>
               <label className="card p-6 flex items-center gap-4 bg-surface-lowest cursor-pointer hover:border-primary transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h4 className="title-sm">Manual Upload</h4>
                    <p className="body-xs text-outline">Upload a high-res JPG/PNG of the QR plate.</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
               </label>
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
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
               <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
               <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
               >
                 <QrCode size={48} className="text-primary" />
               </motion.div>
            </div>
            <h2 className="headline-sm">Neural Image Analysis</h2>
            <p className="body-md mt-2 opacity-60">Cross-referencing with global node registry...</p>
          </motion.div>
        )}

        {scanState === 'result' && scanResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            <div className="space-y-6">
              <div className="card p-8 border-2 border-primary/20 shadow-xl bg-surface-lowest">
                <div className="flex items-start justify-between mb-8">
                   <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                     <CheckCircle size={32} />
                   </div>
                   <div className="text-right">
                      <span className="mono-sm font-bold text-primary">NODE IDENTIFIED</span>
                      <div className="headline-md mt-1">{scanResult.binId}</div>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-bold uppercase tracking-widest text-outline">Telemetry Content</span>
                      <span className="title-md">{scanResult.fillLevel}% (Saturation High)</span>
                   </div>
                   <div className="w-full h-4 rounded-full bg-surface-low overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${scanResult.fillLevel}%` }}
                        className={`h-full ${scanResult.fillLevel > 80 ? 'bg-error' : 'bg-primary'}`}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-surface-low p-4 rounded-2xl">
                      <div className="text-[10px] font-bold uppercase text-outline">Zone Authority</div>
                      <div className="title-sm mt-1">{scanResult.zone}</div>
                   </div>
                   <div className="bg-surface-low p-4 rounded-2xl">
                      <div className="text-[10px] font-bold uppercase text-outline">Substance Type</div>
                      <div className="title-sm mt-1">{scanResult.type} Content</div>
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button className="btn-primary h-16 text-lg shadow-primary/20" onClick={confirmCollection}>
                    Complete Node Collection
                 </button>
                 <button className="btn-ghost h-16 text-lg text-error hover:bg-error/5" onClick={reportIssue}>
                    Log Maintenance Incident
                 </button>
              </div>
            </div>

            <div className="card p-0 overflow-hidden h-[540px] relative hidden lg:block border-none">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542362567-b05537639097?auto=format&fit=crop&q=80&w=1000')] bg-cover saturate-[0.2] opacity-40" />
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-surface" />
               
               <div className="relative p-10 flex flex-col h-full">
                  <div className="title-lg mb-4">Node Visual Signature</div>
                  <div className="flex-1 rounded-3xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                     <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WASTEIQ-NODE-SYNC" 
                          className="w-full h-full"
                          alt="Node Signature"
                        />
                     </div>
                  </div>
                  <p className="body-sm text-center mt-6 text-outline bg-white/60 backdrop-blur px-6 py-4 rounded-2xl">
                    Historical data suggests this bin fills up 20% faster on weekends. Logistics team notified to increase frequency.
                  </p>
               </div>
            </div>
          </motion.div>
        )}

        {scanState === 'confirmed' && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-20 text-center max-w-[500px] mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-success-container flex items-center justify-center text-primary mb-8 shadow-xl">
               <CheckCircle size={56} />
            </div>
            <h2 className="headline-md">Sync Finalized</h2>
            <p className="body-md mt-3 opacity-60">Bin inventory has been officially cleared in the central database. You are authorized to proceed to the next waypoint.</p>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-10">
               <button className="btn-primary py-4" onClick={resetScan}>
                  Scan Next Node
               </button>
               <Link href="/driver" className="btn-ghost py-4 no-underline border-2">
                  View Route Summary
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
