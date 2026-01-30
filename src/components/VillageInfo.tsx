"use client";

import { motion } from "framer-motion";
import { X, MapPin, Users, Calendar, History, Heart } from "lucide-react";

interface VillageInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VillageInfo({ isOpen, onClose }: VillageInfoProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-2xl font-bold text-spiritual text-white">About Chadheigaon</h2>
          <p className="text-white/50 text-sm">Home of Asta Prahari</p>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
        {/* Welcome Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-white">Welcome to Chadheigaon</h3>
          </div>
          <p className="text-white/70 leading-relaxed text-lg">
             Chadheigaon is a sacred village nestled in the heart of Puri district, Odisha.
            For generations, our village has been the guardian of an ancient tradition -
             the Asta Prahari, a 24-hour continuous prayer and celebration that brings
            our entire community together in devotion.
          </p>
        </section>

        {/* Location */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-white">Location</h3>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-white/70 mb-4">
              Chadheigaon is located in the Puri district of Odisha, approximately 8 km from the 
              world-famous Jagannath Temple. The village is easily accessible by road from Puri town.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-amber-500 text-sm font-medium mb-1">Distance from Puri</p>
                <p className="text-white text-lg">8 km</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-amber-500 text-sm font-medium mb-1">Distance from Bhubaneswar</p>
                <p className="text-white text-lg">65 km</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-amber-500 text-sm font-medium mb-1">Nearest Railway</p>
                <p className="text-white text-lg">Puri</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Festival */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-amber-500" />
             <h3 className="text-xl font-bold text-white">Asta Prahari Festival</h3>
          </div>
          <p className="text-white/70 leading-relaxed mb-6">
             Asta Prahari is our village&apos;s most important spiritual gathering. &quot;Asta&quot; means eight,
            and &quot;Prahari&quot; refers to the traditional three-hour time periods. During this 24-hour 
            festival, the entire village stays awake, chanting, praying, and celebrating together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-amber-900/20 to-purple-900/20 rounded-xl p-6 border border-amber-500/20">
              <h4 className="text-amber-300 font-bold mb-2">8 Prahari (24 Hours)</h4>
              <p className="text-white/60 text-sm">
                The festival is divided into 8 watches of 3 hours each, from evening to evening. 
                Each prahari has its own rituals, chants, and significance.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-900/20 to-purple-900/20 rounded-xl p-6 border border-amber-500/20">
              <h4 className="text-amber-300 font-bold mb-2">Community Participation</h4>
              <p className="text-white/60 text-sm">
                Every family in the village contributes - whether through cooking, decorating, 
                chanting, or organizing. It&apos;s a true community effort.
              </p>
            </div>
          </div>
        </section>

        {/* History */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <History className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-white">12 Years of Memories</h3>
          </div>
          <p className="text-white/70 leading-relaxed mb-6">
             Since 2014, we have been documenting the Asta Prahari festival through photographs.
            What started as a small collection has grown into a precious archive of 12 years of 
            devotion, celebration, and community spirit.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-white/5 rounded-lg p-4">
              <p className="text-3xl font-bold text-amber-400">12</p>
              <p className="text-white/50 text-sm">Years</p>
            </div>
            <div className="text-center bg-white/5 rounded-lg p-4">
              <p className="text-3xl font-bold text-amber-400">240+</p>
              <p className="text-white/50 text-sm">Photos</p>
            </div>
            <div className="text-center bg-white/5 rounded-lg p-4">
              <p className="text-3xl font-bold text-amber-400">500+</p>
              <p className="text-white/50 text-sm">Families</p>
            </div>
            <div className="text-center bg-white/5 rounded-lg p-4">
              <p className="text-3xl font-bold text-amber-400">∞</p>
              <p className="text-white/50 text-sm">Memories</p>
            </div>
          </div>
        </section>

        {/* Community */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-white">Our Community</h3>
          </div>
          <p className="text-white/70 leading-relaxed">
            Chadheigaon is home to over 500 families who live in harmony and devotion. 
             The Asta Prahari festival is organized entirely by villagers - from the
            youngest children helping with decorations to the elders leading the prayers. 
            It&apos;s a celebration that strengthens our bonds and keeps our traditions alive 
            for future generations.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <p className="text-white/50 text-lg mb-4">
            Join us this January 31 - February 2, 2026
          </p>
          <p className="text-amber-500 text-2xl font-bold">
             Welcome to Chadheigaon Asta Prahari
          </p>
        </section>
      </div>
    </motion.div>
  );
}
