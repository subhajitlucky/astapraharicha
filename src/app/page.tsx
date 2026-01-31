"use client";

import dynamic from "next/dynamic";
import PrahariWheel from "@/components/PrahariWheel";
import PrahariRealm from "@/components/PrahariRealm";
import EmberCursor from "@/components/EmberCursor";
import EntryCeremony from "@/components/EntryCeremony";
import VillageStories from "@/components/VillageStories";
import MobileNavigation from "@/components/MobileNavigation";
import MobileToolbar from "@/components/MobileToolbar";
import SwipeController from "@/components/SwipeController";
import PhotoMandala from "@/components/PhotoMandala";
import TempleCorridor from "@/components/TempleCorridor";
import SlideshowMode from "@/components/SlideshowMode";
import PushpaVrishti from "@/components/PushpaVrishti";
import VillageDedication from "@/components/village/VillageDedication";
import LiveButton from "@/components/livestream/LiveButton";
import { usePrahariStore } from "@/store/prahariStore";
import { motion } from "framer-motion";

const MandalaCanvas = dynamic(() => import("@/components/MandalaCanvas"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />
});

// Global window interface extension
declare global {
  interface Window {
    openPhotoMandala?: () => void;
    openTempleCorridor?: () => void;
    openVillageStories?: () => void;
    startSlideshow?: () => void;
  }
}

export default function Home() {
  const { currentPrahari } = usePrahariStore();
  
  // Mobile toolbar action handlers
  const handleOpenMemories = () => {
    if (typeof window !== 'undefined' && window.openPhotoMandala) {
      window.openPhotoMandala();
    }
  };

  const handleOpenCorridor = () => {
    if (typeof window !== 'undefined' && window.openTempleCorridor) {
      window.openTempleCorridor();
    }
  };

  const handleOpenStories = () => {
    if (typeof window !== 'undefined' && window.openVillageStories) {
      window.openVillageStories();
    }
  };

  const handleStartSlideshow = () => {
    if (typeof window !== 'undefined' && window.startSlideshow) {
      window.startSlideshow();
    }
  };
  
  return (
    <>
      <EntryCeremony />
      <EmberCursor />
      <PushpaVrishti />
      <SwipeController />
      <LiveButton />
      
      <main className={`relative min-h-screen overflow-hidden transition-colors duration-1000 ${currentPrahari.theme === 'light' ? 'text-black' : 'text-white'}`}>
        {/* Background Layer - ensure it is truly behind */}
        <div className="fixed inset-0 -z-50">
          <MandalaCanvas />
        </div>

        {/* Dimmer over the canvas so the UI stays readable - Dynamic Opacity */}
        <motion.div 
          className="fixed inset-0 -z-40 backdrop-blur-sm"
          animate={{ 
            opacity: currentPrahari.theme === 'light' ? 0.15 : 0.45,
            backgroundColor: currentPrahari.colors.primary
          }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Prahari Theme Color Overlay - adds colored tint */}
        <motion.div 
          className="fixed inset-0 -z-35 pointer-events-none"
          animate={{ 
            background: `radial-gradient(ellipse at 50% 50%, ${currentPrahari.colors.mist} 0%, transparent 60%)`
          }}
          transition={{ duration: 2 }}
        />
        
         {/* Grain Overlay */}
         <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.03] mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
         />

         {/* Village Dedication Header - Always Visible */}
         <VillageDedication />

         {/* Content Layer - Higher Z-index */}
        <div className="relative z-20">
          <PrahariRealm />
        </div>
        
         {/* Navigation & Interaction Layer - Highest Z-index */}
         <div className="relative z-50">
            {/* Desktop-only UI elements */}
            <div className="hidden md:block">
              <PrahariWheel />
            </div>
            
            {/* Available on all screens - modal/panel based */}
            <TempleCorridor />
            <VillageStories />
            <SlideshowMode />
            <PhotoMandala />
           
           {/* Mobile & Desktop navigation */}
           <MobileNavigation />
           
           {/* Mobile Toolbar - provides access to desktop features */}
           <MobileToolbar
             onOpenMemories={handleOpenMemories}
             onOpenCorridor={handleOpenCorridor}
             onOpenStories={handleOpenStories}
             onStartSlideshow={handleStartSlideshow}
           />
         </div>
        
         {/* Corner Blessing */}
         <motion.div
           className="fixed bottom-4 right-4 z-30 mix-blend-difference hidden md:block"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2 }}
         >
           <p className="text-[10px] uppercase tracking-[0.3em] font-light text-white/50">
             ଜୟ ଜଗନ୍ନାଥ
           </p>
         </motion.div>
      </main>
    </>
  );
}