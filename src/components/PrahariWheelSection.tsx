"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore, praharis } from "@/store/prahariStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PrahariWheelSection() {
  const { currentPrahari, setPrahari } = usePrahariStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrevious = () => {
    const newIndex = (activeIndex - 1 + 8) % 8;
    setActiveIndex(newIndex);
    setPrahari(newIndex + 1);
  };

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % 8;
    setActiveIndex(newIndex);
    setPrahari(newIndex + 1);
  };

  const handlePrahariClick = (index: number) => {
    setActiveIndex(index);
    setPrahari(index + 1);
  };

  const activePrahari = praharis[activeIndex];

  return (
    <div className="relative bg-black/40 rounded-3xl border border-white/10 p-8 md:p-12 overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${activePrahari.colors.primary}40 0%, transparent 70%)` 
        }}
      />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: The Wheel */}
        <div className="relative flex items-center justify-center">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* The Circular Wheel */}
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            
            {/* Prahari Dots */}
            {praharis.map((prahari, index) => {
              const angle = (index * 45 - 90) * (Math.PI / 180); // Start from top
              const radius = 140; // Fixed radius for SSR consistency
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isActive = index === activeIndex;
              
              return (
                <motion.button
                  key={prahari.id}
                  onClick={() => handlePrahariClick(index)}
                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    isActive 
                      ? "bg-amber-500 text-black scale-125 shadow-lg shadow-amber-500/30"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  } ${mounted ? 'md:scale-110' : ''}`}
                  style={{
                    left: `calc(50% + ${x.toFixed(2)}px - 24px)`,
                    top: `calc(50% + ${y.toFixed(2)}px - 24px)`,
                  }}
                  whileHover={{ scale: isActive ? 1.25 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {prahari.id}
                </motion.button>
              );
            })}
            
            {/* Center Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/40 flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(245, 158, 11, 0.2)",
                    "0 0 40px rgba(245, 158, 11, 0.4)",
                    "0 0 20px rgba(245, 158, 11, 0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl md:text-5xl font-bold text-amber-400">
                  {String(activePrahari.id).padStart(2, '0')}
                </span>
              </motion.div>
            </div>
            
            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45 - 90) * (Math.PI / 180);
                const innerRadius = 40;
                const outerRadius = 130; // Fixed radius for SSR consistency
                const x1 = 50 + (Math.cos(angle) * innerRadius / 3);
                const y1 = 50 + (Math.sin(angle) * innerRadius / 3);
                const x2 = 50 + (Math.cos(angle) * outerRadius / 3);
                const y2 = 50 + (Math.sin(angle) * outerRadius / 3);
                
                return (
                  <line
                    key={i}
                    x1={`${x1.toFixed(2)}%`}
                    y1={`${y1.toFixed(2)}%`}
                    x2={`${x2.toFixed(2)}%`}
                    y2={`${y2.toFixed(2)}%`}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Content */}
        <div className="text-center lg:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePrahari.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Phase Badge */}
              <span 
                className="inline-block px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-4"
                style={{ 
                  backgroundColor: `${activePrahari.colors.accent}20`,
                  color: activePrahari.colors.accent,
                  border: `1px solid ${activePrahari.colors.accent}40`
                }}
              >
                {activePrahari.phase}
              </span>
              
              {/* Odia Name */}
              <h3 className="text-4xl md:text-5xl font-bold mb-2 text-spiritual">
                {activePrahari.nameOdia}
              </h3>
              
              {/* English Name */}
              <p className="text-xl text-white/60 mb-6">
                {activePrahari.nameEn}
              </p>
              
              {/* Time Range */}
              <p className="text-amber-500 font-mono mb-6">
                {activePrahari.timeRange}
              </p>
              
              {/* Significance */}
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                {activePrahari.significance}
              </p>
              
              {/* Mantra */}
              <div 
                className="inline-block px-6 py-3 rounded-xl text-lg font-medium"
                style={{ 
                  backgroundColor: `${activePrahari.colors.secondary}15`,
                  color: activePrahari.colors.accent,
                  border: `1px solid ${activePrahari.colors.secondary}30`
                }}
              >
                {activePrahari.mantra}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Bottom: Progress Indicators */}
      <div className="relative z-10 mt-12 flex justify-center gap-2">
        {praharis.map((prahari, index) => (
          <button
            key={prahari.id}
            onClick={() => handlePrahariClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? "w-8 bg-amber-500" 
                : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
