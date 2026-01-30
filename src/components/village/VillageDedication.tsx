'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Users } from 'lucide-react';
import { usePrahariStore } from '@/store/prahariStore';

export default function VillageDedication() {
  const { currentPrahari } = usePrahariStore();

  return (
    <motion.div
      className='fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <div className='max-w-7xl mx-auto px-4 py-2 md:py-6'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4'>
          {/* Left: Village Identity */}
          <div className='flex items-center gap-3 text-center md:text-left'>
            <motion.div
              className='w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 border-amber-500/50 bg-black/30 backdrop-blur-sm'
              animate={{
                boxShadow: [
                  '0 0 10px rgba(251, 191, 36, 0.2)',
                  '0 0 20px rgba(251, 191, 36, 0.4)',
                  '0 0 10px rgba(251, 191, 36, 0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className='text-xl md:text-2xl'>🛕</span>
            </motion.div>

            <div>
              <motion.h1
                className='text-lg md:text-2xl font-bold text-amber-100 tracking-wide'
                style={{ textShadow: '0 2px 10px rgba(251, 191, 36, 0.3)' }}
              >
                ଚାଢେଇଗାଁ
              </motion.h1>
              <p className='text-xs text-white/50 flex items-center justify-center md:justify-start gap-1'>
                <MapPin className='w-3 h-3' />
                <span>Chadheigaon, Puri, Odisha</span>
              </p>
            </div>
          </div>

          {/* Center: Festival Name */}
          <div className='hidden md:flex flex-col items-center'>
            <p className='text-[10px] uppercase tracking-[0.3em] text-amber-400/70 mb-1'>Presents</p>
            <h2 className='text-xl font-bold text-white/90 tracking-wider'>ଆଠ ପ୍ରହରୀ</h2>
            <p className='text-xs text-white/40 tracking-widest uppercase'>24-Hour Chanting Festival</p>
          </div>

          {/* Right: Festival Info */}
          <div className='hidden md:flex items-center gap-4 text-xs text-white/40'>
            <div className='flex items-center gap-1'>
              <Calendar className='w-3 h-3 text-amber-400/60' />
              <span>Since Ages</span>
            </div>
            <div className='flex items-center gap-1'>
              <Users className='w-3 h-3 text-amber-400/60' />
              <span>Village Tradition</span>
            </div>
          </div>

          {/* Mobile: Simple subtitle */}
          <div className='md:hidden text-center'>
            <p className='text-[10px] uppercase tracking-[0.2em] text-amber-400/70'>Asta Prahari Festival</p>
          </div>
        </div>

        {/* Decorative Line - Hidden on mobile */}
        <motion.div
          className='mt-2 md:mt-3 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent hidden md:block'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1 }}
        />
      </div>
    </motion.div>
  );
}
