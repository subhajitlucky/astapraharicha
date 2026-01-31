"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";

interface Particle {
  id: number;
  x: number;
  y: number;
  life: number;
}

export default function EmberCursor() {
  const { currentPrahari } = usePrahariStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const particleId = useRef(0);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Check if desktop on mount
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Mouse/touch move handler
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const newParticle: Particle = {
        id: particleId.current++,
        x: e.clientX,
        y: e.clientY,
        life: 1.0
      };
      
      setParticles(prev => [...prev.slice(-20), newParticle]);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        cursorX.set(touch.clientX);
        cursorY.set(touch.clientY);
        
        const newParticle: Particle = {
          id: particleId.current++,
          x: touch.clientX,
          y: touch.clientY,
          life: 1.0
        };
        
        setParticles(prev => [...prev.slice(-20), newParticle]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [cursorX, cursorY]);

  // Fade out particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({ ...p, life: p.life - 0.05 }))
          .filter(p => p.life > 0)
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Don't render on mobile/tablet
  if (!isDesktop) {
    return null;
  }

  return (
    <>
      {/* Particle Trail */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-[100] rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: 4 + particle.life * 8,
            height: 4 + particle.life * 8,
            backgroundColor: currentPrahari.colors.accent,
            opacity: particle.life * 0.8,
            boxShadow: `0 0 ${10 * particle.life}px ${currentPrahari.colors.accent}`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}
      
      {/* Main Cursor Glow */}
      <motion.div
        className="fixed pointer-events-none z-[100] w-6 h-6 rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          backgroundColor: currentPrahari.colors.accent,
          boxShadow: `0 0 20px ${currentPrahari.colors.accent}, 0 0 40px ${currentPrahari.colors.accent}`,
          transform: "translate(-50%, -50%)",
        }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed pointer-events-none z-[99] w-12 h-12 rounded-full border-2"
        style={{
          x: cursorX,
          y: cursorY,
          borderColor: currentPrahari.colors.secondary,
          opacity: 0.8,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0.3, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}
