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

  return (
    <div className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 transition-colors duration-1000 ${currentPrahari.theme === 'light' ? 'text-black' : 'text-white'}`}>
      {/* Outer decorative ring */}
      <motion.div 
        className="absolute inset-0 border border-current opacity-20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      
      {/* The Wheel */}
      <div 
        ref={wheelRef}
        className="relative w-48 h-48 md:w-64 md:h-64"
      >
        {praharis.map((prahari, index) => {
          const angle = (index * 45) * (Math.PI / 180);
          const radius = 90; // Increased radius slightly
          const x = (Math.cos(angle) * radius - 24).toFixed(4);
          const y = (Math.sin(angle) * radius - 24).toFixed(4);
          
          const isActive = currentPrahari.id === prahari.id;

          return (
            <motion.button
              key={prahari.id}
              onClick={() => handlePrahariClick(prahari.id)}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-xl ${
                isActive 
                  ? (currentPrahari.theme === 'light' ? "bg-black text-white scale-125 z-10" : "bg-white text-black scale-125 z-10")
                  : (currentPrahari.theme === 'light' ? "bg-black/10 text-black/60 hover:bg-black/20" : "bg-white/10 text-white/60 hover:bg-white/20")
              }`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
              animate={{ rotate: totalRotation }}
              transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
              whileHover={{ scale: isActive ? 1.25 : 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              {prahari.id}
              
              {/* Tooltip on hover */}
              <span className="absolute right-full mr-4 whitespace-nowrap text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity hidden md:block pointer-events-none">
                {prahari.nameOdia}
              </span>
            </motion.button>
          ); 
        })}

        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-current opacity-30 rounded-full flex items-center justify-center">
          <motion.div 
            className="w-2 h-2 bg-current rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Current Time Indicator */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-full">
        <motion.p 
          key={currentPrahari.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs opacity-60 font-mono uppercase tracking-widest"
        >
          {currentPrahari.timeRange}
        </motion.p>
      </div>
    </div>
  );
}