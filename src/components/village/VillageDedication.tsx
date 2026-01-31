'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { usePrahariStore } from '@/store/prahariStore';

export default function VillageDedication() {
  // Store hook reserved for future dynamic theming based on current prahari
  usePrahariStore();

  return (
    <motion.div
      className='fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <div className='max-w-7xl mx-auto px-3 sm:px-4 py-2 md:py-4'>
        <div className='flex items-center justify-center md:justify-between gap-2 md:gap-4'>
          {/* Village Identity - Centered on mobile */}
          <div className='flex items-center gap-2 sm:gap-3'>
            <motion.div
              className='w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 border-amber-500/50 bg-black/30 backdrop-blur-sm'
              animate={{
                boxShadow: [
                  '0 0 10px rgba(251, 191, 36, 0.2)',
                  '0 0 20px rgba(251, 191, 36, 0.4)',
                  '0 0 10px rgba(251, 191, 36, 0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className='text-lg sm:text-xl'>🛕</span>
            </motion.div>

            <div>
              <motion.h1
                className='text-base sm:text-lg md:text-xl font-bold text-amber-100 tracking-wide'
                style={{ textShadow: '0 2px 10px rgba(251, 191, 36, 0.3)' }}
              >
                ଚଢେଇଗାଁ
              </motion.h1>
              <p className='text-[9px] sm:text-[10px] text-white/40 flex items-center gap-1'>
                <MapPin className='w-2 h-2 sm:w-2.5 sm:h-2.5' />
                <span>Puri, Odisha</span>
              </p>
            </div>
          </div>

          {/* Desktop: Festival Info */}
          <div className='hidden md:flex items-center gap-6 text-xs text-white/50'>
            <div className='text-center'>
              <p className='text-amber-400/80 font-medium'>ଆଠ ପ୍ରହରୀ</p>
              <p className='text-[10px] text-white/30'>24-Hour Festival</p>
            </div>
            <div className='flex items-center gap-1'>
              <Calendar className='w-3 h-3 text-amber-400/50' />
              <span>Since Ages</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
