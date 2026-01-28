"use client";

import dynamic from "next/dynamic";
import PrahariWheel from "@/components/PrahariWheel";
import PrahariRealm from "@/components/PrahariRealm";
import EmberCursor from "@/components/EmberCursor";
import EntryCeremony from "@/components/EntryCeremony";
import SonicMandala from "@/components/SonicMandala";
import VillageStories from "@/components/VillageStories";
import MobileNavigation from "@/components/MobileNavigation";
import SwipeController from "@/components/SwipeController";
import PhotoMandala from "@/components/PhotoMandala";
import TempleCorridor from "@/components/TempleCorridor";
import SlideshowMode from "@/components/SlideshowMode";
import PushpaVrishti from "@/components/PushpaVrishti";
import { usePrahariStore } from "@/store/prahariStore";
import { motion } from "framer-motion";

const MandalaCanvas = dynamic(() => import("@/components/MandalaCanvas"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />
});

export default function Home() {
  const { currentPrahari } = usePrahariStore();
  
  return (
    <>
      <EntryCeremony />
      <EmberCursor />
      <PushpaVrishti />
      <SwipeController />
      
      <main className={`relative min-h-screen overflow-hidden transition-colors duration-1000 ${currentPrahari.theme === 'light' ? 'text-black' : 'text-white'}`}>
        {/* Background Layer - ensure it is truly behind */}
        <div className="fixed inset-0 -z-50">
          <MandalaCanvas />
        </div>

        {/* Dimmer over the canvas so the UI stays readable - Dynamic Opacity */}
        <motion.div 
          className="fixed inset-0 -z-40 bg-black backdrop-blur-sm"
          animate={{ 
            opacity: currentPrahari.theme === 'light' ? 0.15 : 0.45 
          }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Grain Overlay */}
        <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.03] mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Content Layer - Higher Z-index */}
        <div className="relative z-20">
          <PrahariRealm />
        </div>
        
        {/* Navigation & Interaction Layer - Highest Z-index */}
        <div className="relative z-50">
          <div className="hidden md:block">
            <PrahariWheel />
          </div>
          <MobileNavigation />
          <PhotoMandala />
          <TempleCorridor />
          <SlideshowMode />
          <VillageStories />
          <SonicMandala />
        </div>
        
        {/* Persistent Branding */}
        <motion.div 
          className="fixed top-8 left-8 z-[60] mix-blend-difference hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] font-light">Asta Prahari</p>
          <p className="text-[10px] opacity-50 mt-1">{new Date().getFullYear()}</p>
        </motion.div>
      </main>
    </>
  );
}