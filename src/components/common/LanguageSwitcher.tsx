/**
 * WasteIQ — Language Switcher
 * Premium dropdown for selecting regional languages (en, hi, mr, gu).
 */
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const locales = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Initialize Google Translate Element if not present
    if (!document.getElementById('google-translate-script')) {
      // Sync cookie on initial load if directly visiting a localized route
      const currentCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
      const expectedCookie = locale === 'en' ? undefined : `googtrans=/en/${locale}`;
      
      if (locale !== 'en' && currentCookie !== expectedCookie) {
        document.cookie = `googtrans=/en/${locale}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${locale}; path=/;`;
      } else if (locale === 'en' && currentCookie) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
        );
      };
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  const handleLocaleChange = (newLocale: string) => {
    // Set Google Translate cookie to handle the heavy lifting for un-localized text
    if (newLocale === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${newLocale}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${newLocale}; path=/;`;
    }
    
    setIsOpen(false);
    
    // Instead of doing soft routing with Next-intl (which breaks Google Translate hydration),
    // we do a hard reload to ensure Google Translate parses the fresh DOM.
    window.location.href = `/${newLocale}${pathname === '/' ? '' : pathname}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-surface-low/50 backdrop-blur-md border border-outline-variant hover:border-primary/50 transition-all group shadow-sm"
      >
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Languages size={14} />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] font-bold text-outline uppercase tracking-tighter">Language</span>
          <span className="text-xs font-bold text-on-surface">{currentLocale.name}</span>
        </div>
        <ChevronDown 
          size={12} 
          className={`text-outline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-full right-0 mt-3 w-48 bg-surface-lowest/95 backdrop-blur-xl rounded-[24px] border border-outline-variant shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-2 space-y-1">
              {locales.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLocaleChange(l.code)}
                  className={`w-full px-4 py-3 rounded-2xl text-left flex items-center justify-between transition-all group ${
                    locale === l.code 
                      ? 'shadow-lg' 
                      : 'hover:bg-primary/5'
                  }`}
                  style={{
                    backgroundColor: locale === l.code ? 'var(--primary)' : 'transparent',
                    color: locale === l.code ? '#ffffff' : 'var(--on-surface)'
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-tight">{l.name}</span>
                    <span 
                      className="text-[10px] font-medium"
                      style={{ color: locale === l.code ? 'rgba(255,255,255,0.7)' : 'var(--outline)' }}
                    >
                      {l.native}
                    </span>
                  </div>
                  {locale === l.code && (
                    <motion.div 
                      layoutId="active-check"
                      className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                    >
                      <Check size={12} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            <div className="bg-surface-high/30 p-3 border-t border-outline-variant/50">
               <p className="text-[9px] font-bold text-outline uppercase tracking-widest text-center">
                 Local Body Support Active
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div id="google_translate_element" className="hidden" style={{ display: 'none' }}></div>
      <style dangerouslySetInnerHTML={{__html: `
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      `}} />
    </div>
  );
}
