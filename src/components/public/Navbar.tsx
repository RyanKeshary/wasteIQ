/**
 * WasteIQ — Public Navbar
 * Ultra-compact sticky glassmorphism navbar.
 * Transforms on scroll with blur, shrink, and color shifts.
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ArrowRight, ArrowUp } from 'lucide-react';

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Sensors', href: '#sensors' },
  { label: 'Analytics', href: '#analytics' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
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
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: scrolled
            ? 'rgba(255, 255, 255, 0.72)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
          boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.03)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,109,57,0.06)' : '1px solid transparent',
        }}
      >
        <div
          className="flex justify-between items-center mx-auto transition-all duration-300"
          style={{
            maxWidth: '1400px',
            padding: scrolled ? '6px 24px' : '10px 24px',
          }}
        >
          {/* Logo — Size increased based on request */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <motion.img
              src="/logo.png"
              alt="WasteIQ Logo"
              className="object-contain"
              animate={{
                width: scrolled ? 48 : 64,
                height: scrolled ? 48 : 64,
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,109,57,0.15))' }}
            />
            <span
              className="font-bold transition-all duration-300"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--primary)',
                letterSpacing: '-0.04em',
                fontSize: scrolled ? '18px' : '22px',
              }}
            >
              WasteIQ
            </span>
          </Link>

          {/* Desktop Nav Links — pill style with active tracking */}
          <div className="hidden md:flex items-center">
            <div
              className="flex items-center gap-1 px-1 py-1 rounded-full transition-all duration-300"
              style={{
                background: scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {navLinks.map((link) => {
                const targetId = link.href.replace('#', '');
                const isActive = activeSection === targetId;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setActiveSection(targetId)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold no-underline transition-all duration-200"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                      background: isActive ? 'rgba(0,193,106,0.08)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--primary)';
                        e.currentTarget.style.background = 'rgba(0,193,106,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--on-surface-variant)';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right CTA Cluster */}
          <div className="flex items-center gap-2">
            {/* Live Status Pill */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(0,193,106,0.08)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--primary)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--primary-container)' }}
              />
              LIVE
            </div>

            {/* Get Started CTA */}
            <Link
               href="/login"
               className="hidden sm:flex items-center gap-1.5 no-underline text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
               style={{
                 background: 'var(--primary)',
                 color: 'white',
                 boxShadow: '0 2px 8px rgba(0,109,57,0.25)',
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-1px)';
                 e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,57,0.35)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,109,57,0.25)';
               }}
            >
              Get Started <ArrowRight size={13} />
            </Link>

            {/* Mobile Hamburger */}
            <button
               className="md:hidden p-2 rounded-lg"
               onClick={() => setMobileOpen(!mobileOpen)}
               aria-label="Toggle menu"
               style={{
                 background: 'rgba(0,0,0,0.03)',
                 border: 'none',
                 cursor: 'pointer',
                 color: 'var(--on-surface)',
               }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
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
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full flex items-center justify-center cursor-pointer hover:-translate-y-1 transition-all"
            style={{
              background: 'var(--surface)',
              color: 'var(--primary)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(0,109,57,0.1)',
            }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.97)',
              backdropFilter: 'blur(40px)',
            }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.href.replace('#', ''));
                    setMobileOpen(false);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-2xl font-bold no-underline"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: activeSection === link.href.replace('#', '') ? 'var(--primary)' : 'var(--on-surface)',
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              <Link
                href="/login"
                className="btn-primary mt-4 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

