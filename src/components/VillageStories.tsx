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
    prahariId: 1,
    title: "First Light Offering",
    content: "As the sun rises at 6 AM, the entire village awakens to the sound of conch shells. The first rays of light touch the temple spire as priests begin the mangala arati.",
    year: 2024
  },
  {
    id: 2,
    prahariId: 2,
    title: "The Morning Bell",
    content: "During the 2nd Prahari, the temple bell rings in a special rhythm—three chimes followed by silence. Devotees know this signals the distribution of prasad.",
    year: 2023
  },
  {
    id: 3,
    prahariId: 3,
    title: "The Noon Silence",
    content: "At the peak of noon, when the 3rd Prahari reaches its height, even the birds go quiet. The temple courtyard becomes a meditation ground.",
    year: 2022
  },
  {
    id: 4,
    prahariId: 4,
    title: "The Afternoon Shadows",
    content: "As the afternoon sun casts long shadows, the temple doors prepare to close for the evening rituals. Devotees hurry to offer their last prayers.",
    year: 2021
  },
  {
    id: 5,
    prahariId: 5,
    title: "Evening Lamp Lighting",
    content: "At dusk, hundreds of oil lamps are lit around the temple. The flickering flames create a river of light that guides the divine presence.",
    year: 2020
  },
  {
    id: 6,
    prahariId: 6,
    title: "The Night Watch Begins",
    content: "As darkness falls, the night watch begins. The temple guards chant protection mantras while the village settles into peaceful slumber.",
    year: 2019
  },
  {
    id: 7,
    prahariId: 7,
    title: "The Midnight Void",
    content: "In the deepest hour of the 7th Prahari, the temple lamps flicker with a blue flame. Elders say this is when the veil between worlds is thinnest.",
    year: 2018
  },
  {
    id: 8,
    prahariId: 8,
    title: "Brahma Muhurta Awakening",
    content: "In the sacred hours before dawn, the world is reborn. The first morning star signals the awakening of the gods and the beginning of a new day.",
    year: 2017
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
        className="fixed left-8 bottom-48 z-30 max-w-xs hidden md:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
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
              <h5 className="text-sm font-medium text-white/90 group-hover:text-amber-200 transition-colors">
                {story.title}
              </h5>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
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
                {currentPrahari.nameEn}
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