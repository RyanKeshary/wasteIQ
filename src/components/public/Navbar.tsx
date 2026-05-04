/**
 * WasteIQ — Ultra-Premium Navbar
 * Glassmorphic, scroll-responsive, with animated brand identity.
 * Features: Morphing logo, active section tracking, magnetic hover effects.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ArrowRight, ArrowUp, Zap, Globe, Shield, BarChart3 } from 'lucide-react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const navLinks = [
  { label: 'Platform', href: '#platform', icon: Zap },
  { label: 'Solutions', href: '#solutions', icon: Shield },
  { label: 'Sensors', href: '#sensors', icon: Globe },
  { label: 'Analytics', href: '#analytics', icon: BarChart3 },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    navLinks.forEach((link) => {
      const id = link.href.replace('#', '');
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Ambient glow behind navbar when scrolled */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: scrolled ? 1 : 0,
          }}
          style={{
            background: 'linear-gradient(180deg, rgba(0,193,106,0.03) 0%, transparent 100%)',
          }}
        />

        <div
          className="relative mx-auto transition-all duration-500"
          style={{
            maxWidth: scrolled ? '1300px' : '100%',
            padding: scrolled ? '6px 20px' : '12px 24px',
          }}
        >
          <motion.div
            className="flex justify-between items-center transition-all duration-500 relative"
            style={{
              background: scrolled
                ? 'rgba(255, 255, 255, 0.78)'
                : 'transparent',
              backdropFilter: scrolled ? 'blur(40px) saturate(200%)' : 'none',
              WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(200%)' : 'none',
              boxShadow: scrolled
                ? '0 8px 32px rgba(0,109,57,0.06), 0 1px 0 rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)'
                : 'none',
              borderRadius: scrolled ? '20px' : '0px',
              padding: scrolled ? '2px 6px 2px 14px' : '0px',
              border: scrolled ? '1px solid rgba(0,193,106,0.06)' : '1px solid transparent',
            }}
          >
            {/* Logo — Animated brand identity */}
            <Link href="/" className="flex items-center gap-3 no-underline group">
              <motion.div className="relative">
                <motion.img
                  src="/logo.png"
                  alt="WasteIQ Logo"
                  className="object-contain relative z-10"
                  animate={{
                    width: scrolled ? 36 : 48,
                    height: scrolled ? 36 : 48,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(0,109,57,0.2))' }}
                />
                {/* Logo glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    scale: scrolled ? 0 : 1.4,
                    opacity: scrolled ? 0 : 0.15,
                  }}
                  style={{ background: 'radial-gradient(circle, var(--primary-container), transparent 70%)' }}
                />
              </motion.div>
              <div className="flex flex-col">
                <span
                  className="font-black transition-all duration-300"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--primary)',
                    letterSpacing: '-0.05em',
                    fontSize: scrolled ? '16px' : '20px',
                    lineHeight: 1,
                  }}
                >
                  WasteIQ
                </span>
                <motion.span
                  animate={{ opacity: scrolled ? 0 : 1, height: scrolled ? 0 : 'auto' }}
                  className="overflow-hidden"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7px',
                    fontWeight: 700,
                    color: 'var(--outline)',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                  }}
                >
                  CIVIC INTELLIGENCE
                </motion.span>
              </div>
            </Link>

            {/* Desktop Nav — Floating pill with magnetic hover */}
            <div className="hidden md:flex items-center">
              <div
                className="flex items-center gap-0.5 px-1.5 py-1.5 rounded-full transition-all duration-500 relative"
                style={{
                  background: scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.02)',
                }}
              >
                {navLinks.map((link) => {
                  const targetId = link.href.replace('#', '');
                  const isActive = activeSection === targetId;
                  const isHovered = hoveredLink === link.label;
                  const LinkIcon = link.icon;

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setActiveSection(targetId)}
                      onMouseEnter={() => setHoveredLink(link.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="relative px-4 py-2 rounded-full text-xs font-bold no-underline transition-all duration-300 flex items-center gap-2"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: isActive ? 'var(--primary)' : isHovered ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                        background: isActive ? 'rgba(0,193,106,0.08)' : 'transparent',
                        letterSpacing: '0.01em',
                      }}
                    >
                      <LinkIcon size={12} style={{ opacity: isActive || isHovered ? 1 : 0.4, transition: 'opacity 0.3s' }} />
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ background: 'var(--primary-container)' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right CTA Cluster */}
            <div className="flex items-center gap-2">
              {/* Live System Pulse */}
              <motion.div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(0,193,106,0.05)',
                  border: '1px solid rgba(0,193,106,0.08)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  letterSpacing: '0.1em',
                }}
                animate={{
                  boxShadow: ['0 0 0 0 rgba(0,193,106,0)', '0 0 0 6px rgba(0,193,106,0.08)', '0 0 0 0 rgba(0,193,106,0)'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span
                  className="w-2 h-2 rounded-full relative"
                  style={{ background: 'var(--primary-container)' }}
                >
                  <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'var(--primary-container)', opacity: 0.5 }} />
                </span>
                SYSTEM LIVE
              </motion.div>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Get Started CTA — Animated gradient border */}
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 no-underline text-[10px] font-black px-4 py-2 rounded-full transition-all duration-300 relative group overflow-hidden"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  boxShadow: '0 3px 12px rgba(0,109,57,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,109,57,0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,57,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
                }}
              >
                {/* Shine effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                    backgroundSize: '200% 100%',
                    animation: 'shine 1.5s ease-in-out infinite',
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Launch Portal <ArrowRight size={13} />
                </span>
              </Link>

              {/* Mobile Hamburger */}
              <button
                className="md:hidden p-2.5 rounded-xl transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                style={{
                  background: mobileOpen ? 'var(--primary)' : 'rgba(0,0,0,0.04)',
                  border: 'none',
                  cursor: 'pointer',
                  color: mobileOpen ? 'white' : 'var(--on-surface)',
                }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all group"
            style={{
              background: 'var(--surface-lowest)',
              color: 'var(--primary)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(0,109,57,0.08)',
            }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Overlay — Full-screen immersive */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,250,254,0.99))',
              backdropFilter: 'blur(60px)',
            }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
              {navLinks.map((link, i) => {
                const LinkIcon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setActiveSection(link.href.replace('#', ''));
                      setMobileOpen(false);
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm flex items-center gap-4 px-6 py-5 rounded-2xl no-underline transition-all"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: activeSection === link.href.replace('#', '') ? 'var(--primary)' : 'var(--on-surface)',
                      background: activeSection === link.href.replace('#', '') ? 'rgba(0,193,106,0.06)' : 'transparent',
                      border: '1px solid transparent',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,193,106,0.08)' }}>
                      <LinkIcon size={18} style={{ color: 'var(--primary)' }} />
                    </div>
                    {link.label}
                  </motion.a>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-sm mt-4"
              >
                <Link
                  href="/login"
                  className="btn-primary w-full no-underline text-sm justify-center py-4"
                  onClick={() => setMobileOpen(false)}
                >
                  Launch Portal <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
