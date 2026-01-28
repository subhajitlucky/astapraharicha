"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore, praharis } from "@/store/prahariStore";
import { ChevronUp, X } from "lucide-react";

export default function MobileNavigation() {
  const { currentPrahari, setPrahari, isTransitioning, setTransitioning } = usePrahariStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id: number) => {
    if (isTransitioning || id === currentPrahari.id) {
      setIsOpen(false);
      return;
    }
    
    setTransitioning(true);
    setPrahari(id);
    setIsOpen(false);
    setTimeout(() => setTransitioning(false), 1200);
  };

  return (
    <>
      {/* Current Prahari Indicator (Mobile) */}
      <motion.button
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden backdrop-blur-md border px-6 py-3 rounded-full flex items-center gap-3 ${
          currentPrahari.theme === 'light' 
            ? 'bg-white/40 border-black/10 text-black' 
            : 'bg-black/40 border-white/20 text-white/90'
        }`}
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.95 }}
      >
        <span 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: currentPrahari.colors.accent }}
        />
        <span className="text-sm font-medium">
          {currentPrahari.nameOdia}
        </span>
        <ChevronUp className={`w-4 h-4 ${currentPrahari.theme === 'light' ? 'text-black/60' : 'text-white/60'}`} />
      </motion.button>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-spiritual text-white/90">
                  ସମୟ ଚକ୍ର
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {praharis.map((prahari, index) => (
                  <motion.button
                    key={prahari.id}
                    onClick={() => handleSelect(prahari.id)}
                    className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                      currentPrahari.id === prahari.id
                        ? "bg-white/10 border-white/30"
                        : "bg-transparent border-white/10"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ 
                        backgroundColor: `${prahari.colors.accent}20`,
                        color: prahari.colors.accent,
                        border: `2px solid ${prahari.colors.accent}40`
                      }}
                    >
                      {prahari.id}
                    </span>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-white/90 text-spiritual">
                        {prahari.nameOdia}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                        {prahari.timeRange}
                      </p>
                    </div>
                    {currentPrahari.id === prahari.id && (
                      <motion.div 
                        className="ml-auto w-2 h-2 rounded-full"
                        style={{ backgroundColor: prahari.colors.accent }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-center text-white/40 uppercase tracking-widest">
                  Swipe to navigate between realms
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}