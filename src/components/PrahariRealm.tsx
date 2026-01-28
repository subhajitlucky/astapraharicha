"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";
import { useEffect, useState } from "react";
import gsap from "gsap";

export default function PrahariRealm() {
  const { currentPrahari } = usePrahariStore();
  const [mounted, setMounted] = useState(false);
  const [soulCount, setSoulCount] = useState(0);

  useEffect(() => {
    // Avoid cascading renders warning by making state updates asynchronous
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      setSoulCount(Math.floor(Math.random() * 40) + 12);
    });
    
    // Update CSS variables for global theming
    const root = document.documentElement;
    root.style.setProperty("--current-primary", currentPrahari.colors.primary);
    root.style.setProperty("--current-secondary", currentPrahari.colors.secondary);
    root.style.setProperty("--current-accent", currentPrahari.colors.accent);
    
    // Animate body background color
    if (typeof window !== 'undefined') {
      gsap.to("body", {
        backgroundColor: currentPrahari.colors.primary,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }

    return () => cancelAnimationFrame(frame);
  }, [currentPrahari]);

  if (!mounted) return null;

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center px-4 md:px-20 z-20 ${currentPrahari.theme === 'light' ? 'text-black' : 'text-white'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPrahari.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Typography & Info */}
          <div className="space-y-6 text-left relative z-30">
            <motion.div
              className="flex items-center gap-2 mb-4 opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-light">
                {soulCount} Souls Present in this Realm
              </span>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xs uppercase tracking-[0.3em] opacity-60 block mb-2">
                {currentPrahari.phase}
              </span>
              <h2 className="text-5xl md:text-7xl font-bold text-spiritual leading-tight">
                {currentPrahari.nameOdia}
              </h2>
              <h3 className="text-2xl md:text-3xl font-light mt-2 opacity-80">
                {currentPrahari.nameEn}
              </h3>
            </motion.div>

            <div className="h-px w-24 bg-current opacity-30" />

            <motion.p 
              className="text-lg md:text-xl leading-relaxed opacity-80 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentPrahari.significance}
            </motion.p>

            <motion.div
              className="inline-block px-6 py-3 border border-current rounded-full text-sm tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentPrahari.mantra}
            </motion.div>
          </div>

          {/* Right: Visual Representation */}
          <div className="relative aspect-square z-20">
            <div 
              className="absolute inset-0 rounded-full opacity-20 blur-3xl"
              style={{ 
                background: `radial-gradient(circle, ${currentPrahari.colors.accent} 0%, transparent 70%)` 
              }}
            />
            
            <div className="absolute inset-8 border-2 border-current opacity-30 rounded-full flex items-center justify-center">
              <div className="text-6xl md:text-8xl font-bold opacity-20">
                {String(currentPrahari.id).padStart(2, '0')}
              </div>
            </div>

            <motion.div
              className="absolute inset-0 rounded-full border border-current opacity-40"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="fixed bottom-8 left-8 right-8 md:left-20 md:right-20 h-px bg-current opacity-10">
        <div 
          className="h-full bg-current transition-all duration-1000"
          style={{ width: `${(currentPrahari.id / 8) * 100}%` }}
        />
      </div>
    </div>
  );
}
