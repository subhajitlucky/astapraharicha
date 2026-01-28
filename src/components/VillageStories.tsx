"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";

interface Story {
  id: number;
  prahariId: number;
  title: string;
  content: string;
  image?: string;
  year: number;
}

const dummyStories: Story[] = [
  {
    id: 1,
    prahariId: 3,
    title: "The Midnight Bell",
    content: "In 2019, during the 3rd Prahari, the temple bell rang 108 times without human touch. Elders say it was Jagannath Himself acknowledging our devotion.",
    year: 2019
  },
  {
    id: 2,
    prahariId: 7,
    title: "The Sun Alignment",
    content: "Every year, during the 7th Prahari, the sun hits the Garuda pillar at exactly 12:47 PM, creating a rainbow inside the sanctum.",
    year: 2023
  },
  {
    id: 3,
    prahariId: 1,
    title: "First Light Offering",
    content: "As the lamps are lit at 6 PM, the entire village goes silent for 11 minutes. No vehicles, no voices—only the first chant of ଜୟ ଜଗନ୍ନାଥ.",
    year: 2024
  }
];

export default function VillageStories() {
  const { currentPrahari } = usePrahariStore();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  const relevantStories = dummyStories.filter(s => s.prahariId === currentPrahari.id);

  if (relevantStories.length === 0) return null;

  return (
    <>
      <motion.div 
        className="fixed left-8 bottom-32 z-30 max-w-xs"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
          Village Lore
        </h4>
        
        <div className="space-y-3">
          {relevantStories.map((story) => (
            <motion.button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="w-full text-left p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-colors group"
              whileHover={{ x: 5 }}
            >
              <span className="text-xs text-amber-500/80 font-mono">{story.year}</span>
              <h5 className="text-sm font-medium text-white/90 mt-1 group-hover:text-amber-200 transition-colors">
                {story.title}
              </h5>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              className="max-w-lg w-full bg-black border border-white/10 p-8 rounded-2xl relative overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative background */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl"
                style={{ backgroundColor: currentPrahari.colors.accent }}
              />
              
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                {currentPrahari.nameEn} • {selectedStory.year}
              </span>
              
              <h3 className="text-2xl font-bold text-spiritual mt-2 mb-4 text-amber-100">
                {selectedStory.title}
              </h3>
              
              <p className="text-white/70 leading-relaxed text-lg">
                {selectedStory.content}
              </p>
              
              <button 
                onClick={() => setSelectedStory(null)}
                className="mt-6 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Close Story
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}