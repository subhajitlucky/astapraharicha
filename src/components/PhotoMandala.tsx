"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";
import { Camera, Plus, User, Clock, Download, X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
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
  return null; // Removed 3D - using 2D gallery now
}

// Download image function
async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'memory.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
}

export default function PhotoMandala() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: string | number; url: string; caption?: string; uploaderName: string; uploadedAt?: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
    uploadedAt: m.uploadedAt,
    isUserUpload: true,
  }));

  const defaultPhotos = defaultPhotoData
    .filter(p => p.prahariId === currentPrahari.id)
    .map(p => ({ ...p, id: String(p.id), isUserUpload: false, uploadedAt: undefined }));

  // Show user uploads first, then defaults
  const currentPhotos = userPhotos.length > 0 ? userPhotos : defaultPhotos;

  // Navigate photos
  const goToNext = () => {
    const newIndex = (selectedIndex + 1) % currentPhotos.length;
    setSelectedIndex(newIndex);
    setSelectedPhoto(currentPhotos[newIndex]);
  };

  const goToPrev = () => {
    const newIndex = (selectedIndex - 1 + currentPhotos.length) % currentPhotos.length;
    setSelectedIndex(newIndex);
    setSelectedPhoto(currentPhotos[newIndex]);
  };

  // Format date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
            className="fixed inset-0 z-[150] bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
                backgroundSize: '50px 50px'
              }} />
            </div>

            {/* Close Button */}
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
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            <div className="relative min-h-full flex flex-col items-center p-4 sm:p-8 pt-20">
              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>
                  {currentPrahari.nameOdia}
                </h3>
                <p className="text-amber-400/80 uppercase tracking-[0.3em] text-xs sm:text-sm">
                  Memory Gallery
                </p>
              </motion.div>

              {/* Upload Button */}
              <motion.button
                onClick={() => setIsUploadModalOpen(true)}
                className={`mb-8 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all shadow-lg ${
                  isCurrentPrahar
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
                disabled={!isCurrentPrahar}
                whileHover={isCurrentPrahar ? { scale: 1.05, boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)' } : {}}
                whileTap={isCurrentPrahar ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Camera className="w-5 h-5" />
                {isCurrentPrahar ? 'Share Your Memory' : 'Upload During Active Prahar'}
              </motion.button>

              {/* Memory Count */}
              {userMemories.length > 0 && (
                <motion.p 
                  className="text-white/50 text-sm mb-8 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Heart className="w-4 h-4 text-red-400" />
                  {userMemories.length} {userMemories.length === 1 ? 'memory' : 'memories'} shared by devotees
                </motion.p>
              )}

              {/* Photo Album Grid */}
              {currentPhotos.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center py-20 text-white/40"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Camera className="w-12 h-12 text-white/20" />
                  </div>
                  <p className="text-lg mb-2">No memories captured yet</p>
                  <p className="text-sm text-white/30">for this prahar</p>
                  {isCurrentPrahar && (
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-full text-sm font-medium flex items-center gap-2 hover:from-amber-400 hover:to-orange-400 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Be the first to share!
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentPhotos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setSelectedIndex(index);
                      }}
                    >
                      {/* Photo */}
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Memory'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Photo Info */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            {photo.uploaderName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate text-sm">
                              {photo.uploaderName}
                            </p>
                            {photo.uploadedAt && (
                              <p className="text-white/40 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(photo.uploadedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        {photo.caption && (
                          <p className="text-white/70 text-sm line-clamp-2">
                            "{photo.caption}"
                          </p>
                        )}
                      </div>

                      {/* Quick Actions on Hover */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(photo.url, `astapraharicha-memory-${photo.id}.jpg`);
                          }}
                          className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Lightbox for selected photo */}
            <AnimatePresence>
              {selectedPhoto && (
                <motion.div
                  className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedPhoto(null)}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Navigation arrows */}
                  {currentPhotos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPrev();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNext();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Main content */}
                  <motion.div
                    className="max-w-5xl w-full flex flex-col items-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Image */}
                    <div className="relative w-full max-h-[70vh] rounded-xl overflow-hidden shadow-2xl">
                      <img
                        src={selectedPhoto.url}
                        alt={selectedPhoto.caption || 'Memory'}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Photo details */}
                    <div className="mt-6 text-center w-full max-w-lg">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                          {selectedPhoto.uploaderName.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="text-white font-medium">{selectedPhoto.uploaderName}</p>
                          {selectedPhoto.uploadedAt && (
                            <p className="text-white/40 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(selectedPhoto.uploadedAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      {selectedPhoto.caption && (
                        <p className="text-white/80 text-lg mb-4 italic">
                          "{selectedPhoto.caption}"
                        </p>
                      )}

                      {/* Download button */}
                      <button
                        onClick={() => downloadImage(selectedPhoto.url, `astapraharicha-memory-${selectedPhoto.id}.jpg`)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-full font-medium hover:from-amber-400 hover:to-orange-400 transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Download Memory
                      </button>

                      {/* Photo counter */}
                      <p className="mt-4 text-white/30 text-sm">
                        {selectedIndex + 1} of {currentPhotos.length}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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