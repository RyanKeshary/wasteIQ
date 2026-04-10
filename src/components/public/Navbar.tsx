/**
 * WasteIQ — Public Navbar
 * Fixed navigation bar with glass-blur on scroll.
 * Matches the Stitch reference design.
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Recycle, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Sensors', href: '#sensors' },
  { label: 'Analytics', href: '#analytics' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(246, 250, 254, 0.85)'
            : 'var(--surface-lowest)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Recycle
              size={28}
              style={{ color: 'var(--primary)' }}
              strokeWidth={2.5}
            />
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--primary)',
                letterSpacing: '-0.03em',
              }}
            >
              WasteIQ
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium no-underline transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--on-surface-variant)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'var(--primary)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'var(--on-surface-variant)')
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right CTA Cluster */}
          <div className="flex items-center gap-3">
            {/* Live Status Pill */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
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
              LIVE
            </div>

            {/* Get Started CTA */}
            <Link
              href="/login"
              className="hidden sm:flex btn-primary text-sm py-2.5 px-5 no-underline"
              style={{ minHeight: '40px', minWidth: 'auto' }}
            >
              Get Started
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--on-surface)',
              }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(246, 250, 254, 0.98)' }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-semibold no-underline"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--on-surface)',
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                className="btn-primary mt-4 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
