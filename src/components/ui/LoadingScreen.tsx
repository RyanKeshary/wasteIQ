'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LoadingScreen component
 * Displays a premium loading animation with the WasteIQ logo.
 * Uses glassmorphism and fluid typography.
 */
const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[var(--surface)]"
      style={{
        background: 'radial-gradient(circle at center, var(--surface-lowest) 0%, var(--surface) 100%)',
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--primary)] opacity-10 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--secondary)] opacity-10 blur-[150px]"
        />
      </div>

      <div className="relative flex flex-col items-center gap-12 z-10">
        {/* Logo Container with Glassmorphism */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative group"
        >
          {/* Animated Glow Rings */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-[-20%] rounded-full border-2 border-[var(--primary)] opacity-20"
          />
          <motion.div
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.2, 0.05, 0.2],
            }}
            transition={{
              duration: 3,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-[-40%] rounded-full border border-[var(--secondary)] opacity-10"
          />

          {/* Logo Wrapper */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-[48px] overflow-hidden glass shadow-2xl flex items-center justify-center p-4 border border-[var(--outline-variant)]">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full h-full"
            >
              <Image
                src="/logo.png"
                alt="WasteIQ Logo"
                fill
                sizes="(max-width: 768px) 288px, 384px"
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Text and Progress */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="headline-lg tracking-widest text-[var(--primary)] font-black text-4xl md:text-6xl"
            >
              WASTEIQ
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="label-lg text-[var(--outline)] mt-1 tracking-[0.2em] uppercase"
            >
              The Civic Sentinel
            </motion.p>
          </div>

          {/* Premium Progress Bar */}
          <div className="w-64 h-1.5 bg-[var(--surface-high)] rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] rounded-full"
            />
            {/* Shimmer Effect on Progress */}
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 w-1/2 bg-white/20 skew-x-12"
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mono-sm text-[var(--outline)]"
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      </div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-widest uppercase text-[var(--on-surface)]">
          Mira-Bhayandar Municipal Corporation
        </span>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
