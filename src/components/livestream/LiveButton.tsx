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
      {/* Live Button - Fixed top-right corner on all screens */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-[100] flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-red-600 hover:bg-red-700 rounded-full shadow-lg shadow-red-600/40 transition-colors cursor-pointer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing dot */}
        <motion.span
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-white font-semibold text-xs sm:text-sm md:text-base">LIVE</span>
        <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
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
                className="relative w-full max-w-[90%] sm:max-w-sm bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl sm:rounded-3xl border border-amber-500/20 p-4 sm:p-6 shadow-2xl"
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
                <div className="text-center mb-4 sm:mb-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                  >
                    <Radio className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-100">🪩 Live Darshan</h2>
                  <p className="text-amber-200/60 text-xs sm:text-sm mt-1">
                    Join the divine ceremony
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Go Live Button */}
                  <motion.button
                    onClick={handleGoLive}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl sm:rounded-2xl text-white transition-all group"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
                      <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-base sm:text-lg">Go Live</p>
                      <p className="text-white/70 text-xs sm:text-sm">Start broadcasting</p>
                    </div>
                  </motion.button>

                  {/* Watch Live Button */}
                  <motion.button
                    onClick={handleWatchLive}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-amber-500/30 hover:border-amber-500/50 rounded-xl sm:rounded-2xl text-amber-100 transition-all group"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors flex-shrink-0">
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-base sm:text-lg">Watch Live</p>
                      <p className="text-amber-200/60 text-xs sm:text-sm">View the broadcast</p>
                    </div>
                  </motion.button>
                </div>

                {/* Footer */}
                <p className="text-center text-amber-200/40 text-[10px] sm:text-xs mt-4 sm:mt-6">
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
