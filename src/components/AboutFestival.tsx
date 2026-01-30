"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Flame, Users, Heart, Sun, Moon } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "24 Hours",
    subtitle: "Continuous Devotion",
    description: "One full day and night of uninterrupted prayer and celebration"
  },
  {
    icon: Users,
    title: "500+ Families",
    subtitle: "Community Unity",
    description: "The entire village comes together as one spiritual family"
  },
  {
    icon: Heart,
    title: "12 Years",
    subtitle: "Of Memories",
    description: "Documenting our sacred tradition since 2014"
  }
];

const prahariHighlights = [
  { time: "6AM - 9AM", name: "Dawn", desc: "First prayers as sun rises", color: "#fb8500" },
  { time: "9AM - 12PM", name: "Morning", desc: "Village gathers for aarti", color: "#e9c46a" },
  { time: "12PM - 3PM", name: "Noon", desc: "Peak energy and devotion", color: "#ffd700" },
  { time: "3PM - 6PM", name: "Afternoon", desc: "Community feasts", color: "#9c6644" },
  { time: "6PM - 9PM", name: "Twilight", desc: "Lamps lit, night begins", color: "#ff6b35" },
  { time: "9PM - 12AM", name: "Night", desc: "Deep meditation begins", color: "#778da9" },
  { time: "12AM - 3AM", name: "Midnight", desc: "Most spiritual hour", color: "#2d00f7" },
  { time: "3AM - 6AM", name: "Brahma Muhurta", desc: "Gods awaken, dawn nears", color: "#f4a261" }
];

export default function AboutFestival() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="about" ref={containerRef} className="relative min-h-[200vh] bg-[#050505] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl"
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-40 right-10 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl"
          style={{ y: y2 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Hero Text Section */}
        <motion.div 
          className="min-h-screen flex flex-col justify-center py-24"
          style={{ opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-200px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Small Label */}
            <motion.div 
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-px w-12 bg-amber-500" />
              <span className="text-amber-500 text-xs uppercase tracking-[0.4em]">The Sacred Journey</span>
            </motion.div>

            {/* Main Headline */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-12">
              <span className="block text-white">Asta</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600 mt-2">
                Prahari
              </span>
            </h2>

            {/* Description */}
            <motion.p 
              className="text-xl md:text-2xl text-white/60 max-w-2xl leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              For 24 hours, our village breathes as one. Eight watches of devotion, 
              eight chapters of faith, one eternal cycle of love for the divine.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <div className="py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-500">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-8 h-8 text-amber-400" />
                  </div>
                  
                  <h3 className="text-4xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-amber-400 text-sm uppercase tracking-wider mb-4">{feature.subtitle}</p>
                  <p className="text-white/50 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Story Section */}
        <div className="py-24">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Left: Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <span className="text-amber-500 text-xs uppercase tracking-[0.4em]">Our Story</span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  Chadheigaon&apos;s
                  <span className="text-amber-500 block mt-2">Sacred Tradition</span>
                </h3>
                
                <div className="space-y-6 text-lg text-white/60 leading-relaxed">
                  <p>
                    In the heart of Puri district, where the ancient rhythms of Odisha still pulse through the land, 
                    our village has preserved a ritual that transcends time.
                  </p>
                  <p>
                    Asta Prahari is not merely a festival—it is a <span className="text-amber-400">breath shared by 500 families</span>, 
                    a continuous chant that bridges the gap between earth and heaven.
                  </p>
                  <p>
                    For 24 hours, the boundary between night and day dissolves. The village becomes a mandala, 
                    each home a point of light, each voice a thread in the cosmic tapestry.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Visual Timeline */}
            <div className="relative">
              <motion.div
                className="relative aspect-square max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {/* Central Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 blur-2xl" />
                </div>
                
                {/* 8 Prahari Circle */}
                <div className="relative w-full h-full">
                  {prahariHighlights.map((prahari, i) => {
                    const angle = (i * 45 - 90) * (Math.PI / 180);
                    const radius = 140;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <motion.div
                        key={prahari.time}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mb-2"
                          style={{ backgroundColor: prahari.color, boxShadow: `0 0 10px ${prahari.color}` }}
                        />
                        <span className="text-xs text-white/40 uppercase tracking-wider whitespace-nowrap">
                          {prahari.time}
                        </span>
                      </motion.div>
                    );
                  })}
                  
                  {/* Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-black border-2 border-amber-500/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-amber-400">24h</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Quote Section */}
        <motion.div 
          className="py-24 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            <div className="text-8xl text-amber-500/20 font-serif absolute -top-8 left-0">&quot;</div>
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-light text-white/80 leading-relaxed italic">
              When the whole village chants as one, 
              <span className="text-amber-400"> the gods descend to listen.</span>
            </blockquote>
            <div className="text-8xl text-amber-500/20 font-serif absolute -bottom-16 right-0">&quot;</div>
          </div>
          <p className="mt-12 text-white/40 uppercase tracking-[0.3em] text-sm">
            — Ancient Odia Proverb
          </p>
        </motion.div>

        {/* Day/Night Visual */}
        <div className="py-24">
          <motion.div
            className="relative h-32 rounded-3xl overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* Gradient representing 24 hours */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-yellow-600 via-orange-500 via-purple-900 to-blue-900" />
            
            {/* Sun and Moon markers */}
            <div className="absolute inset-0 flex items-center justify-between px-8">
              <div className="flex items-center gap-2">
                <Sun className="w-6 h-6 text-yellow-400" />
                <span className="text-white/60 text-sm">6 AM</span>
              </div>
              <div className="h-px flex-1 bg-white/20 mx-8" />
              <div className="flex items-center gap-2">
                <Moon className="w-6 h-6 text-blue-300" />
                <span className="text-white/60 text-sm">6 PM</span>
              </div>
              <div className="h-px flex-1 bg-white/20 mx-8" />
              <div className="flex items-center gap-2">
                <Sun className="w-6 h-6 text-yellow-400" />
                <span className="text-white/60 text-sm">6 AM</span>
              </div>
            </div>
            
            {/* Time markers */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 text-xs text-white/30 uppercase tracking-wider">
              {[...Array(8)].map((_, i) => (
                <span key={i}>Prahari {i + 1}</span>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
