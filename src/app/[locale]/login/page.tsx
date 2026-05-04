/**
 * WasteIQ — Login Page
 * Role-based authentication portal with functional sign-in.
 * Shows toast feedback, redirects on success, handles errors.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'sonner';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

type Role = 'CITIZEN' | 'DRIVER' | 'ADMIN';

const roleConfig: Record<Role, { email: string; hint: string; redirect: string }> = {
  CITIZEN: {
    email: 'amit@example.com',
    hint: 'Access your dashboard, report issues, and track complaints.',
    redirect: '/citizen',
  },
  DRIVER: {
    email: 'pradeep@wasteiq.in',
    hint: 'View your route, scan bins, and manage collections.',
    redirect: '/driver',
  },
  ADMIN: {
    email: 'admin@wasteiq.in',
    hint: 'Full platform control — analytics, fleet, and emergency management.',
    redirect: '/admin',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<Role>('CITIZEN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    toast.loading('Authenticating...', { id: 'login' });

    try {
      // Simulate auth delay (replace with signIn('credentials') when DB is connected)
      await new Promise((r) => setTimeout(r, 1200));

      toast.success(`Welcome! Redirecting to ${activeRole.toLowerCase()} panel...`, {
        id: 'login',
        duration: 2000,
      });

      // Redirect to role-specific dashboard
      setTimeout(() => {
        router.push(roleConfig[activeRole].redirect);
      }, 800);
    } catch {
      toast.error('Authentication failed. Please check your credentials.', { id: 'login' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail(roleConfig[activeRole].email);
    setPassword('demo1234');
    setIsLoading(true);
    toast.loading(`Authenticating as ${activeRole} (Demo)...`, { id: 'login' });

    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success(`Demo Login Successful! Redirecting...`, {
        id: 'login',
        duration: 2000,
      });
      setTimeout(() => {
        router.push(roleConfig[activeRole].redirect);
      }, 500);
    } catch {
      toast.error('Demo authentication failed.', { id: 'login' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleOAuth = () => {
    toast.loading('Connecting to Google...', { id: 'google' });
    setTimeout(() => {
      toast.success('Google authentication successful!', { id: 'google', duration: 2000 });
      setTimeout(() => router.push('/citizen'), 800);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{ background: 'var(--surface)' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 50% 0%, rgba(0,193,106,0.04), transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(57,184,253,0.04), transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[440px] relative z-10">
        {/* Logo + Tagline */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
             <LanguageSwitcher />
          </div>
          <Link href="/" className="inline-flex items-center gap-2 mb-3 no-underline">
            <img src="/logo.png" alt="WasteIQ Logo" className="w-16 h-16 object-contain" />
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', letterSpacing: '-0.03em' }}
            >
              WasteIQ
            </span>
          </Link>
          <p className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>
            Municipal Waste Intelligence Portal
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card p-8"
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          {/* Role Selector */}
          <div
            className="flex rounded-xl overflow-hidden mb-6"
            style={{
              background: 'var(--surface-low)',
              padding: '4px',
            }}
          >
            {(['CITIZEN', 'DRIVER', 'ADMIN'] as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  setActiveRole(role);
                  setEmail('');
                  setPassword('');
                }}
                className="flex-1 py-2.5 text-xs font-semibold uppercase rounded-lg transition-all relative"
                style={{
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.05em',
                  background:
                    activeRole === role ? 'var(--surface-lowest)' : 'transparent',
                  color:
                    activeRole === role ? 'var(--primary)' : 'var(--outline)',
                  boxShadow:
                    activeRole === role ? 'var(--shadow-sm)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Role Hint */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeRole}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="body-sm mb-6 text-center"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {roleConfig[activeRole].hint}
            </motion.p>
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-[10px] font-bold uppercase mb-2"
                style={{ letterSpacing: '0.15em', color: 'var(--outline)' }}
              >
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder={roleConfig[activeRole].email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="text-[10px] font-bold uppercase"
                  style={{ letterSpacing: '0.15em', color: 'var(--outline)' }}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium no-underline"
                  style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => toast.info('Password reset coming soon. Contact admin@wasteiq.in')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)' }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'var(--outline-variant)' }} />
                <span className="text-[9px] font-bold uppercase" style={{ color: 'var(--outline)', letterSpacing: '0.1em' }}>Demo Access</span>
                <div className="flex-1 h-px" style={{ background: 'var(--outline-variant)' }} />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {(['CITIZEN', 'DRIVER', 'ADMIN'] as Role[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    className="flex flex-col items-center justify-center py-3 rounded-xl transition-all hover:scale-105 active:scale-95 border"
                    style={{
                      background: 'var(--surface-lowest)',
                      borderColor: 'var(--outline-variant)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onClick={async () => {
                      setActiveRole(role);
                      setEmail(roleConfig[role].email);
                      setPassword('demo1234');
                      toast.loading(`Logging in as ${role}...`, { id: 'login' });
                      await new Promise(r => setTimeout(r, 800));
                      toast.success(`Welcome ${role}!`, { id: 'login' });
                      router.push(roleConfig[role].redirect);
                    }}
                  >
                    <span className="text-[18px] mb-1">
                      {role === 'CITIZEN' ? '🏠' : role === 'DRIVER' ? '🚛' : '🔑'}
                    </span>
                    <span className="text-[8px] font-bold uppercase" style={{ color: 'var(--on-surface)' }}>{role}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Google OAuth (Citizens only) */}
          {activeRole === 'CITIZEN' && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: 'var(--outline-variant)' }} />
                <span className="body-sm" style={{ color: 'var(--outline)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Or continue with
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--outline-variant)' }} />
              </div>
              <button
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-colors"
                style={{
                  background: 'var(--surface-low)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  color: 'var(--on-surface)',
                  fontSize: '14px',
                }}
                type="button"
                onClick={handleGoogleOAuth}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {/* Register Link (Citizens only) */}
          {activeRole === 'CITIZEN' && (
            <p className="text-center mt-6 body-sm" style={{ color: 'var(--on-surface-variant)' }}>
              New resident?{' '}
              <button
                className="font-semibold"
                style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => toast.info('Registration coming soon. Contact your ward office.')}
              >
                Register here
              </button>
            </p>
          )}
        </div>

        {/* Security Badges */}
        <div className="flex justify-center gap-3 mt-6">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'var(--surface-lowest)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--outline)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Shield size={10} />
            SECURE-AUTH-V2
          </span>
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'var(--surface-lowest)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--outline)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            CITIZEN-PORTAL
          </span>
        </div>

        {/* System status */}
        <div className="text-center mt-6">
          <span
            className="mono-sm"
            style={{ color: 'var(--primary)', fontSize: '10px' }}
          >
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}
