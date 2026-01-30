"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";

export default function EntryCeremony() {
  const [isMounted, setIsMounted] = useState(false);
  const [showCeremony, setShowCeremony] = useState(true);
  const [progress, setProgress] = useState(0);
  const { setPrahari } = usePrahariStore();

  useEffect(() => {
    // Avoid cascading renders warning
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    
    // Auto-detect current real-time prahari on entry
    // Prahari 1 starts at 6:00 AM
    const hour = new Date().getHours();
    let prahariId = 1;
    
    if (hour >= 6 && hour < 9) prahariId = 1;      // 6 AM - 9 AM
    else if (hour >= 9 && hour < 12) prahariId = 2; // 9 AM - 12 PM
    else if (hour >= 12 && hour < 15) prahariId = 3; // 12 PM - 3 PM
    else if (hour >= 15 && hour < 18) prahariId = 4; // 3 PM - 6 PM
    else if (hour >= 18 && hour < 21) prahariId = 5; // 6 PM - 9 PM
    else if (hour >= 21 || hour < 0) prahariId = 6; // 9 PM - 12 AM
    else if (hour >= 0 && hour < 3) prahariId = 7;  // 12 AM - 3 AM
    else if (hour >= 3 && hour < 6) prahariId = 8;  // 3 AM - 6 AM
    
    setPrahari(prahariId);

    return () => cancelAnimationFrame(frame);
  }, [setPrahari]);

  // Loading ritual progression
  useEffect(() => {
    if (!showCeremony) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowCeremony(false), 800);
          return 100;
        }
        return prev + 1.5; // Meditative pace
      });
    }, 60);
    
    return () => clearInterval(interval);
  }, [showCeremony]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {showCeremony && (
        <motion.div
          key="entry-ceremony"
          className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
        >
          {/* Generating Mandala Background */}
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              background: [
                "radial-gradient(circle at 50% 50%, #1a0b2e 0%, #000000 100%)",
                "radial-gradient(circle at 50% 50%, #2d00f7 0%, #000000 100%)",
                "radial-gradient(circle at 50% 50%, #fb8500 0%, #000000 100%)",
                "radial-gradient(circle at 50% 50%, #1a0b2e 0%, #000000 100%)",
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* Rotating Yantra Lines */}
          <motion.div
            className="absolute w-96 h-96 border border-white/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-80 h-80 border border-white/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-64 h-64 border border-amber-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Odia Characters */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {["ଓଁ", "ଜୟ", "ଜଗନ୍ନାଥ"].map((char, i) => (
              <motion.span
                key={i}
                className="absolute text-9xl font-bold text-white/5 text-spiritual"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 0.15, 0],
                  scale: [0.8, 1.2, 1.5],
                }}
                transition={{ 
                  duration: 4,
                  delay: i * 2,
                  repeat: Infinity,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Central Content - Dedication to Chadheigaon */}
          <div className="relative z-10 text-center space-y-8 px-4 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              {/* Village Name - Most Prominent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-2"
              >
                <span className="text-sm md:text-base text-amber-400/80 uppercase tracking-[0.3em] font-medium">
                  Dedicated to
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 text-spiritual mb-2">
                ଚଢେଇଗାଁ
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-medium tracking-wider mb-1">
                Chadheigaon Village
              </p>
              <p className="text-sm text-white/40 tracking-widest">
                Puri District, Odisha
              </p>
            </motion.div>

            {/* Separator */}
            <motion.div
              className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Festival Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white/90 text-spiritual mb-3">
                ଆଠ ପ୍ରହରୀ
              </h2>
              <p className="text-amber-400/80 text-lg md:text-xl tracking-wider font-light">
                24-Hour Continuous Chanting Festival
              </p>
              <p className="text-white/30 text-sm mt-2 tracking-[0.2em] uppercase">
                A Sacred Tradition Since Generations
              </p>
            </motion.div>

            {/* Progress Mandala */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{ 
                  borderTopColor: "#f7931e",
                  rotate: progress * 3.6 
                }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-light text-amber-500 font-mono">
                  {Math.floor(progress)}%
                </span>
              </div>

              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                const x = (Math.cos(deg * Math.PI / 180) * 90 - 4).toFixed(4);
                const y = (Math.sin(deg * Math.PI / 180) * 90 - 4).toFixed(4);
                return (
                  <motion.div
                    key={deg}
                    className="absolute w-2 h-2 bg-amber-500 rounded-full"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: progress > (i * 12.5) ? 1 : 0.3 }}
                  />
                );
              })}
            </div>

            {/* Progress Text with Village Context */}
            <motion.p
              className="text-white/30 text-sm tracking-widest uppercase"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {progress < 30 && "Awakening the village temple..."}
              {progress >= 30 && progress < 60 && "Gathering 8 prahars of devotion..."}
              {progress >= 60 && progress < 90 && "Uniting villagers worldwide..."}
              {progress >= 90 && "Opening the digital temple..."}
            </motion.p>

            {/* Village Blessing */}
            <motion.div
              className="text-white/20 text-xs tracking-[0.2em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              ଜୟ ଜଗନ୍ନାଥ • Jai Jagannath
            </motion.div>
          </div>

          <button
            onClick={() => setShowCeremony(false)}
            className="absolute bottom-6 md:bottom-12 text-xs text-amber-400/60 hover:text-amber-400 uppercase tracking-[0.5em] transition-colors px-6 py-3 border border-amber-500/30 rounded-full hover:bg-amber-500/10"
          >
            Enter the Sacred Space
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
