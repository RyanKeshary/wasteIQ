/**
 * WasteIQ — Footer Component
 * Shared footer for public pages.
 * 4-column grid with brand, platform links, governance, and newsletter.
 */
import Link from 'next/link';
import { Globe, Share2, Send } from 'lucide-react';

const platformLinks = [
  { label: 'Live Status', href: '/transparency' },
  { label: 'Civic Trust Badge', href: '/about' },
  { label: 'API Docs', href: '#' },
  { label: 'Analytics Hub', href: '/transparency' },
];

const governanceLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Open Data Charter', href: '#' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface-low)' }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-20 max-w-[1280px] mx-auto">
        {/* Brand Column */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="WasteIQ Logo" className="w-12 h-12 object-contain" />
            <span
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--on-surface)' }}
            >
              WasteIQ
            </span>
          </div>
          <p className="body-sm" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>
            Mira-Bhayandar&apos;s digital backbone for sustainable waste management
            and civic excellence. Empowering citizens through data.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: 'var(--surface-lowest)',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--outline)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Website"
            >
              <Globe size={16} />
            </button>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: 'var(--surface-lowest)',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--outline)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Share"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4
            className="text-xs uppercase font-bold mb-6"
            style={{
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.2em',
              color: 'var(--primary)',
            }}
          >
            Platform
          </h4>
          <div className="flex flex-col gap-4">
            {platformLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm no-underline transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--on-surface-variant)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Governance Links */}
        <div>
          <h4
            className="text-xs uppercase font-bold mb-6"
            style={{
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.2em',
              color: 'var(--primary)',
            }}
          >
            Accountability
          </h4>
          <div className="flex flex-col gap-4">
            {governanceLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm no-underline transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--on-surface-variant)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4
            className="text-xs uppercase font-bold mb-6"
            style={{
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.2em',
              color: 'var(--primary)',
            }}
          >
            Updates
          </h4>
          <p
            className="text-xs mb-4"
            style={{ color: 'var(--outline)', lineHeight: 1.6 }}
          >
            Receive weekly city sustainability reports.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="input-field flex-1 text-xs"
              style={{ height: '40px', padding: '8px 12px' }}
            />
            <button
              className="flex items-center justify-center rounded-lg transition-opacity"
              style={{
                background: 'var(--primary)',
                color: 'white',
                width: '40px',
                height: '40px',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Subscribe"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="max-w-[1280px] mx-auto px-6 md:px-12 pb-8 pt-6"
        style={{ borderTop: '1px solid var(--outline-variant)' }}
      >
        <p
          className="text-center"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--outline)',
          }}
        >
          © 2026 WasteIQ. Curating the future of civic sustainability. Mira-Bhayandar
          Municipal Corporation Official Technology Partner.
        </p>
      </div>
    </footer>
  );
}
