"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAnimationFrame } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  curve: number;
  opacity: number;
}

export default function PushpaVrishti() {
  const { currentPrahari } = usePrahariStore();
  const [petals, setPetals] = useState<Petal[]>([]);
  const petalCount = 12;
  const nextId = useRef(0);

  const createPetal = useCallback((randomY = false): Petal => ({
    id: nextId.current++,
    x: Math.random() * 100,
    y: randomY ? Math.random() * 100 : -10,
    size: 10 + Math.random() * 15,
    rotation: Math.random() * 360,
    speed: 0.1 + Math.random() * 0.2,
    curve: (Math.random() - 0.5) * 0.02,
    opacity: 0.2 + Math.random() * 0.4
  }), []);

  useEffect(() => {
    // Avoid cascading renders warning
    const frame = requestAnimationFrame(() => {
      const initial = Array.from({ length: petalCount }).map(() => createPetal(true));
      setPetals(initial);
    });
    return () => cancelAnimationFrame(frame);
  }, [createPetal]);

  useAnimationFrame((time) => {
    setPetals(prev => prev.map(p => {
      const newY = p.y + p.speed;
      const newX = p.x + Math.sin(time / 1000 + p.id) * 0.05;
      
      if (newY > 110) {
        return createPetal();
      }
      
      return { ...p, x: newX, y: newY, rotation: p.rotation + 0.5 };
    }));
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: `${petal.y}%`,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation}deg)`,
            filter: `drop-shadow(0 0 5px ${currentPrahari.colors.accent})`
          }}
        >
          <svg viewBox="0 0 100 100" fill={currentPrahari.colors.accent}>
            <path d="M50 0 C70 30 100 50 50 100 C0 50 30 30 50 0" />
          </svg>
        </div>
      ))}
    </div>
  );
}
