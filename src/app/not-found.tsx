/**
 * WasteIQ — 404 Page
 * Reference UI: 404_error_page_not_found/screen.png
 * Green-to-blue gradient "404", floating bin illustration, CTAs.
 */
import Link from 'next/link';
import { Trash2, Home, LayoutDashboard, HelpCircle, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--surface)' }}
    >
      {/* 404 Gradient Text */}
      <h1
        className="font-bold mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(80px, 15vw, 120px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #006D39, #39B8FD)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        404
      </h1>

      {/* Floating bin with question mark */}
      <div
        className="animate-float mb-8"
        style={{
          width: '120px',
          height: '120px',
          background: 'var(--surface-lowest)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="relative">
          <Trash2 size={48} style={{ color: 'var(--primary)' }} />
          <span
            className="absolute -top-2 -right-3 text-lg font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--tertiary)',
            }}
          >
            ?
          </span>
        </div>
      </div>

      {/* Message */}
      <h2 className="headline-md mb-3">This page has gone to waste.</h2>
      <p
        className="body-lg mb-8"
        style={{ color: 'var(--on-surface-variant)', maxWidth: '400px' }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
        <Link href="/" className="btn-primary no-underline">
          <Home size={16} /> Go to Homepage
        </Link>
        <Link href="/admin" className="btn-ghost no-underline">
          <LayoutDashboard size={16} /> Go to Dashboard
        </Link>
      </div>

      {/* Contact Strip */}
      <div
        className="flex items-center gap-6 text-xs"
        style={{ color: 'var(--outline)' }}
      >
        <a
          href="mailto:support@wasteiq.in"
          className="flex items-center gap-1.5 no-underline"
          style={{ color: 'var(--outline)' }}
        >
          <Mail size={12} /> support@wasteiq.in
        </a>
        <a
          href="#"
          className="flex items-center gap-1.5 no-underline"
          style={{ color: 'var(--outline)' }}
        >
          <HelpCircle size={12} /> Help Center
        </a>
      </div>
    </div>
  );
}
