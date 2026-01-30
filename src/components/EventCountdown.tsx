"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EventCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(true);

  // Event date: January 31, 2026
  const eventDate = new Date("2026-01-31T00:00:00");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="bg-black/60 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 max-w-sm hidden md:block"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center hover:bg-amber-400 transition-colors"
      >
        ✕
      </button>

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span className="text-xs uppercase tracking-widest text-amber-500">Coming Soon</span>
        </div>
          <h3 className="text-lg font-bold text-white">Asta Prahari 2026</h3>
        <div className="flex items-center gap-2 text-white/50 text-xs mt-1">
          <MapPin className="w-3 h-3" />
          <span>Chadheigaon, Puri, Odisha</span>
        </div>
      </div>

      {/* Countdown */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="bg-amber-500/20 rounded-lg p-2 border border-amber-500/30">
            <span className="text-2xl font-bold text-amber-300 block">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-xs text-amber-500/70 uppercase">Days</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-amber-500/20 rounded-lg p-2 border border-amber-500/30">
            <span className="text-2xl font-bold text-amber-300 block">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-xs text-amber-500/70 uppercase">Hrs</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-amber-500/20 rounded-lg p-2 border border-amber-500/30">
            <span className="text-2xl font-bold text-amber-300 block">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-xs text-amber-500/70 uppercase">Min</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-amber-500/20 rounded-lg p-2 border border-amber-500/30">
            <span className="text-2xl font-bold text-amber-300 block">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-xs text-amber-500/70 uppercase">Sec</span>
          </div>
        </div>
      </div>

      {/* Event Dates */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-white/50 text-xs text-center">
          January 31 - February 2, 2026
        </p>
      </div>
    </motion.div>
  );
}
