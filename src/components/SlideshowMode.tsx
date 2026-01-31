"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { memories } from "@/data/memories";

export default function SlideshowMode() {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledMemories, setShuffledMemories] = useState(memories);
  
  const handleStart = () => {
    setShuffledMemories([...memories].sort(() => Math.random() - 0.5));
    setIsActive(true);
  };

  // Expose start function for mobile toolbar
  if (typeof window !== 'undefined') {
    (window as Window & { startSlideshow?: () => void }).startSlideshow = handleStart;
  }
  
  useEffect(() => {
    if (!isActive || shuffledMemories.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledMemories.length);
    }, 8000); // 8 seconds per image (slow, meditative)
    
    return () => clearInterval(interval);
  }, [isActive, shuffledMemories.length]);

  if (!isActive) {
    return (
      <motion.button
        className="fixed right-8 bottom-10 z-30 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm uppercase tracking-widest hover:bg-white/20 transition-colors hidden md:block"
        onClick={handleStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        Start Slideshow
      </motion.button>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[300] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsActive(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          {shuffledMemories[currentIndex] && (
            <>
              <Image
                src={shuffledMemories[currentIndex].url}
                alt={shuffledMemories[currentIndex].caption}
                fill
                className="object-cover"
                priority
              />
              
              {/* Vignette */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Info Overlay */}
              <motion.div 
                className="absolute bottom-12 left-12 right-12 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-2xl font-light mb-2">{shuffledMemories[currentIndex].caption}</h3>
                <p className="text-white/60 text-sm uppercase tracking-widest">
                  {shuffledMemories[currentIndex].year} • {shuffledMemories[currentIndex].photographer || "Village Archive"}
                </p>
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div 
          className="h-full bg-amber-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear" }}
          key={currentIndex}
        />
      </div>
      
      <div className="absolute top-6 right-6 text-white/40 text-sm uppercase tracking-widest">
        Click to exit slideshow
      </div>
    </motion.div>
  );
}