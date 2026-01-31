"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image as ThreeImage } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";
import { Camera, Plus, User, Clock } from "lucide-react";
import NextImage from "next/image";
import { UserMemory, subscribeToMemories } from "@/lib/memoryService";
import { useCurrentPrahar } from "@/hooks/useCurrentPrahar";
import MemoryUploadModal from "./MemoryUploadModal";

// Default placeholder images for when no user uploads exist
const defaultPhotoData = [
  { id: 1, prahariId: 1, url: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80", caption: "Evening lamps", uploaderName: "Festival Archive" },
  { id: 2, prahariId: 3, url: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&q=80", caption: "Midnight chant", uploaderName: "Festival Archive" },
  { id: 3, prahariId: 5, url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80", caption: "Morning aarti", uploaderName: "Festival Archive" },
  { id: 4, prahariId: 7, url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80", caption: "Village gathering", uploaderName: "Festival Archive" },
  { id: 5, prahariId: 2, url: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&q=80", caption: "Night vigil", uploaderName: "Festival Archive" },
  { id: 6, prahariId: 4, url: "https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=800&q=80", caption: "Brahma Muhurta", uploaderName: "Festival Archive" },
];

function PhotoSphere({ url, position, onClick, isActive }: { url: string; position: [number, number, number]; onClick: () => void; isActive: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      // Gentle bobbing and subtle rotation
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <ThreeImage 
      ref={ref}
      url={url}
      position={position}
      scale={[1.5, 1.5]}
      onClick={onClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'none'}
      transparent
      opacity={isActive ? 1 : 0.3}
      toneMapped={false}
    />
  );
}

export default function PhotoMandala() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: string | number; url: string; caption?: string; uploaderName: string } | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userMemories, setUserMemories] = useState<UserMemory[]>([]);
  const { currentPrahari } = usePrahariStore();
  const { currentPrahar } = useCurrentPrahar();
  
  const isCurrentPrahar = currentPrahar === currentPrahari.id;

  // Subscribe to user-uploaded memories for current prahar
  useEffect(() => {
    const unsubscribe = subscribeToMemories(currentPrahari.id, (memories) => {
      setUserMemories(memories);
    });
    return () => unsubscribe();
  }, [currentPrahari.id]);

  // Combine user uploads with default photos (user uploads first)
  const userPhotos = userMemories.map(m => ({
    id: m.id || m.uploadedAt.toString(),
    url: m.imageUrl,
    caption: m.caption,
    uploaderName: m.uploaderName,
    isUserUpload: true,
  }));

  const defaultPhotos = defaultPhotoData
    .filter(p => p.prahariId === currentPrahari.id)
    .map(p => ({ ...p, id: String(p.id), isUserUpload: false }));

  // Show user uploads first, then defaults
  const currentPhotos = userPhotos.length > 0 ? userPhotos : defaultPhotos;

  // Expose open function for mobile toolbar
  if (typeof window !== 'undefined') {
    (window as Window & { openPhotoMandala?: () => void }).openPhotoMandala = () => setIsOpen(true);
  }

  return (
    <>
      {/* Floating Gallery Toggle */}
      <motion.button
        className="fixed left-8 top-32 z-30 hidden md:flex flex-col items-center gap-2 group"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
          <span className="text-2xl">📸</span>
        </div>
        <span className="text-xs uppercase tracking-widest text-white/40 group-hover:text-white/60 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
          Memories
        </span>
      </motion.button>

      {/* Gallery Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button - Better positioned and styled */}
            <motion.button 
              className="absolute top-4 left-4 z-[151] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md"
              onClick={() => {
                setIsOpen(false);
                setSelectedPhoto(null);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8 pt-16 sm:pt-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-spiritual text-white mb-1 sm:mb-2">
                {currentPrahari.nameOdia}
              </h3>
              <p className="text-white/50 mb-4 sm:mb-6 uppercase tracking-widest text-xs sm:text-sm">
                Memory Gallery
              </p>

              {/* Upload Button */}
              <motion.button
                onClick={() => setIsUploadModalOpen(true)}
                className={`mb-6 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isCurrentPrahar
                    ? 'bg-amber-500 hover:bg-amber-400 text-black'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
                disabled={!isCurrentPrahar}
                whileHover={isCurrentPrahar ? { scale: 1.05 } : {}}
                whileTap={isCurrentPrahar ? { scale: 0.95 } : {}}
              >
                <Camera className="w-4 h-4" />
                {isCurrentPrahar ? 'Share Your Memory' : 'Upload During Active Prahar'}
              </motion.button>

              {/* Memory Count */}
              {userMemories.length > 0 && (
                <p className="text-white/40 text-xs mb-4">
                  {userMemories.length} memories shared by devotees
                </p>
              )}

              {/* 3D Floating Gallery */}
              <div className="w-full h-[50vh] relative">
                {currentPhotos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/40">
                    <span className="text-6xl mb-4">📷</span>
                    <p className="text-lg">No memories captured yet for this prahar</p>
                    {isCurrentPrahar ? (
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Be the first to share!
                      </button>
                    ) : (
                      <p className="text-sm text-white/20 mt-2">Upload opens during active Prahar</p>
                    )}
                  </div>
                ) : (
                  <>
                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                      <ambientLight intensity={0.5} />
                      {currentPhotos.map((photo, i) => {
                        // Arrange in a gentle arc
                        const x = (i - (currentPhotos.length - 1) / 2) * 2;
                        const z = -Math.abs(x) * 0.5;
                        return (
                          <PhotoSphere
                            key={photo.id}
                            url={photo.url}
                            position={[x, 0, z]}
                            isActive={selectedPhoto?.id === photo.id}
                            onClick={() => setSelectedPhoto(photo)}
                          />
                        );
                      })}
                    </Canvas>

                    {/* 2D Overlay for mobile/desktop fallback */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 p-4 overflow-x-auto md:hidden">
                      {currentPhotos.map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => setSelectedPhoto(photo)}
                          className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-white/20 focus:border-amber-500 relative"
                        >
                          <NextImage src={photo.url} alt={photo.caption} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Selected Photo Detail */}
              <AnimatePresence>
                {selectedPhoto && (
                  <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    {selectedPhoto.caption && (
                      <p className="text-white/80 text-lg">{selectedPhoto.caption}</p>
                    )}
                    <p className="text-white/40 text-sm mt-2 flex items-center justify-center gap-1">
                      <User className="w-3 h-3" />
                      {selectedPhoto.uploaderName}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upload Modal */}
            <MemoryUploadModal
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              praharNumber={currentPrahari.id}
              praharName={currentPrahari.nameEn}
              accentColor={currentPrahari.colors.accent}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}