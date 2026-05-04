/**
 * WasteIQ — Ultra-Premium Landing Page
 * ─────────────────────────────────────
 * Features:
 *  §1  Hero         — Full-screen gradient mesh, massive type, orbiting decorations
 *  §2  Scroll Stats — Sticky 200vh tall, numbers scale up & count as you scroll
 *  §3  Horizontal   — Sticky horizontal-scroll module showcase
 *  §4  Living Grid  — Map + stats with alternating slide-ins
 *  §5  Lifecycle    — Sticky timeline, each step reveals on scroll
 *  §6  Analytics    — KPI rings with scroll-triggered fills
 *  §7  Report       — Form that slides over the previous section
 *
 * Cursor: default (no custom trail)
 */
'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  Brain, Map, Truck, Bell, Route, ShieldCheck, Wifi,
  Camera, MapPin, Globe, Sparkles, Activity, ArrowRight,
  Signal, CheckCircle, Timer, Zap, BarChart3, TrendingUp,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CountUp from '@/components/effects/CountUp';
import LiveActivityShowcase from '@/components/notifications/LiveActivityShowcase';

const LiveMap = dynamic(() => import('@/components/admin/LiveMap'), { ssr: false });
const ParticleField = dynamic(() => import('@/components/effects/ParticleField'), { ssr: false });

/* ─── helpers ────────────────────────────────────────────── */

function SlideIn({ children, from = 'left', className = '', delay = 0 }: { children: ReactNode; from?: 'left' | 'right'; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: from === 'left' ? -100 : 100 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── data ───────────────────────────────────────────────── */

const modules = [
  { icon: Brain,       title: 'AI Priority Engine',   desc: 'Neural networks predict bin overflows 6 hours in advance using atmospheric and demographic signals.',         color: '#00C16A', bg: 'linear-gradient(135deg, rgba(0,193,106,0.15), rgba(0,109,57,0.04))' },
  { icon: Route,       title: 'Route Optimizer',       desc: 'Dynamic routing recalculates truck paths every 30s, factoring live traffic, weight sensors and urgency.',      color: '#39B8FD', bg: 'linear-gradient(135deg, rgba(57,184,253,0.15), rgba(0,101,145,0.04))' },
  { icon: Map,         title: 'Live City Map',         desc: 'Ward officers get granular daily reports, real-time bin heatmaps and ROI dashboards.',                          color: '#00C16A', bg: 'linear-gradient(135deg, rgba(0,193,106,0.10), rgba(0,109,57,0.02))' },
  { icon: Bell,        title: 'Citizen Alerts',        desc: 'Omni-channel push notifications for delays, cleanup scheduling and emergency evacuations.',                    color: '#FF8842', bg: 'linear-gradient(135deg, rgba(255,136,66,0.15), rgba(157,67,0,0.04))' },
  { icon: ShieldCheck, title: 'Proof of Service',      desc: 'GPS-verified timestamps + mandatory photo logs establish an immutable audit trail for every pickup.',           color: '#39B8FD', bg: 'linear-gradient(135deg, rgba(57,184,253,0.10), rgba(0,101,145,0.02))' },
  { icon: Truck,       title: 'Driver PWA',            desc: 'Offline-first progressive web app with QR scanning, turn-by-turn guidance and voice-over route updates.',       color: '#00C16A', bg: 'linear-gradient(135deg, rgba(0,193,106,0.10), rgba(0,109,57,0.02))' },
];

const steps = [
  { 
    num: '01', 
    title: 'Sense',      
    desc: 'IoT sensors detect bin density in real-time, transmitting telemetry every 15 seconds.', 
    icon: Wifi,        
    color: '#00C16A',
    viz: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="w-64 h-64 rounded-full border border-primary/20" 
        />
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Wifi size={32} className="text-primary" />
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ scaleY: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-4 bg-primary/40 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    )
  },
  { 
    num: '02', 
    title: 'Prioritize', 
    desc: 'AI ranks nodes by urgency, hygiene impact and overflow probability.',                    
    icon: Brain,       
    color: '#39B8FD',
    viz: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-secondary/5 rounded-full blur-3xl" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                scale: [1, 1.1, 1],
                backgroundColor: i % 2 === 0 ? ['rgba(57,184,253,0.1)', 'rgba(57,184,253,0.3)', 'rgba(57,184,253,0.1)'] : 'rgba(57,184,253,0.05)'
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="w-12 h-12 rounded-lg flex items-center justify-center border border-secondary/10"
            >
              <Zap size={16} className={i % 2 === 0 ? "text-secondary" : "text-secondary/20"} />
            </motion.div>
          ))}
        </div>
      </div>
    )
  },
  { 
    num: '03', 
    title: 'Optimize',   
    desc: 'Algorithms minimize fuel by recalculating paths with live traffic data.',                
    icon: Route,       
    color: '#FF8842',
    viz: (
      <div className="w-full flex justify-center">
        <div className="scale-90 md:scale-100 origin-center bg-white/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 shadow-2xl">
          <LiveActivityShowcase />
        </div>
      </div>
    )
  },
  { 
    num: '04', 
    title: 'Act',        
    desc: 'Closed-loop verification ensures zero missed pickups with GPS evidence.',                
    icon: ShieldCheck, 
    color: '#00C16A',
    viz: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-success/5 rounded-full blur-3xl" />
        <motion.div 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
            <Truck size={36} className="text-success" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4 border-success/30"
          />
        </motion.div>
      </div>
    )
  },
];

/* ─── Scroll-linked number counter ───────────────────────── */

function ScrollCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setVal(Math.round(eased * target * 10) / 10);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 48px)', letterSpacing: '-0.05em', background: 'linear-gradient(135deg, #00C16A, #39B8FD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div className="text-[10px] font-bold uppercase mt-1.5 opacity-60 tracking-[0.15em]">{label}</div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  /* refs for sticky scroll-linked sections */
  const statsRef = useRef<HTMLElement>(null);
  const hScrollRef = useRef<HTMLElement>(null);
  const lifecycleRef = useRef<HTMLElement>(null);

  /* scroll values for horizontal scroll section */
  const { scrollYProgress: hScrollProgress } = useScroll({ target: hScrollRef, offset: ['start start', 'end end'] });
  const hX = useTransform(hScrollProgress, [0, 1], ['0%', '-70%']); // Adjusted for tighter scrolling

  /* scroll values for lifecycle reveal */
  const { scrollYProgress: lcProgress } = useScroll({ target: lifecycleRef, offset: ['start start', 'end end'] });
  const activeStep = useTransform(lcProgress, [0, 0.2, 0.4, 0.6, 0.8], [0, 1, 2, 3, 3]);
  const [currentStep, setCurrentStep] = useState(0);
  useMotionValueEvent(activeStep, 'change', (v) => setCurrentStep(Math.round(v)));

  // Dynamic theme transforms for Lifecycle
  const lcBg = useTransform(lcProgress, [0.2, 0.5], ['#0d1117', '#ffffff']);
  const lcHeading = useTransform(lcProgress, [0.2, 0.5], ['#ffffff', '#171C1F']);
  const lcSub = useTransform(lcProgress, [0.2, 0.5], ['rgba(255,255,255,0.6)', '#3F4948']);
  const lcDotBorder = useTransform(lcProgress, [0.2, 0.5], ['rgba(255,255,255,0.05)', 'rgba(0,0,0,0.08)']);
  const lcHint = useTransform(lcProgress, [0.2, 0.5], ['rgba(255,255,255,0.2)', 'rgba(0,0,0,0.3)']);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return (<div><Navbar /></div>);

  return (
    <div>
      {/* ── Progress bar ──────────────────────────────────── */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left" style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #00C16A, #39B8FD, #FF8842, #00C16A)', boxShadow: '0 0 14px rgba(0,193,106,0.5)' }} />
      <Navbar />

      <main>
        {/* ════════════════════════════════════════════════════
            §1  HERO — Cinematic, full-immersion, world-class
           ════════════════════════════════════════════════════ */}
        <section
          className="min-h-screen flex items-center relative overflow-hidden"
          style={{ position: 'sticky', top: 0, zIndex: 1 }}
        >
          {/* Multi-layer gradient mesh */}
          <div
            className="absolute inset-0 animate-gradient-mesh"
            style={{
              background: 'linear-gradient(135deg, rgba(0,193,106,0.06) 0%, rgba(57,184,253,0.04) 25%, rgba(255,136,66,0.03) 50%, rgba(0,109,57,0.04) 75%, rgba(57,184,253,0.06) 100%)',
              backgroundSize: '400% 400%',
            }}
          />

          {/* Spotlight glow orbs — layered depth */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full opacity-20"
            animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ background: 'radial-gradient(circle, rgba(0,193,106,0.25), transparent 70%)', top: '-10%', left: '10%', filter: 'blur(80px)' }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full opacity-15"
            animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{ background: 'radial-gradient(circle, rgba(57,184,253,0.3), transparent 70%)', bottom: '-5%', right: '5%', filter: 'blur(60px)' }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10"
            animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{ background: 'radial-gradient(circle, rgba(255,136,66,0.3), transparent 70%)', top: '40%', right: '30%', filter: 'blur(50px)' }}
            aria-hidden="true"
          />

          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, var(--primary) 0.8px, transparent 0.8px)', backgroundSize: '40px 40px' }} aria-hidden="true" />

          {/* Orbiting rings — multiple layers */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] animate-orbit-slow pointer-events-none opacity-[0.04]" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: 'var(--primary)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: 'var(--primary-container)' }} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-[0.03]" style={{ animation: 'orbit-slow 30s linear infinite reverse' }} aria-hidden="true">
            <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: 'var(--secondary)' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: 'var(--secondary-container)' }} />
          </div>

          <ParticleField />

          <div className="max-w-[1300px] mx-auto px-6 md:px-10 w-full relative z-10 pt-24 pb-16">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* LEFT – headline */}
              <motion.div
                className="flex-1 text-center lg:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Badge */}
                <motion.span
                  initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                  style={{
                    background: 'rgba(0,193,106,0.06)',
                    border: '1px solid rgba(0,193,106,0.1)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    letterSpacing: '0.1em',
                  }}
                >
                  <span className="relative w-1.5 h-1.5">
                    <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'var(--primary-container)', opacity: 0.6 }} />
                    <span className="absolute inset-0 rounded-full" style={{ background: 'var(--primary-container)' }} />
                  </span>
                  MIRA-BHAYANDAR — POWERED BY AI
                </motion.span>

                {/* Headline — Staggered word reveal */}
                <div className="mb-5" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 68px)', letterSpacing: '-0.06em', lineHeight: 0.9 }}>
                  {['Smart', 'Waste.'].map((word, i) => (
                    <motion.span
                      key={word}
                      className="inline-block mr-3"
                      initial={{ opacity: 0, y: 40, rotateX: -30 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br />
                  {['Smarter', 'City.'].map((word, i) => (
                    <motion.span
                      key={word}
                      className="inline-block mr-3 animate-text-shimmer"
                      initial={{ opacity: 0, y: 40, rotateX: -30 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: 'linear-gradient(135deg, var(--primary-container), var(--secondary-container), var(--primary-container))',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>

                {/* Sub */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.8 }}
                  className="mb-8"
                  style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--on-surface-variant)', maxWidth: '480px' }}
                >
                  Next-gen municipal infrastructure merging{' '}
                  <strong style={{ color: 'var(--primary)' }}>AI prediction</strong>{' '}
                  &amp; route intelligence across 24 zones.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.7 }}
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                >
                  <a
                    href="#sensors"
                    className="group flex items-center gap-3 px-6 py-3.5 rounded-xl no-underline text-xs font-bold transition-all duration-300"
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      boxShadow: '0 6px 24px rgba(0,109,57,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,109,57,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,109,57,0.2)'; }}
                  >
                    <Map size={16} /> Explore City Map
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="#analytics"
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl no-underline text-xs font-semibold transition-all duration-300"
                    style={{
                      color: 'var(--on-surface)',
                      background: 'rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    View Metrics
                  </a>
                </motion.div>

                {/* Mini stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
                >
                  {[
                    { v: 94.2, s: '%', l: 'Collection Rate', d: 1 },
                    { v: 12480, s: 'kg', l: 'Daily Capacity', d: 0 },
                    { v: 1242, s: '', l: 'Active Sensors', d: 0 },
                    { v: 24, s: '', l: 'Zones Active', d: 0 },
                  ].map((st) => (
                    <div key={st.l}>
                      <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                        <CountUp end={st.v} suffix={st.s} decimals={st.d} />
                      </div>
                      <div className="text-[9px] uppercase font-semibold mt-0.5" style={{ color: 'var(--outline)', letterSpacing: '0.1em' }}>{st.l}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* RIGHT – Floating dashboard preview with 3D perspective */}
              <motion.div
                className="flex-1 max-w-lg w-full perspective-1000"
                initial={{ opacity: 0, x: 100, rotateY: -8 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="animate-float relative"
                  whileHover={{ rotateY: 4, rotateX: -2, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <div
                    className="p-6 rounded-[2rem] relative overflow-hidden"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.7)', 
                      backdropFilter: 'blur(30px) saturate(160%)', 
                      boxShadow: '0 40px 80px -20px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.4)',
                    }}
                  >
                    {/* Multi-color glow accents */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full" style={{ background: 'rgba(0,193,106,0.15)', filter: 'blur(60px)' }} aria-hidden="true" />
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full" style={{ background: 'rgba(57,184,253,0.1)', filter: 'blur(40px)' }} aria-hidden="true" />
                    
                    <LiveActivityShowcase />
                  </div>

                  {/* Floating accent card — bottom-right */}
                  <motion.div
                    className="absolute -bottom-4 -right-4 px-4 py-3 rounded-xl flex items-center gap-3 z-20"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,193,106,0.08)',
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,193,106,0.1)' }}>
                      <Signal size={14} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <div className="text-[8px] font-bold uppercase opacity-60 tracking-wider">System Latency</div>
                      <div className="text-base font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', lineHeight: 1 }}>14ms</div>
                    </div>
                  </motion.div>

                  {/* Floating accent card — top-left */}
                  <motion.div
                    className="absolute -top-4 -left-4 px-4 py-2.5 rounded-xl flex items-center gap-2 z-20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    style={{
                      background: 'rgba(0,193,106,0.95)',
                      color: 'white',
                      boxShadow: '0 12px 32px rgba(0,109,57,0.3)',
                    }}
                  >
                    <CheckCircle size={14} />
                    <span className="text-[10px] font-black uppercase" style={{ letterSpacing: '0.08em' }}>All Systems Nominal</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="flex flex-col items-center gap-2 mt-16"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}>Scroll to explore</span>
              <div className="w-5 h-8 rounded-full border-2 flex justify-center pt-1.5" style={{ borderColor: 'var(--outline-variant)' }}>
                <motion.div
                  className="w-1 h-2 rounded-full"
                  style={{ background: 'var(--primary-container)' }}
                  animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            §2  SCROLL-LINKED STATS — sticky dark section
                Tall container, numbers animate on scroll
           ════════════════════════════════════════════════════ */}
        <section ref={statsRef} className="relative" style={{ zIndex: 2, height: '120vh' }}>
          <div
            className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #0d1117, #161b22)' }}
          >
            {/* Gradient orbs */}
            <div className="absolute w-[500px] h-[500px] rounded-full opacity-30 -top-32 -left-32" style={{ background: 'radial-gradient(circle, rgba(0,193,106,0.3), transparent 70%)', filter: 'blur(80px)' }} aria-hidden="true" />
            <div className="absolute w-[400px] h-[400px] rounded-full opacity-20 -bottom-24 -right-24" style={{ background: 'radial-gradient(circle, rgba(57,184,253,0.3), transparent 70%)', filter: 'blur(60px)' }} aria-hidden="true" />

            <div className="max-w-[1100px] mx-auto px-6 md:px-10 w-full">
              <FadeUp>
                <div className="text-center mb-8">
                  <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase mb-4" style={{ background: 'rgba(0,193,106,0.12)', color: '#00C16A', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>
                    Impact Dashboard
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 40px)', color: 'white', letterSpacing: '-0.04em' }}>
                    Numbers that move cities
                  </h2>
                </div>
              </FadeUp>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <ScrollCounter target={94.2} suffix="%" label="Collection Rate" />
                <ScrollCounter target={12480} label="kg Carbon Offset" />
                <ScrollCounter target={1242} label="Active Sensors" />
                <ScrollCounter target={14} suffix="ms" label="System Latency" />
              </div>

              {/* Sub detail */}
              <div className="flex justify-center gap-8 mt-6 flex-wrap">
                {['Real-time telemetry', 'Edge computing', '24 active zones', 'Zero downtime'].map((t) => (
                  <span key={t} className="flex items-center gap-2 text-[10px] uppercase font-bold" style={{ letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: '#00C16A' }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            §3  HORIZONTAL SCROLL — sticky + translateX modules
           ════════════════════════════════════════════════════ */}
        <section
          ref={hScrollRef}
          id="platform"
          className="relative"
          style={{ zIndex: 3, height: '180vh' }}
        >
          <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden" style={{ background: 'var(--surface)' }}>
            <div className="px-6 md:px-10 max-w-[1400px] mx-auto w-full mb-4">
              <SlideIn from="left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,193,106,0.1)' }}>
                    <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--outline)', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>Core Platform</span>
                </div>
                <h2 className="headline-lg mb-1">Precision Modules</h2>
                <p className="body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '450px' }}>Scroll to explore the deep-tech stack powering every collection.</p>
              </SlideIn>
            </div>

            {/* Scrolling card track */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6 pl-6 md:pl-10"
                style={{ x: hX, width: 'max-content' }}
              >
                {modules.map((mod, i) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.title}
                      className="w-[280px] md:w-[360px] flex-shrink-0 p-6 md:p-7 rounded-2xl group transition-all duration-300 hover:-translate-y-1.5"
                      style={{ background: mod.bg, boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.02)' }}
                      onMouseEnter={(e) => { (e.currentTarget.style.boxShadow = 'var(--shadow-md)'); }}
                      onMouseLeave={(e) => { (e.currentTarget.style.boxShadow = 'var(--shadow-sm)'); }}
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: `${mod.color}14` }}>
                          <Icon size={20} style={{ color: mod.color }} />
                        </div>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-bold uppercase" style={{ background: `${mod.color}10`, color: mod.color }}>
                          <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: mod.color }} /> Active
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-bold mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>{mod.title}</h3>
                      <p className="text-[11px] md:text-xs leading-relaxed opacity-70" style={{ color: 'var(--on-surface-variant)' }}>{mod.desc}</p>
                      <div className="mt-5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: mod.color }}>
                        Learn more <ArrowRight size={10} />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            §4  LIVING GRID — Map + stats, alternating slides
           ════════════════════════════════════════════════════ */}
        <section id="sensors" className="section-padding relative" style={{ zIndex: 4, background: 'var(--surface-lowest)' }}>
          <div className="max-container">
            <SlideIn from="left">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,193,106,0.1)' }}>
                    <Globe size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--outline)', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>Geospatial Intelligence</span>
                </div>
                <h2 className="headline-lg mb-2">The Living Grid</h2>
                <p className="body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '500px' }}>Real-time intelligence across 24 zones with sub-second telemetry.</p>
              </div>
            </SlideIn>

            <div className="flex flex-col lg:flex-row gap-8">
              <SlideIn from="left" className="lg:w-2/3">
                <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', background: 'var(--surface-low)', boxShadow: 'var(--shadow-lg)' }}>
                  <LiveMap />
                </div>
              </SlideIn>

              <div className="lg:w-1/3 flex flex-col gap-4">
                <SlideIn from="right">
                  <div className="card card-interactive p-5" style={{ borderLeft: '3px solid var(--primary-container)' }}>
                    <div className="text-[9px] font-bold uppercase mb-2 opacity-60 tracking-wider">Zone Efficiency</div>
                    <div className="flex items-end justify-between mb-3">
                      <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}><CountUp end={94.2} decimals={1} suffix="%" /></div>
                      <span className="chip chip-success text-[9px] px-2 py-0.5">+2.1%</span>
                    </div>
                    <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-high)' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '94.2%' }} viewport={{ once: true }} transition={{ duration: 1.5 }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-container))' }} />
                    </div>
                  </div>
                </SlideIn>

                <SlideIn from="right" delay={0.1}>
                  <div className="card card-interactive p-5" style={{ borderLeft: '3px solid var(--secondary-container)' }}>
                    <div className="text-[9px] font-bold uppercase mb-2 opacity-60 tracking-wider">Carbon Offset</div>
                    <div className="flex items-end justify-between mb-3">
                      <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)' }}><CountUp end={12480} suffix="kg" /></div>
                      <span className="chip chip-info text-[9px] px-2 py-0.5">Live</span>
                    </div>
                    <div className="flex gap-0.5 h-4 items-end">
                      {[40, 60, 55, 80, 75, 90, 100].map((h, j) => (
                        <motion.div key={j} className="flex-1 rounded-sm" initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: j * 0.05 }} style={{ background: `rgba(57,184,253,${0.3 + j * 0.1})` }} />
                      ))}
                    </div>
                  </div>
                </SlideIn>

                <SlideIn from="right" delay={0.2}>
                  <div className="card card-interactive p-5" style={{ borderLeft: '3px solid var(--tertiary-container)' }}>
                    <div className="text-[9px] font-bold uppercase mb-2 opacity-60 tracking-wider">System Uptime</div>
                    <div className="flex items-end justify-between mb-1">
                      <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--tertiary)' }}>99.97<span className="text-base">%</span></div>
                      <Activity size={14} style={{ color: 'var(--tertiary)' }} />
                    </div>
                    <p className="text-[9px] opacity-60">30-day rolling average</p>
                  </div>
                </SlideIn>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            §5  LIFECYCLE — sticky scroll-through timeline
           ════════════════════════════════════════════════════ */}
        <section
          ref={lifecycleRef}
          id="solutions"
          className="relative"
          style={{ zIndex: 5, height: '280vh' }}
        >
          <motion.div
            className="sticky top-0 h-screen flex items-center overflow-hidden"
            style={{ background: lcBg }}
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full overflow-y-auto max-h-screen py-10 md:py-0">
              <div className="text-center mb-8 md:mb-16">
                <motion.span 
                  style={{ color: '#00C16A', background: 'rgba(0,193,106,0.1)' }}
                  className="inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase mb-2 tracking-[0.2em]"
                >
                  How it works
                </motion.span>
                <motion.h2 
                  style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontWeight: 800, 
                    fontSize: 'clamp(24px, 4vw, 42px)', 
                    color: lcHeading, 
                    letterSpacing: '-0.02em' 
                  }}
                >
                  The WasteIQ Lifecycle
                </motion.h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1.4fr] gap-6 md:gap-20 items-center">
                {/* Left: step indicator dots */}
                <div className="hidden lg:flex flex-col items-center gap-0">
                  {steps.map((step, i) => {
                    const isActive = currentStep >= i;
                    return (
                      <div key={step.num} className="flex flex-col items-center">
                        <motion.div
                          animate={{
                            scale: currentStep === i ? 1.2 : 1,
                            background: isActive ? step.color : 'transparent',
                          }}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black"
                          style={{ 
                            color: isActive ? 'white' : 'rgba(128,128,128,0.4)', 
                            border: `2px solid ${isActive ? step.color : 'rgba(128,128,128,0.2)'}`,
                            transition: 'border-color 0.5s' 
                          }}
                        >
                          {step.num}
                        </motion.div>
                        {i < steps.length - 1 && (
                          <motion.div
                            className="w-[2px] h-10"
                            animate={{ background: currentStep > i ? 'rgba(0,193,106,0.4)' : 'rgba(128,128,128,0.1)' }}
                            transition={{ duration: 0.5 }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Middle: text content */}
                <div className="relative" style={{ minHeight: 'auto' }}>
                  <AnimatePresence mode="wait">
                    {steps.map((step, i) => (
                      currentStep === i && (
                        <motion.div
                          key={step.num}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.5, ease: 'circOut' }}
                          className="flex flex-col justify-center"
                        >
                          <div className="flex items-center gap-4 mb-4 md:mb-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-inner" style={{ background: `${step.color}15` }}>
                              <step.icon size={24} />
                            </div>
                            <div>
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: step.color }}>Step {step.num}</span>
                              <motion.h3 
                                style={{ fontFamily: 'var(--font-display)', color: lcHeading }}
                                className="text-2xl md:text-3xl font-black tracking-tight"
                              >
                                {step.title}
                              </motion.h3>
                            </div>
                          </div>
                          <motion.p 
                            style={{ color: lcSub }}
                            className="text-sm md:text-base leading-relaxed max-w-md font-medium"
                          >
                            {step.desc}
                          </motion.p>
                          
                          <div className="mt-6 md:mt-8 flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {[1,2,3].map(j => (
                                <div key={j} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-surface-high flex items-center justify-center text-[8px] md:text-[10px] font-bold">
                                  {j}
                                </div>
                              ))}
                            </div>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase opacity-40 tracking-wider">Automated Processing</span>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>

                {/* Right: Visualization Slot */}
                <div className="relative h-[240px] md:h-[400px] w-full">
                  <AnimatePresence mode="wait">
                    {steps.map((step, i) => (
                      currentStep === i && (
                        <motion.div
                          key={`viz-${step.num}`}
                          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          {(step as any).viz}
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Scroll hint */}
              <div className="text-center mt-20">
                <motion.span 
                  style={{ color: lcHint }}
                  className="text-[10px] uppercase font-black tracking-[0.3em] font-mono"
                >
                  Keep scrolling to advance steps
                </motion.span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════
            §6  ANALYTICS — KPI rings + recycled banner
           ════════════════════════════════════════════════════ */}
        <section id="analytics" className="section-padding" style={{ zIndex: 6, background: 'var(--surface-low)', position: 'relative' }}>
          <div className="max-container">
            <FadeUp>
              <div className="text-center mb-14">
                <h2 className="headline-lg mb-3">Impact Analytics</h2>
                <p className="body-md mx-auto" style={{ color: 'var(--on-surface-variant)', maxWidth: '500px' }}>Quantifying progress toward a zero-waste city.</p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SlideIn from="left">
                <div className="card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300" style={{ borderTop: '2px solid var(--primary-container)' }}>
                  <div className="relative w-24 h-24 mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--surface-high)" strokeWidth="6" />
                      <motion.circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--primary-container)" strokeWidth="6" strokeDasharray="263.8" initial={{ strokeDashoffset: 263.8 }} whileInView={{ strokeDashoffset: 65.9 }} viewport={{ once: true }} transition={{ duration: 1.5 }} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}><CountUp end={75} suffix="%" /></div>
                  </div>
                  <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Diversion Rate</span>
                </div>
              </SlideIn>

              <FadeUp delay={0.1}>
                <div className="card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300" style={{ borderTop: '2px solid var(--secondary)' }}>
                  <div className="relative w-24 h-24 mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--surface-high)" strokeWidth="6" />
                      <motion.circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--secondary)" strokeWidth="6" strokeDasharray="263.8" initial={{ strokeDashoffset: 263.8 }} whileInView={{ strokeDashoffset: 26.4 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.2 }} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}><CountUp end={90} suffix="%" /></div>
                  </div>
                  <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Fleet Uptime</span>
                </div>
              </FadeUp>

              <SlideIn from="right">
                <div className="card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300" style={{ borderTop: '2px solid var(--tertiary)' }}>
                  <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full opacity-5 animate-pulse" style={{ background: 'var(--tertiary)' }} />
                    <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--tertiary)' }}><CountUp end={14} suffix="ms" /></div>
                  </div>
                  <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider">System Latency</span>
                </div>
              </SlideIn>
            </div>

            {/* Big recycled total */}
            <FadeUp delay={0.2}>
              <div className="card p-8 relative overflow-hidden" style={{ background: 'linear-gradient(120deg, rgba(0,193,106,0.03), rgba(57,184,253,0.03), var(--surface-lowest))' }}>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end">
                  <div>
                    <div className="text-[9px] font-bold uppercase mb-1 opacity-50 tracking-[0.2em]">Recycled Total YTD</div>
                    <div className="text-4xl md:text-5xl font-black mb-3 tracking-tighter" style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      <CountUp end={452.8} decimals={1} /> Tons
                    </div>
                    <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ color: 'white', background: 'var(--primary)' }}>↑ 14% Growth</span>
                  </div>
                  <p className="text-[10px] max-w-[180px] md:text-right mt-6 md:mt-0 opacity-50 font-medium leading-relaxed">Scaling down carbon emissions through optimal multi-stage separation.</p>
                </div>
                <div className="h-16 w-full mt-6 flex items-end gap-1 opacity-60">
                  {[30, 45, 50, 75, 66, 80, 100, 95, 110, 125, 120, 140].map((h, i) => (
                    <motion.div key={i} className="flex-1 rounded-t-sm" initial={{ height: 0 }} whileInView={{ height: `${(h / 140) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.04 }} style={{ background: `linear-gradient(to top, rgba(0,109,57,${0.1 + i * 0.04}), rgba(0,193,106,${0.2 + i * 0.04}))` }} />
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            §7  REPORT A LOCAL ISSUE
           ════════════════════════════════════════════════════ */}
        <section className="section-padding relative" style={{ zIndex: 7, background: 'var(--surface-lowest)' }}>
          <div className="max-container">
            <SlideIn from="left">
              <div className="card p-6 md:p-14 mx-auto relative overflow-hidden" style={{ maxWidth: '760px', borderRadius: 'var(--radius-xl)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.06)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32" style={{ background: 'rgba(0,193,106,0.04)', filter: 'blur(100px)' }} aria-hidden="true" />
                <div className="text-center mb-8 relative z-10">
                  <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase mb-5" style={{ background: 'rgba(0,109,57,0.06)', color: 'var(--primary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>Citizen Action</span>
                  <h2 className="headline-lg mb-3">Report a Local Issue</h2>
                  <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>AI-verified reports get prioritized for immediate dispatch.</p>
                </div>

                <form className="flex flex-col gap-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[9px] font-bold uppercase mb-1.5" style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}>Municipal Address</label>
                      <input type="text" className="input-field" placeholder="e.g., Ward 14, Station Road" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase mb-1.5" style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}>Reported Category</label>
                      <select className="input-field" style={{ cursor: 'pointer' }}>
                        <option>Overflowing Public Bin</option>
                        <option>Missed Residential Collection</option>
                        <option>Illegal Commercial Dumping</option>
                        <option>Unsanitary Public Area</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase mb-1.5" style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}>Context &amp; Details</label>
                    <textarea className="input-field" style={{ height: 'auto', minHeight: '90px' }} rows={3} placeholder="Describe the severity and precise location..." />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase mb-1.5" style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}>Visual Evidence</label>
                    <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-xl cursor-pointer transition-all" style={{ border: '2px dashed var(--outline-variant)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(0,193,106,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.background = 'transparent'; }}>
                      <Camera size={32} className="mb-2" style={{ color: 'var(--outline-variant)' }} />
                      <p className="title-sm text-center" style={{ color: 'var(--on-surface-variant)' }}>Snap or drag photographic evidence</p>
                      <p className="body-sm mt-1" style={{ color: 'var(--outline)' }}>Max 10MB (JPG, PNG)</p>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full text-sm py-3"><MapPin size={16} /> Submit Verified Report</button>
                </form>
              </div>
            </SlideIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
