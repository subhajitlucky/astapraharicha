"use client";

import { motion } from "framer-motion";
import { Images, MapPin, Info } from "lucide-react";

interface GalleryToggleProps {
  onOpenGallery: () => void;
  onOpenVillageInfo: () => void;
}

export default function GalleryToggle({ onOpenGallery, onOpenVillageInfo }: GalleryToggleProps) {
  return (
    <>
      {/* Desktop - Left side buttons */}
      <motion.div
        className="fixed left-8 bottom-24 z-50 flex flex-col gap-4 hidden md:flex"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        {/* Photo Gallery Button */}
        <motion.button
          onClick={onOpenGallery}
          className="group flex items-center gap-3"
          whileHover={{ x: 5 }}
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
            <Images className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-xs uppercase tracking-widest text-white/60 group-hover:text-white/90 transition-colors opacity-0 group-hover:opacity-100">
            Gallery
          </span>
        </motion.button>

        {/* Village Info Button */}
        <motion.button
          onClick={onOpenVillageInfo}
          className="group flex items-center gap-3"
          whileHover={{ x: 5 }}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <MapPin className="w-5 h-5 text-white/70" />
          </div>
          <span className="text-xs uppercase tracking-widest text-white/60 group-hover:text-white/90 transition-colors opacity-0 group-hover:opacity-100">
            Village
          </span>
        </motion.button>
      </motion.div>

      {/* Mobile - Bottom bar */}
      <motion.div
        className="fixed bottom-24 left-6 right-6 z-40 md:hidden mb-[env(safe-area-inset-bottom)]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-around border border-white/10">
          <motion.button
            onClick={onOpenGallery}
            className="flex flex-col items-center gap-1"
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Images className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs text-white/60 uppercase tracking-wider">Gallery</span>
          </motion.button>

          <motion.button
            onClick={onOpenVillageInfo}
            className="flex flex-col items-center gap-1"
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <Info className="w-5 h-5 text-white/70" />
            </div>
            <span className="text-xs text-white/60 uppercase tracking-wider">About</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
