/**
 * WasteIQ — Public Landing Page
 * THE most important page. Creates an immediate, visceral impression.
 * Implements all sections from the master spec §6.1.
 */
'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  Map,
  Truck,
  Bell,
  Route,
  ShieldCheck,
  Wifi,
  BarChart3,
  Camera,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ScrollReveal from '@/components/effects/ScrollReveal';
import CountUp from '@/components/effects/CountUp';

// Lazy-load cursor trail (desktop only, no SSR)
const CursorTrail = dynamic(() => import('@/components/effects/CursorTrail'), {
  ssr: false,
});

// ── Animation Variants ──────────────────────────────────────

const stagger = {
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// ── Feature Modules Data ────────────────────────────────────

const modules = [
  {
    icon: Brain,
    title: 'AI Priority Engine',
    desc: 'Neural network prediction models that anticipate bin overflows up to 6 hours in advance using atmospheric and demographic data.',
    span: 'lg:col-span-2',
    color: 'var(--primary)',
    bgColor: 'rgba(0, 109, 57, 0.08)',
  },
  {
    icon: Route,
    title: 'Route Optimizer',
    desc: 'Dynamic routing system that recalculates truck paths based on real-time traffic and bin urgency levels.',
    span: '',
    color: 'var(--secondary)',
    bgColor: 'rgba(0, 101, 145, 0.08)',
  },
  {
    icon: Map,
    title: 'Live City Map',
    desc: 'Full transparency for ward officers with granular daily reports and ROI dashboards.',
    span: '',
    color: 'var(--primary)',
    bgColor: 'rgba(0, 109, 57, 0.08)',
  },
  {
    icon: Bell,
    title: 'Citizen Alerts',
    desc: 'Automated omni-channel updates when collections are delayed or community cleanup is scheduled.',
    span: '',
    color: 'var(--tertiary)',
    bgColor: 'rgba(157, 67, 0, 0.08)',
  },
  {
    icon: ShieldCheck,
    title: 'Proof of Service',
    desc: 'GPS-verified timestamps and mandatory visual logs for every collection event.',
    span: '',
    color: 'var(--secondary)',
    bgColor: 'rgba(0, 101, 145, 0.08)',
  },
  {
    icon: Truck,
    title: 'Driver PWA',
    desc: 'Offline-first progressive web app for drivers with QR scanning and real-time route updates.',
    span: '',
    color: 'var(--primary)',
    bgColor: 'rgba(0, 109, 57, 0.08)',
  },
];

// ── Lifecycle Steps ─────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Sense',
    desc: 'Hyperspectral IoT sensors detect bin density and composition in real-time, transmitting telemetry every 15 seconds.',
    badge: 'Live',
    badgeColor: '#00C16A',
  },
  {
    num: '02',
    title: 'Prioritize',
    desc: 'The AI Engine ranks collection nodes by urgency, hygiene impact, and predictive overflow probability.',
    badge: 'Active',
    badgeColor: '#39B8FD',
  },
  {
    num: '03',
    title: 'Optimize',
    desc: 'Proprietary routing algorithms minimize fuel consumption by recalculating paths based on real-time traffic.',
    badge: 'Dynamic',
    badgeColor: '#FF8842',
  },
  {
    num: '04',
    title: 'Act',
    desc: 'Closed-loop verification ensures zero missed pickups with GPS-stamped photo evidence and instant confirmation.',
    badge: 'Verified',
    badgeColor: '#00C16A',
  },
];

export default function LandingPage() {
  return (
    <>
      <CursorTrail />
      <Navbar />

      <main>
        {/* ── HERO SECTION ──────────────────────────────── */}
        <section
          className="min-h-screen flex items-center relative overflow-hidden pt-20"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,193,106,0.06), transparent 70%),
              radial-gradient(at 0% 0%, rgba(0,109,57,0.08) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(57,184,253,0.08) 0px, transparent 50%),
              var(--surface)
            `,
          }}
        >
          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle, var(--primary) 0.5px, transparent 0.5px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />

          <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Content */}
              <motion.div
                className="flex-1 text-center lg:text-left"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                {/* Badge */}
                <motion.div variants={fadeUp}>
                  <span
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
                    style={{
                      background: 'var(--success-container)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--primary)',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: 'var(--primary-container)' }}
                    />
                    ↑ MIRA-BHAYANDAR
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={fadeUp} className="display-lg mb-6">
                  Smart Waste.
                  <br />
                  <span style={{ color: 'var(--primary-container)' }}>
                    Smarter City.
                  </span>
                </motion.h1>

                {/* Sub-text */}
                <motion.p
                  variants={fadeUp}
                  className="body-lg mb-10"
                  style={{
                    color: 'var(--on-surface-variant)',
                    maxWidth: '520px',
                    margin: '0 auto',
                  }}
                >
                  Mira-Bhayandar&apos;s next-generation municipal
                  infrastructure. Leveraging AI and real-time IoT sensors to
                  optimize urban sanitation and logistics.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                >
                  <a href="#sensors" className="btn-primary gap-2 w-full sm:w-auto no-underline">
                    <Map size={18} />
                    Explore City Map
                  </a>
                  <a href="#analytics" className="btn-ghost w-full sm:w-auto no-underline">
                    View Metrics
                  </a>
                </motion.div>

                {/* Hero Stats Bar */}
                <motion.div
                  variants={fadeUp}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
                >
                  {[
                    { value: 94.2, suffix: '%', label: 'Collection Rate', decimals: 1 },
                    { value: 12480, suffix: 'kg', label: 'Daily Capacity', decimals: 0 },
                    { value: 1242, suffix: '', label: 'Active Sensors', decimals: 0 },
                    { value: 24, suffix: '', label: 'Operational Zones', decimals: 0 },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div
                        className="text-2xl font-bold mb-1"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--on-surface)' }}
                      >
                        <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--on-surface-variant)',
                          fontWeight: 500,
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right — Live Status Card */}
              <motion.div
                className="flex-1 relative hidden lg:block"
                variants={slideInRight}
                initial="hidden"
                animate="show"
              >
                <div className="animate-float">
                  <div
                    className="glass-card p-6"
                    style={{ borderRadius: 'var(--radius-xl)' }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className="text-xs font-bold uppercase"
                        style={{
                          letterSpacing: '0.15em',
                          color: 'var(--outline)',
                        }}
                      >
                        Live Stream
                      </span>
                      <span
                        className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase"
                        style={{
                          background: 'var(--error-container)',
                          color: 'var(--error)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        Live
                      </span>
                    </div>

                    {/* Status Items */}
                    <div className="flex flex-col gap-3">
                      {/* Overflow Predicted */}
                      <div
                        className="flex items-center gap-4 p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.5)' }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: 'var(--primary-container)' }}
                        >
                          <Wifi size={18} color="white" />
                        </div>
                        <div className="flex-1">
                          <div
                            className="text-xs font-bold"
                            style={{ color: 'var(--outline)' }}
                          >
                            Bin #0482 — Kashimira
                          </div>
                          <div className="title-sm">Overflow Predicted (82%)</div>
                        </div>
                        <span
                          className="mono-sm"
                          style={{ color: 'var(--primary)' }}
                        >
                          Priority: High
                        </span>
                      </div>

                      {/* Route Optimized */}
                      <div
                        className="flex items-center gap-4 p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.5)' }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: 'var(--secondary-container)' }}
                        >
                          <Truck size={18} color="white" />
                        </div>
                        <div className="flex-1">
                          <div
                            className="text-xs font-bold"
                            style={{ color: 'var(--outline)' }}
                          >
                            Truck #12 — Bhayandar East
                          </div>
                          <div className="title-sm">Route Optimized</div>
                        </div>
                        <span
                          className="mono-sm"
                          style={{ color: 'var(--secondary)' }}
                        >
                          ETA: 4m
                        </span>
                      </div>
                    </div>

                    {/* System Load */}
                    <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--outline-variant)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className="text-xs font-bold uppercase"
                          style={{ letterSpacing: '0.1em', color: 'var(--outline)' }}
                        >
                          System Load
                        </span>
                        <span className="mono-sm" style={{ color: 'var(--primary)' }}>
                          Stable 14ms
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: 'var(--surface-high)' }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '45%' }}
                          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
                          className="h-full rounded-full"
                          style={{
                            background: 'var(--primary-container)',
                            boxShadow: '0 0 10px rgba(0, 193, 106, 0.4)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative blobs */}
                <div
                  className="absolute -top-12 -right-12 w-64 h-64 rounded-full"
                  style={{ background: 'rgba(57, 184, 253, 0.12)', filter: 'blur(80px)' }}
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full"
                  style={{ background: 'rgba(0, 109, 57, 0.12)', filter: 'blur(60px)' }}
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── THE LIVING GRID ───────────────────────────── */}
        <section
          id="sensors"
          className="section-padding"
          style={{ background: 'var(--surface-lowest)' }}
        >
          <div className="max-container">
            <ScrollReveal>
              <div className="mb-10">
                <h2 className="headline-lg mb-2">The Living Grid</h2>
                <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
                  Real-time geospatial intelligence across 24 operational zones.
                </p>
              </div>
            </ScrollReveal>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Map Placeholder */}
              <ScrollReveal className="lg:w-2/3" delay={0.1}>
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    aspectRatio: '16/9',
                    background: 'var(--surface-low)',
                    boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Grid lines for map placeholder */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(var(--outline-variant) 1px, transparent 1px),
                        linear-gradient(90deg, var(--outline-variant) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px',
                    }}
                    aria-hidden="true"
                  />

                  {/* Pulsing bin markers */}
                  <div
                    className="absolute animate-pulse"
                    style={{ top: '40%', left: '30%', width: 16, height: 16, borderRadius: '50%', background: 'var(--primary-container)', boxShadow: '0 0 20px rgba(0,193,106,0.6)' }}
                  />
                  <div
                    className="absolute animate-pulse"
                    style={{ top: '60%', left: '70%', width: 16, height: 16, borderRadius: '50%', background: 'var(--primary-container)', boxShadow: '0 0 20px rgba(0,193,106,0.6)' }}
                  />
                  <div
                    className="absolute animate-pulse-ring"
                    style={{ top: '25%', left: '55%', width: 16, height: 16, borderRadius: '50%', background: 'var(--error)', boxShadow: '0 0 20px rgba(186,26,26,0.6)' }}
                  />

                  {/* Legend pills */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <div
                      className="glass flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold"
                      style={{ color: 'var(--on-surface-variant)' }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--primary-container)' }}
                      />
                      1,242 Online
                    </div>
                    <div
                      className="glass flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold"
                      style={{ color: 'var(--on-surface-variant)' }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--error)' }}
                      />
                      18 Urgent
                    </div>
                  </div>

                  {/* Center pill */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="glass px-4 py-2 rounded-full text-xs font-medium"
                      style={{ color: 'var(--on-surface-variant)' }}
                    >
                      🗺️ Interactive map loads with live data
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Stats Cards */}
              <div className="lg:w-1/3 flex flex-col gap-6">
                <ScrollReveal delay={0.2}>
                  <div className="card card-interactive p-8">
                    <div
                      className="text-xs font-bold uppercase mb-4"
                      style={{ letterSpacing: '0.15em', color: 'var(--outline)' }}
                    >
                      Zone Efficiency
                    </div>
                    <div className="flex items-end justify-between mb-4">
                      <div
                        className="text-4xl font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}
                      >
                        <CountUp end={94.2} decimals={1} suffix="%" />
                      </div>
                      <span className="chip chip-success text-xs">+2.1%</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden mb-4"
                      style={{ background: 'var(--surface-high)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: '94.2%',
                          background: 'var(--primary)',
                          boxShadow: '0 0 10px rgba(0,109,57,0.3)',
                        }}
                      />
                    </div>
                    <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      Overall collection efficiency across Mira Road (E) sector this week.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="card card-interactive p-8">
                    <div
                      className="text-xs font-bold uppercase mb-4"
                      style={{ letterSpacing: '0.15em', color: 'var(--outline)' }}
                    >
                      Carbon Offset
                    </div>
                    <div className="flex items-end justify-between mb-4">
                      <div
                        className="text-4xl font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)' }}
                      >
                        <CountUp end={12480} suffix="kg" />
                      </div>
                      <span className="chip chip-info text-xs">Live</span>
                    </div>
                    <div className="flex gap-1 h-8 items-end">
                      {[40, 60, 55, 80, 100].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${h}%`,
                            background: `rgba(57, 184, 253, ${0.3 + i * 0.15})`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── IMPACT ANALYTICS ──────────────────────────── */}
        <section
          id="analytics"
          className="section-padding"
          style={{ background: 'var(--surface-low)' }}
        >
          <div className="max-container">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="headline-lg mb-4">Impact Analytics</h2>
                <p
                  className="body-lg mx-auto"
                  style={{ color: 'var(--on-surface-variant)', maxWidth: '600px' }}
                >
                  Quantifying progress toward a zero-waste city model through
                  transparent data.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Circular Progress — Diversion Rate */}
              <ScrollReveal delay={0.1}>
                <div className="card flex flex-col items-center text-center p-8">
                  <div className="relative w-32 h-32 mb-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="40" fill="transparent"
                        stroke="var(--surface-high)" strokeWidth="10"
                      />
                      <circle
                        cx="50" cy="50" r="40" fill="transparent"
                        stroke="var(--primary-container)" strokeWidth="10"
                        strokeDasharray="251.2" strokeDashoffset="62.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div
                      className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <CountUp end={75} suffix="%" />
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold uppercase"
                    style={{ letterSpacing: '0.1em', color: 'var(--outline)' }}
                  >
                    Diversion Rate
                  </span>
                </div>
              </ScrollReveal>

              {/* Circular Progress — Fleet Uptime */}
              <ScrollReveal delay={0.2}>
                <div className="card flex flex-col items-center text-center p-8">
                  <div className="relative w-32 h-32 mb-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="40" fill="transparent"
                        stroke="var(--surface-high)" strokeWidth="10"
                      />
                      <circle
                        cx="50" cy="50" r="40" fill="transparent"
                        stroke="var(--secondary-container)" strokeWidth="10"
                        strokeDasharray="251.2" strokeDashoffset="25.1"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div
                      className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <CountUp end={90} suffix="%" />
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold uppercase"
                    style={{ letterSpacing: '0.1em', color: 'var(--outline)' }}
                  >
                    Fleet Uptime
                  </span>
                </div>
              </ScrollReveal>

              {/* Large Stat — Recycled Total */}
              <ScrollReveal delay={0.3} className="lg:col-span-2">
                <div
                  className="card p-8 relative overflow-hidden h-full flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="text-xs font-bold uppercase mb-1"
                      style={{ letterSpacing: '0.15em', color: 'var(--outline)' }}
                    >
                      Recycled Total
                    </div>
                    <div
                      className="text-5xl font-bold mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <CountUp end={452.8} decimals={1} /> Tons
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: 'var(--primary)' }}
                    >
                      ↑ 14% since last quarter
                    </span>
                  </div>
                  <div className="h-24 w-full mt-4 flex items-end gap-1">
                    {[50, 75, 66, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-lg"
                        style={{
                          height: `${h}%`,
                          background: `rgba(0, 109, 57, ${0.15 + i * 0.15})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── PRECISION MODULES (Bento Grid) ─────────── */}
        <section id="platform" className="section-padding">
          <div className="max-container">
            <ScrollReveal>
              <div className="mb-16">
                <h2 className="headline-lg mb-4">Precision Modules</h2>
                <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
                  Deep-tech integration for high-density municipal demands.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <ScrollReveal key={mod.title} delay={i * 0.08} className={mod.span}>
                    <div
                      className="card card-interactive p-8 h-full group relative overflow-hidden"
                      style={{ borderLeft: '4px solid transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderLeftColor = mod.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderLeftColor = 'transparent';
                      }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ background: mod.bgColor }}
                        >
                          <Icon size={24} style={{ color: mod.color }} />
                        </div>
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase"
                          style={{
                            background: mod.bgColor,
                            color: mod.color,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ background: mod.color }}
                          />
                          Active
                        </div>
                      </div>
                      <h3
                        className="headline-sm mb-3"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {mod.title}
                      </h3>
                      <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
                        {mod.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── WASTEIQ LIFECYCLE ──────────────────────── */}
        <section
          id="solutions"
          className="section-padding relative overflow-hidden"
          style={{
            background: 'var(--surface-low)',
          }}
        >
          {/* Decorative gradients */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(0,193,106,0.08) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(57,184,253,0.08) 0%, transparent 40%)
              `,
            }}
            aria-hidden="true"
          />

          <div className="max-container relative z-10">
            <ScrollReveal>
              <div className="text-center mb-20">
                <h2 className="headline-lg mb-4">The WasteIQ Lifecycle</h2>
                <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
                  A fully automated feedback loop from sensing to resolution.
                </p>
              </div>
            </ScrollReveal>

            {/* Connecting line (desktop) */}
            <div
              className="absolute top-[200px] left-0 w-full px-32 hidden lg:block z-0"
              aria-hidden="true"
            >
              <div
                className="h-[2px] w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--primary-container), transparent)',
                  opacity: 0.3,
                  borderTop: '2px dashed var(--outline-variant)',
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {steps.map((step, i) => (
                <ScrollReveal key={step.num} delay={i * 0.1}>
                  <div className="flex flex-col items-center text-center group">
                    {/* Circle with icon */}
                    <div className="relative mb-8">
                      <div
                        className="absolute inset-0 rounded-full blur-2xl transition-all duration-500 group-hover:opacity-60"
                        style={{
                          background: `${step.badgeColor}20`,
                          opacity: 0.4,
                        }}
                        aria-hidden="true"
                      />
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center relative z-10 card-interactive"
                        style={{
                          background: 'var(--surface-lowest)',
                          boxShadow: 'var(--shadow-lg)',
                        }}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                          style={{
                            background: 'var(--primary)',
                            boxShadow: '0 4px 16px rgba(0,109,57,0.3)',
                          }}
                        >
                          <BarChart3 size={24} />
                        </div>
                        <span
                          className="absolute -top-1 -right-1 text-[8px] font-bold text-white px-2 py-0.5 rounded-full uppercase"
                          style={{ background: step.badgeColor }}
                        >
                          {step.badge}
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div
                      className="glass p-6 rounded-2xl"
                      style={{ border: 'none' }}
                    >
                      <h3
                        className="title-lg mb-3"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {step.num}. {step.title}
                      </h3>
                      <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── REPORT A LOCAL ISSUE ───────────────────── */}
        <section className="section-padding" style={{ background: 'var(--surface-lowest)' }}>
          <div className="max-container">
            <ScrollReveal>
              <div
                className="card p-12 md:p-16 mx-auto relative overflow-hidden"
                style={{
                  maxWidth: '800px',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: '0 40px 100px -20px rgba(0,0,0,0.08)',
                }}
              >
                {/* Decorative blob */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32"
                  style={{ background: 'rgba(0,193,106,0.06)', filter: 'blur(100px)' }}
                  aria-hidden="true"
                />

                <div className="text-center mb-10 relative z-10">
                  <span
                    className="inline-block px-5 py-2 rounded-full text-xs font-bold uppercase mb-6"
                    style={{
                      background: 'rgba(0,109,57,0.08)',
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    Citizen Action
                  </span>
                  <h2 className="headline-lg mb-4">Report a Local Issue</h2>
                  <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                    Direct dispatch for community concerns. AI-verified reports get prioritized.
                  </p>
                </div>

                <form className="flex flex-col gap-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-[10px] font-bold uppercase mb-2"
                        style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}
                      >
                        Municipal Address
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g., Ward 14, Station Road"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[10px] font-bold uppercase mb-2"
                        style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}
                      >
                        Reported Category
                      </label>
                      <select className="input-field" style={{ cursor: 'pointer' }}>
                        <option>Overflowing Public Bin</option>
                        <option>Missed Residential Collection</option>
                        <option>Illegal Commercial Dumping</option>
                        <option>Unsanitary Public Area</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[10px] font-bold uppercase mb-2"
                      style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}
                    >
                      Context &amp; Details
                    </label>
                    <textarea
                      className="input-field"
                      style={{ height: 'auto', minHeight: '100px' }}
                      rows={4}
                      placeholder="Describe the severity and precise location..."
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[10px] font-bold uppercase mb-2"
                      style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}
                    >
                      Visual Evidence
                    </label>
                    <div
                      className="flex flex-col items-center justify-center p-10 rounded-xl cursor-pointer transition-all group"
                      style={{
                        border: '2px dashed var(--outline-variant)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.background = 'rgba(0,193,106,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--outline-variant)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Camera
                        size={40}
                        className="mb-3 transition-colors"
                        style={{ color: 'var(--outline-variant)' }}
                      />
                      <p className="title-sm" style={{ color: 'var(--on-surface-variant)' }}>
                        Snap or drag photographic evidence
                      </p>
                      <p className="body-sm mt-1" style={{ color: 'var(--outline)' }}>
                        Max file size 10MB (JPG, PNG)
                      </p>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full text-base py-4">
                    <MapPin size={18} />
                    Submit Verified Report
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
