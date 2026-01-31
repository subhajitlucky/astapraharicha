"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useState } from "react";
import gsap from "gsap";

export default function PrahariRealm() {
  const { currentPrahari } = usePrahariStore();
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  
  // Deterministic soul count based on prahari ID - same on server and client
  // This prevents hydration mismatch while still showing variation between praharis
  const soulCount = 12 + ((currentPrahari.id * 7) % 40);

  useEffect(() => {
    // Avoid cascading renders warning by making state updates asynchronous
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    // Update CSS variables for global theming
    const root = document.documentElement;
    root.style.setProperty("--current-primary", currentPrahari.colors.primary);
    root.style.setProperty("--current-secondary", currentPrahari.colors.secondary);
    root.style.setProperty("--current-accent", currentPrahari.colors.accent);
    root.style.setProperty("--current-mist", currentPrahari.colors.mist);
    
    // Animate body background color
    if (typeof window !== 'undefined') {
      if (reducedMotion) {
        gsap.set("body", { backgroundColor: currentPrahari.colors.primary });
      } else {
        gsap.to("body", {
          backgroundColor: currentPrahari.colors.primary,
          duration: 1.5,
          ease: "power2.inOut"
        });
      }
    }

    return () => cancelAnimationFrame(frame);
  }, [currentPrahari, reducedMotion]);

  if (!mounted) return null;

  // Dynamic text color based on prahari's secondary color
  const textColor = currentPrahari.theme === 'light' ? 'text-black' : 'text-white';
  const accentColor = currentPrahari.colors.accent;
  const secondaryColor = currentPrahari.colors.secondary;

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center px-4 md:px-20 z-20 pt-16 sm:pt-20 md:pt-0 pb-28 sm:pb-32 md:pb-0 ${textColor}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPrahari.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center"
        >
          {/* Left: Typography & Info */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 text-left relative z-30">
            <motion.div
              className="flex items-center gap-2 mb-3 sm:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.8 }}
            >
              {reducedMotion ? (
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              ) : (
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-light opacity-70">
                {soulCount} Souls Present in this Realm
              </span>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] block mb-1.5 sm:mb-2 font-medium"
                style={{ color: secondaryColor, opacity: 0.9 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.9, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentPrahari.phase}
              </motion.span>
              <h2 
                className="text-4xl sm:text-5xl md:text-7xl font-bold text-spiritual leading-tight"
                style={{ color: accentColor }}
              >
                {currentPrahari.nameOdia}
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light mt-1.5 sm:mt-2 opacity-80">
                {currentPrahari.nameEn}
              </h3>
            </motion.div>

            <motion.div 
              className="h-px w-24"
              style={{ backgroundColor: secondaryColor, opacity: 0.5 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />

            <motion.p 
              className="text-base sm:text-lg md:text-xl leading-relaxed max-w-md"
              style={{ color: currentPrahari.theme === 'light' ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.85)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentPrahari.significance}
            </motion.p>

            <motion.div
              className="inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm tracking-widest uppercase border-2"
              style={{ 
                borderColor: accentColor,
                color: accentColor,
                backgroundColor: `${accentColor}15`
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05, backgroundColor: `${accentColor}25` }}
            >
              {currentPrahari.mantra}
            </motion.div>
          </div>

          {/* Right: Visual Representation */}
          <div className="relative aspect-square z-20">
            {/* Multi-layered gradient background */}
            {reducedMotion ? (
              <div 
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${accentColor}40 0%, ${secondaryColor}20 40%, transparent 70%)` 
                }}
              />
            ) : (
              <motion.div 
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${accentColor}40 0%, ${secondaryColor}20 40%, transparent 70%)` 
                }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            
            {/* Outer glow ring */}
            {reducedMotion ? (
              <div
                className="absolute inset-4 rounded-full border-2"
                style={{ borderColor: `${secondaryColor}40` }}
              />
            ) : (
              <motion.div
                className="absolute inset-4 rounded-full border-2"
                style={{ borderColor: `${secondaryColor}40` }}
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            
            {/* Main circle with ID - enhanced visibility */}
            <motion.div 
              className="absolute inset-8 border-2 rounded-full flex items-center justify-center"
              style={{ borderColor: `${accentColor}60` }}
              initial={{ rotate: reducedMotion ? 0 : -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.4, duration: reducedMotion ? 0.1 : 0.8 }}
            >
              {reducedMotion ? (
                <div 
                  className="text-6xl md:text-8xl font-bold"
                  style={{ 
                    color: accentColor,
                    textShadow: `0 0 30px ${accentColor}60, 0 0 60px ${accentColor}30`
                  }}
                >
                  {String(currentPrahari.id).padStart(2, '0')}
                </div>
              ) : (
                <motion.div 
                  className="text-6xl md:text-8xl font-bold"
                  style={{ 
                    color: accentColor,
                    textShadow: `0 0 30px ${accentColor}60, 0 0 60px ${accentColor}30`
                  }}
                  animate={{ 
                    textShadow: [
                      `0 0 20px ${accentColor}40`,
                      `0 0 40px ${accentColor}80`,
                      `0 0 60px ${accentColor}40`,
                      `0 0 20px ${accentColor}40`
                    ],
                    opacity: [0.8, 1, 0.9, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {String(currentPrahari.id).padStart(2, '0')}
                </motion.div>
              )}
            </motion.div>

            {/* Animated orbital rings */}
            {!reducedMotion && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: `${secondaryColor}30` }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <motion.div
                  className="absolute inset-2 rounded-full border"
                  style={{ borderColor: `${accentColor}20` }}
                  animate={{ 
                    scale: [1.1, 1, 1.1],
                    rotate: [360, 180, 0]
                  }}
                  transition={{ 
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Village Dedication Footer - Hidden on mobile, shown on desktop */}
      <motion.div
        className="fixed bottom-20 left-0 right-0 text-center z-30 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
          A Digital Temple for the 24-Hour Chanting Tradition of
        </p>
        <p className="text-sm text-amber-400/60 mt-1 tracking-wider font-medium">
          ଚଢେଇଗାଁ • Chadheigaon Village
        </p>
      </motion.div>

      {/* Progress Bar - Adjusted for mobile */}
      <div className="fixed bottom-[72px] sm:bottom-8 left-4 right-4 sm:left-8 sm:right-8 md:left-20 md:right-20 h-0.5 sm:h-1 rounded-full overflow-hidden bg-white/10 z-30">
        <motion.div
          className="h-full transition-all duration-1000 rounded-full"
          style={{
            width: `${(currentPrahari.id / 8) * 100}%`,
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}50`
          }}
          layoutId="progressBar"
        />
      </div>
    </div>
  );
}
