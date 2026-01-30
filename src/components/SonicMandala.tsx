"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { usePrahariStore } from "@/store/prahariStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";

export default function SonicMandala() {
  const { currentPrahari, isTransitioning } = usePrahariStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const isInitialized = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Notes for each Prahari (Carnatic/Western hybrid frequencies)
  const getFrequencies = useCallback((prahariId: number) => {
    const baseFrequencies: Record<number, number[]> = {
      1: [130.81, 196.00, 261.63, 392.00], // Twilight
      2: [146.83, 220.00, 293.66, 440.00], // Night
      3: [110.00, 164.81, 220.00, 329.63], // Midnight
      4: [164.81, 246.94, 329.63, 493.88], // Brahma Muhurta
      5: [174.61, 261.63, 349.23, 523.25], // Dawn
      6: [196.00, 293.66, 392.00, 587.33], // Morning
      7: [220.00, 329.63, 440.00, 659.25], // Noon
      8: [185.00, 277.18, 369.99, 554.37], // Afternoon
    };
    return baseFrequencies[prahariId] || baseFrequencies[1];
  }, []);

  const updateDrone = useCallback((prahariId: number) => {
    if (!audioContextRef.current || !isInitialized.current) return;
    
    const freqs = getFrequencies(prahariId);
    const ctx = audioContextRef.current;
    
    oscillatorsRef.current.forEach((osc, i) => {
      if (gainNodesRef.current[i]) {
        gainNodesRef.current[i].gain.setTargetAtTime(0, ctx.currentTime, 1.5);
      }
      setTimeout(() => {
        try { osc.stop(); osc.disconnect(); } catch {}
      }, 1600);
    });
    
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
    
    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.value = (Math.random() - 0.5) * 8;
      
      filter.type = 'lowpass';
      filter.frequency.value = 600 + (index * 150);
      
      const now = ctx.currentTime;
      const intensity = currentPrahari.intensity;
      const baseGain = 0.06 - (index * 0.01);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(baseGain, now + 2);
      
      const pluckSpeed = (4 - intensity) * 2.5;
      
      const pluck = () => {
        if (!isInitialized.current || !gain.gain) return;
        try {
          const time = ctx.currentTime;
          gain.gain.setTargetAtTime(baseGain, time, 0.1);
          gain.gain.setTargetAtTime(baseGain * 0.4, time + 0.1, pluckSpeed);
          setTimeout(pluck, (pluckSpeed * 1000) + (Math.random() * 200));
        } catch {}
      };
      
      setTimeout(pluck, index * 800);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorsRef.current.push(osc);
      gainNodesRef.current.push(gain);
    });
  }, [currentPrahari.intensity, getFrequencies]);

  const toggleAudio = async () => {
    if (!isInitialized.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      isInitialized.current = true;
      setIsPlaying(true);
      updateDrone(currentPrahari.id);
      return;
    }

    if (audioContextRef.current?.state === 'running') {
      await audioContextRef.current.suspend();
      setIsPlaying(false);
    } else {
      await audioContextRef.current?.resume();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isInitialized.current && !isTransitioning && isPlaying) {
      updateDrone(currentPrahari.id);
    }
  }, [currentPrahari.id, isTransitioning, isPlaying, updateDrone]);

  return (
    <motion.button
      onClick={toggleAudio}
      className={`fixed bottom-32 md:bottom-8 left-1/2 -translate-x-1/2 z-[45] flex items-center gap-2 md:gap-4 backdrop-blur-xl px-3 md:px-6 py-2 md:py-3 rounded-full border transition-all group ${
        currentPrahari.theme === 'light'
          ? 'bg-white/40 border-black/10 text-black'
          : 'bg-black/40 border-white/10 text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-colors ${
        currentPrahari.theme === 'light' ? 'bg-black/5 group-hover:bg-black/10' : 'bg-white/5 group-hover:bg-white/10'
      }`}>
        {isPlaying ? (
          <Pause className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
        ) : (
          <Play className="w-3 h-3 md:w-4 md:h-4 ml-0.5" fill="currentColor" />
        )}
      </div>

      <div className="flex flex-col items-start">
        <span className="text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-medium">
          {isPlaying ? 'Sonic Active' : 'Awaken Sound'}
        </span>
        <span className={`hidden md:block text-xs uppercase tracking-[0.2em] ${currentPrahari.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>
          {currentPrahari.mantra} • {currentPrahari.phase}
        </span>
      </div>
      
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex gap-1 ml-2 items-center h-4 overflow-hidden"
          >
            {[1,2,3,4,5].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-current rounded-full"
                style={{ backgroundColor: currentPrahari.colors.accent }}
                animate={{
                  height: [4, 14 + (currentPrahari.intensity * 10), 4],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 0.6 + (i * 0.15),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
