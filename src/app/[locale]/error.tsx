/**
 * WasteIQ — 500 Error Page
 * Reference UI: 500_server_error_page/screen.png
 * Amber gradient "500", error reference ID, try again button.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCcw, Copy, Check, Radio } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const errorId = error.digest || `ERR-${Date.now().toString(36).toUpperCase()}`;

  const copyId = () => {
    navigator.clipboard.writeText(errorId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Log to Sentry in production
    console.error('[WasteIQ Error]', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--surface)' }}
    >
      {/* 500 Gradient Text */}
      <h1
        className="font-bold mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(80px, 15vw, 120px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #9D4300, #FF8842)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        500
      </h1>

      {/* Broken signal icon */}
      <div
        className="mb-8"
        style={{
          width: '120px',
          height: '120px',
          background: 'var(--warning-container)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AlertTriangle size={48} style={{ color: 'var(--warning)' }} />
      </div>

      <h2 className="headline-md mb-3">Something went wrong on our end.</h2>
      <p
        className="body-lg mb-6"
        style={{ color: 'var(--on-surface-variant)', maxWidth: '400px' }}
      >
        Our systems encountered an unexpected error. This has been automatically reported.
      </p>

      {/* Error Reference Card */}
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-xl mb-8"
        style={{
          background: 'var(--surface-lowest)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <span className="body-sm" style={{ color: 'var(--outline)' }}>
          Error Reference:
        </span>
        <code
          className="mono-md"
          style={{ color: 'var(--tertiary)' }}
        >
          {errorId}
        </code>
        <button
          onClick={copyId}
          className="p-1 rounded-md"
          style={{
            background: 'var(--surface-low)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--outline)',
          }}
          aria-label="Copy error ID"
        >
          {copied ? <Check size={14} style={{ color: 'var(--primary)' }} /> : <Copy size={14} />}
        </button>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
        <button
          onClick={reset}
          className="btn-primary no-underline"
          style={{
            background: 'linear-gradient(135deg, #9D4300, #FF8842)',
          }}
        >
          <RefreshCcw size={16} /> Try Again
        </button>
        <Link href="/" className="btn-ghost no-underline">
          <Home size={16} /> Go to Homepage
        </Link>
      </div>

      {/* System Status */}
      <div
        className="flex items-center gap-2"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--outline)',
        }}
      >
        <Radio size={12} />
        <span>SYSTEM STATUS: DEGRADED</span>
      </div>
    </div>
  );
}
