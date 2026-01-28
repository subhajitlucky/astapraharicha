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
    const hour = new Date().getHours();
    let prahariId = 1;
    
    if (hour >= 18 && hour < 21) prahariId = 1;
    else if (hour >= 21 || hour < 0) prahariId = 2;
    else if (hour >= 0 && hour < 3) prahariId = 3;
    else if (hour >= 3 && hour < 6) prahariId = 4;
    else if (hour >= 6 && hour < 9) prahariId = 5;
    else if (hour >= 9 && hour < 12) prahariId = 6;
    else if (hour >= 12 && hour < 15) prahariId = 7;
    else if (hour >= 15 && hour < 18) prahariId = 8;
    
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
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
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

          {/* Central Content */}
          <div className="relative z-10 text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 text-spiritual mb-4">
                ଆଠ ପ୍ରହରୀ
              </h1>
              <p className="text-white/40 text-lg tracking-[0.4em] uppercase font-light">
                The Eternal Cycle of Time
              </p>
            </motion.div>

            {/* Progress Mandala */}
            <div className="relative w-48 h-48 mx-auto">
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

            <motion.p 
              className="text-white/30 text-sm tracking-widest uppercase"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {progress < 30 && "Purifying space..."}
              {progress >= 30 && progress < 60 && "Invoking the 8 Prahars..."}
              {progress >= 60 && progress < 90 && "Aligning temporal currents..."}
              {progress >= 90 && "Opening the gates..."}
            </motion.p>
          </div>

          <button 
            onClick={() => setShowCeremony(false)}
            className="absolute bottom-12 text-[10px] text-white/20 uppercase tracking-[0.5em] hover:text-white/60 transition-colors"
          >
            Enter Sanctuary
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
