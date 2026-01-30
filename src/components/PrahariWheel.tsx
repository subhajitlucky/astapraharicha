"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { usePrahariStore, praharis } from "@/store/prahariStore";
import gsap from "gsap";

export default function PrahariWheel() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const { currentPrahari, setPrahari, isTransitioning, setTransitioning, totalRotation, setTotalRotation } = usePrahariStore();

  // Sync GSAP rotation with totalRotation from store
  useEffect(() => {
    if (wheelRef.current) {
      gsap.to(wheelRef.current, {
        rotation: -totalRotation,
        duration: 1.2,
        ease: "power3.inOut"
      });
    }
  }, [totalRotation]);

  const handlePrahariClick = (id: number) => {
    if (isTransitioning || id === currentPrahari.id) return;
    
    setTransitioning(true);
    
    // Calculate shortest rotation path
    const currentId = currentPrahari.id;
    let delta = id - currentId;
    
    // Shortest path logic for cyclic 8-spoke wheel
    if (delta > 4) delta -= 8;
    if (delta < -4) delta += 8;
    
    setTotalRotation(totalRotation + (delta * 45));
    setPrahari(id);
    
    // setTransitioning(false) will happen via timeout in PrahariRealm or similar if needed,
    // but here we can just set it after the animation duration
    setTimeout(() => setTransitioning(false), 1200);
  };

  const accentColor = currentPrahari.colors.accent;
  const secondaryColor = currentPrahari.colors.secondary;

  return (
    <div className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 transition-colors duration-1000 ${currentPrahari.theme === 'light' ? 'text-black' : 'text-white'}`}>
      {/* Outer decorative ring with accent color */}
      <motion.div 
        className="absolute inset-0 border-2 rounded-full"
        style={{ borderColor: `${accentColor}30` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Secondary ring */}
      <motion.div 
        className="absolute inset-2 border rounded-full"
        style={{ borderColor: `${secondaryColor}20` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />
      
      {/* The Wheel */}
      <div 
        ref={wheelRef}
        className="relative w-48 h-48 md:w-64 md:h-64"
      >
        {praharis.map((prahari, index) => {
          const angle = (index * 45) * (Math.PI / 180);
          const radius = 90;
          const x = (Math.cos(angle) * radius - 24).toFixed(4);
          const y = (Math.sin(angle) * radius - 24).toFixed(4);
          
          const isActive = currentPrahari.id === prahari.id;

          const isDarkTheme = prahari.theme === 'dark';
          const isLightAccent = ['#e0e1dd', '#faedcd', '#fefae0'].includes(prahari.colors.accent);
          
          return (
            <motion.button
              key={prahari.id}
              onClick={() => handlePrahariClick(prahari.id)}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-xl group ${
                isActive 
                  ? "scale-125 z-10"
                  : "hover:scale-110"
              }`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                backgroundColor: isActive ? accentColor : (isDarkTheme ? `${prahari.colors.accent}25` : `${prahari.colors.accent}15`),
                color: isActive 
                  ? (isLightAccent ? '#000' : (currentPrahari.theme === 'light' ? '#000' : '#fff')) 
                  : prahari.colors.accent,
                boxShadow: isActive ? `0 0 25px ${accentColor}80` : `0 0 8px ${prahari.colors.accent}30`,
                border: `2px solid ${isActive ? accentColor : prahari.colors.accent}`,
                textShadow: isActive ? 'none' : `0 0 4px ${prahari.colors.accent}50`
              }}
              animate={{ rotate: totalRotation }}
              transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
              whileHover={{ scale: isActive ? 1.25 : 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              {prahari.id}
              
              {/* Tooltip on hover */}
              <span 
                className="absolute right-full mr-4 whitespace-nowrap text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity hidden md:block pointer-events-none px-2 py-1 rounded"
                style={{ 
                  backgroundColor: `${prahari.colors.accent}20`,
                  color: prahari.colors.accent
                }}
              >
                {prahari.nameOdia}
              </span>
            </motion.button>
          ); 
        })}

        {/* Center Hub with accent color */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 rounded-full flex items-center justify-center bg-black/20"
          style={{ borderColor: `${accentColor}60` }}
        >
          <motion.div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 0 15px ${accentColor}, 0 0 30px ${accentColor}60`
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Current Time Indicator with accent color */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-full">
        <motion.div
          key={currentPrahari.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-lg" style={{ color: accentColor }}>
            {currentPrahari.id <= 4 ? '🌙' : '☀️'}
          </span>
          <p 
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            {currentPrahari.timeRange}
          </p>
          <p
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${secondaryColor}20`,
              color: secondaryColor
            }}
          >
            {currentPrahari.id <= 4 ? 'Night Cycle' : 'Day Cycle'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}