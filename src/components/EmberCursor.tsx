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
  const particleId = useRef(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Add particle
      const newParticle: Particle = {
        id: particleId.current++,
        x: e.clientX,
        y: e.clientY,
        life: 1.0
      };
      
      setParticles(prev => [...prev.slice(-20), newParticle]); // Keep last 20 particles
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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

  return (
    <>
      {/* Particle Trail */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-[100] rounded-full mix-blend-screen"
          style={{
            left: particle.x,
            top: particle.y,
            width: 4 + particle.life * 8,
            height: 4 + particle.life * 8,
            backgroundColor: currentPrahari.colors.accent,
            opacity: particle.life * 0.6,
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
        ref={cursorRef}
        className="fixed pointer-events-none z-[101] w-6 h-6 rounded-full mix-blend-difference"
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
        className="fixed pointer-events-none z-[100] w-12 h-12 rounded-full border border-current opacity-50"
        style={{
          x: cursorX,
          y: cursorY,
          borderColor: currentPrahari.colors.secondary,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
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