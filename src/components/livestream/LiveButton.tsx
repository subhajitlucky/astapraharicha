"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Video, Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LiveButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleGoLive = () => {
    setIsOpen(false);
    router.push("/live/broadcast");
  };

  const handleWatchLive = () => {
    setIsOpen(false);
    router.push("/live");
  };

  return (
    <>
      {/* Live Button - Fixed Position */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-red-600 hover:bg-red-700 rounded-full shadow-lg shadow-red-600/40 transition-colors cursor-pointer"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing dot */}
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-white font-semibold text-sm md:text-base">LIVE</span>
        <Radio className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[201] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-sm bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-amber-500/20 p-6 shadow-2xl"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                  >
                    <Radio className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-amber-100">🪔 Live Darshan</h2>
                  <p className="text-amber-200/60 text-sm mt-1">
                    Join the divine ceremony
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {/* Go Live Button */}
                  <motion.button
                    onClick={handleGoLive}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-2xl text-white transition-all group"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Video className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg">Go Live</p>
                      <p className="text-white/70 text-sm">Start broadcasting</p>
                    </div>
                  </motion.button>

                  {/* Watch Live Button */}
                  <motion.button
                    onClick={handleWatchLive}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl text-amber-100 transition-all group"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                      <Eye className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg">Watch Live</p>
                      <p className="text-amber-200/60 text-sm">View the broadcast</p>
                    </div>
                  </motion.button>
                </div>

                {/* Footer */}
                <p className="text-center text-amber-200/40 text-xs mt-6">
                  ଜୟ ଜଗନ୍ନାଥ • Divine streaming
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
