"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image as ThreeImage } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";
import NextImage from "next/image";

// Placeholder images - replace with actual village photos
const photoData = [
  { id: 1, prahariId: 1, url: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80", caption: "Evening lamps" },
  { id: 2, prahariId: 3, url: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&q=80", caption: "Midnight chant" },
  { id: 3, prahariId: 5, url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80", caption: "Morning aarti" },
  { id: 4, prahariId: 7, url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80", caption: "Village gathering" },
  { id: 5, prahariId: 2, url: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&q=80", caption: "Night vigil" },
  { id: 6, prahariId: 4, url: "https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=800&q=80", caption: "Brahma Muhurta" },
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
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photoData[0] | null>(null);
  const { currentPrahari } = usePrahariStore();

  const currentPhotos = photoData.filter(p => p.prahariId === currentPrahari.id);
  
  if (currentPhotos.length === 0) return null;

  return (
    <>
      {/* Floating Gallery Toggle */}
      <motion.button
        className="fixed left-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-2 group"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
          <span className="text-2xl">📸</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white/60 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
          Memories
        </span>
      </motion.button>

      {/* Mobile Toggle */}
      <motion.button
        className="fixed top-24 left-4 z-30 md:hidden w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center"
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">📸</span>
      </motion.button>

      {/* Gallery Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[160] bg-black/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button 
              className="absolute top-6 right-6 z-[170] w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => {
                setIsOpen(false);
                setSelectedPhoto(null);
              }}
            >
              ✕
            </button>

            <div className="h-full flex flex-col items-center justify-center p-8">
              <h3 className="text-3xl font-bold text-spiritual text-white mb-2">
                {currentPrahari.nameOdia}
              </h3>
              <p className="text-white/50 mb-8 uppercase tracking-widest text-sm">
                Memory Gallery
              </p>

              {/* 3D Floating Gallery */}
              <div className="w-full h-[60vh] relative">
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
                    <p className="text-white/80 text-lg">{selectedPhoto.caption}</p>
                    <p className="text-white/40 text-sm mt-2">Asta Prahari {new Date().getFullYear()}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}