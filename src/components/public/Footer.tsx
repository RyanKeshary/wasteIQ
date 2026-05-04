/**
 * WasteIQ — Premium Footer Component
 * Cinematic footer with gradient border, ambient glows, and rich layout.
 */
import Link from 'next/link';
import { Globe, Share2, Send, ArrowUpRight, Zap, Shield, MapPin, BarChart3 } from 'lucide-react';

const platformLinks = [
  { label: 'Live Status', href: '/transparency', icon: Zap },
  { label: 'Civic Trust Badge', href: '/about', icon: Shield },
  { label: 'API Documentation', href: '#', icon: ArrowUpRight },
  { label: 'Analytics Hub', href: '/transparency', icon: BarChart3 },
];

const governanceLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Open Data Charter', href: '#' },
  { label: 'Accessibility', href: '#' },
];

const techStack = ['Next.js', 'PostgreSQL', 'Ably', 'Tesseract', 'Prisma', 'Redis'];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--surface-low) 0%, #0d1117 100%)' }}>
      {/* Gradient divider line */}
      <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,193,106,0.5), rgba(57,184,253,0.5), transparent)' }} />

      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[400px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,193,106,0.4), transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute -bottom-20 right-1/4 w-[400px] h-[300px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(57,184,253,0.3), transparent 70%)', filter: 'blur(80px)' }} />

      {/* Main content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-12 py-20 max-w-[1280px] mx-auto">
        {/* Brand Column — Wider */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="WasteIQ Logo" className="w-14 h-14 object-contain" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,193,106,0.3))' }} />
            <div>
              <span
                className="text-2xl font-black block"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--on-surface)', letterSpacing: '-0.04em' }}
              >
                WasteIQ
              </span>
              <span className="text-[8px] font-bold uppercase" style={{ letterSpacing: '0.2em', color: 'var(--outline)' }}>
                Civic Intelligence Platform
              </span>
            </div>
          </div>
          <p className="body-sm mb-6" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.8 }}>
            Mira-Bhayandar&apos;s digital backbone for sustainable waste management
            and civic excellence. Empowering citizens through data-driven transparency.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-3">
            {[Globe, Share2].map((Icon, i) => (
              <button
                key={i}
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: 'var(--surface-lowest)',
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--outline)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,193,106,0.1)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-lowest)'; e.currentTarget.style.color = 'var(--outline)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                aria-label={i === 0 ? 'Website' : 'Share'}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          {/* Tech Stack Ticker */}
          <div className="mt-8 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-[9px] font-bold uppercase"
                style={{
                  background: 'rgba(0,193,106,0.04)',
                  color: 'var(--outline)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  letterSpacing: '0.08em',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Platform Links */}
        <div className="md:col-span-3">
          <h4
            className="text-[10px] uppercase font-black mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.25em',
              color: 'var(--primary)',
            }}
          >
            Platform
          </h4>
          <div className="flex flex-col gap-3">
            {platformLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 text-sm no-underline transition-all duration-300 px-3 py-2.5 rounded-xl -mx-3 group"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--on-surface-variant)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,193,106,0.04)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}
                >
                  <LinkIcon size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Governance Links */}
        <div className="md:col-span-2">
          <h4
            className="text-[10px] uppercase font-black mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.25em',
              color: 'var(--primary)',
            }}
          >
            Legal
          </h4>
          <div className="flex flex-col gap-3">
            {governanceLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm no-underline transition-colors duration-300 py-1"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--on-surface-variant)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--on-surface-variant)'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter — Premium */}
        <div className="md:col-span-3">
          <h4
            className="text-[10px] uppercase font-black mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.25em',
              color: 'var(--primary)',
            }}
          >
            Stay Updated
          </h4>
          <p
            className="text-xs mb-5"
            style={{ color: 'var(--outline)', lineHeight: 1.7 }}
          >
            Receive weekly city sustainability reports and platform updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="you@city.gov"
              className="input-field flex-1 text-xs"
              style={{ height: '44px', padding: '8px 14px', borderRadius: '14px', fontFamily: 'var(--font-mono)' }}
            />
            <button
              className="flex items-center justify-center rounded-[14px] transition-all duration-300"
              style={{
                background: 'var(--primary)',
                color: 'white',
                width: '44px',
                height: '44px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,109,57,0.25)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              aria-label="Subscribe"
            >
              <Send size={14} />
            </button>
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-2 mt-6 px-3 py-2 rounded-xl" style={{ background: 'rgba(0,193,106,0.04)', border: '1px solid rgba(0,0,0,0.03)' }}>
            <MapPin size={12} style={{ color: 'var(--primary)' }} />
            <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.1em', color: 'var(--outline)' }}>
              Mira-Bhayandar, Maharashtra 401107
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar — Cinematic */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 pb-10 pt-8">
        {/* Gradient separator */}
        <div className="h-[1px] w-full mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,193,106,0.2), rgba(57,184,253,0.15), transparent)' }} />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--outline)',
            }}
          >
            © 2026 WasteIQ — Curating the future of civic sustainability
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--outline)',
            }}
          >
            Mira-Bhayandar Municipal Corporation · Official Technology Partner
          </p>
        </div>
      </div>
    </footer>
  );
}
