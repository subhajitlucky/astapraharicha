"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { usePrahariStore, type Prahari } from "@/store/prahariStore";
import { memories, years, type Memory } from "@/data/memories";
import Image from "next/image";

export default function TempleCorridor() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const { currentPrahari } = usePrahariStore();
  
  // Filter memories by selected prahari and optional year
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesPrahari = m.prahariId === currentPrahari.id;
      const matchesYear = filterYear ? m.year === filterYear : true;
      return matchesPrahari && matchesYear;
    });
  }, [currentPrahari.id, filterYear]);

  // Expose open function for mobile toolbar
  if (typeof window !== 'undefined') {
    (window as Window & { openTempleCorridor?: () => void }).openTempleCorridor = () => setIsOpen(true);
  }

  return (
    <>
      {/* Floating Toggle Button - Desktop Only */}
      <motion.button
        className="fixed left-6 bottom-28 z-40 hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-4 py-3 rounded-full hover:bg-white/10 transition-colors group"
        onClick={() => setIsOpen(true)}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-xl">🖼️</span>
        <span className="text-sm font-medium text-white/80 hidden md:block">Temple Corridor</span>
        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
          {filteredMemories.length}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <CorridorGallery 
            filteredMemories={filteredMemories}
            currentPrahari={currentPrahari}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
            onClose={() => setIsOpen(false)}
            onSelectMemory={setSelectedMemory}
          />
        )}
      </AnimatePresence>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <MemoryShrine 
            memory={selectedMemory} 
            onClose={() => setSelectedMemory(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CorridorGallery({ 
  filteredMemories, 
  currentPrahari, 
  filterYear, 
  setFilterYear, 
  onClose,
  onSelectMemory
}: {
  filteredMemories: Memory[];
  currentPrahari: Prahari;
  filterYear: number | null;
  setFilterYear: (y: number | null) => void;
  onClose: () => void;
  onSelectMemory: (m: Memory) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Group by year for the timeline view
  const groupedByYear = useMemo(() => {
    const groups: Record<number, Memory[]> = {};
    filteredMemories.forEach(m => {
      if (!groups[m.year]) groups[m.year] = [];
      groups[m.year].push(m);
    });
    return groups;
  }, [filteredMemories]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[51] p-6 bg-gradient-to-b from-black via-black/90 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-spiritual text-white mb-2">
              ସ୍ମୃତି ମନ୍ଦିର
            </h2>
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Temple of Memories • {currentPrahari.nameEn}
            </p>
          </div>
          
          <div className="flex gap-4">
            {/* Year Filter */}
            <select 
              value={filterYear || ""}
              onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : null)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Scroll Gallery */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto pt-32 pb-24 px-6 md:px-20 no-scrollbar"
      >
        {Object.entries(groupedByYear)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, yearMemories]) => (
          <YearSection 
            key={year} 
            year={Number(year)} 
            memories={yearMemories}
            onSelect={onSelectMemory}
          />
        ))}

        {filteredMemories.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/40">
            <p>No memories captured for this time period...</p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 h-48 w-1 bg-white/10 rounded-full overflow-hidden hidden md:block">
        <motion.div 
          className="w-full bg-amber-500 rounded-full"
          style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
        />
      </div>
    </motion.div>
  );
}

function YearSection({ year, memories, onSelect }: { 
  year: number; 
  memories: Memory[]; 
  onSelect: (m: Memory) => void 
}) {
  return (
    <div className="mb-16">
      <motion.div 
        className="flex items-center gap-4 mb-8 sticky top-24 z-10"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <span className="text-4xl font-bold text-white/20 font-mono">{year}</span>
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-sm text-white/40 uppercase tracking-widest">
          {memories.length} moments
        </span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory, index) => (
          <MemoryCard 
            key={memory.id} 
            memory={memory} 
            index={index}
            onClick={() => onSelect(memory)}
          />
        ))}
      </div>
    </div>
  );
}

function MemoryCard({ memory, index, onClick }: { 
  memory: Memory; 
  index: number;
  onClick: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
      
      {/* Image */}
      <Image
        src={memory.thumbnail || memory.url}
        alt={memory.caption}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        onLoad={() => setIsLoaded(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <p className="text-white font-medium text-lg leading-tight">
          {memory.caption}
        </p>
        <div className="flex items-center gap-2 mt-2 text-white/60 text-sm">
          <span>{memory.photographer || "Anonymous"}</span>
          <span>•</span>
          <span>{memory.tags[0] || "Memory"}</span>
        </div>
      </div>

      {/* Corner Decoration */}
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-amber-500/50 transition-colors duration-300" />
    </motion.div>
  );
}

function MemoryShrine({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[52] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-6xl w-full max-h-full flex flex-col md:flex-row gap-8 bg-black/50 border border-white/10 rounded-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="relative flex-1 aspect-[4/3] md:aspect-auto">
          <Image
            src={memory.url}
            alt={memory.caption}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
          
          {/* Floating particles effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs uppercase tracking-widest">
                {memory.year}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-xs uppercase tracking-widest">
                {memory.tags[0]}
              </span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-spiritual text-white mb-4">
              {memory.caption}
            </h3>
            
            {memory.story && (
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                {memory.story}
              </p>
            )}
            
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                📷
              </div>
              <div>
                <p className="text-white/90 font-medium">
                  {memory.photographer || "Village Archive"}
                </p>
                <p className="text-white/40 text-sm">
                  Captured during {memory.year} Asta Prahari
                </p>
              </div>
            </div>

            {/* Navigation hint */}
            <div className="mt-8 text-white/30 text-sm uppercase tracking-widest">
              Click outside to close • Scroll for more memories
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Close button */}
      <button 
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-[53]"
        onClick={onClose}
      >
        ✕
      </button>
    </motion.div>
  );
}
