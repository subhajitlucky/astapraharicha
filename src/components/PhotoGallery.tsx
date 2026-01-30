"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { photoYears, Photo, getPhotosByYear } from "@/data/photoGallery";
import { X, ChevronLeft, ChevronRight, Calendar, Clock, Tag, Camera } from "lucide-react";

interface PhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoGallery({ isOpen, onClose }: PhotoGalleryProps) {
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedPrahari, setSelectedPrahari] = useState<number | "all">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const prahariNames = [
    "First Watch (6-9 PM)",
    "Second Watch (9-12 AM)",
    "Third Watch (12-3 AM)",
    "Fourth Watch (3-6 AM)",
    "Fifth Watch (6-9 AM)",
    "Sixth Watch (9-12 PM)",
    "Seventh Watch (12-3 PM)",
    "Eighth Watch (3-6 PM)"
  ];

  const filteredPhotos = useMemo(() => {
    let photos: Photo[] = [];
    
    if (selectedYear === "all") {
      photos = photoYears.flatMap(py => py.photos);
    } else {
      photos = getPhotosByYear(selectedYear);
    }
    
    if (selectedPrahari !== "all") {
      photos = photos.filter(p => p.prahariId === selectedPrahari);
    }
    
    return photos;
  }, [selectedYear, selectedPrahari]);

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(index);
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" 
      ? (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (currentPhotoIndex + 1) % filteredPhotos.length;
    
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-2xl font-bold text-spiritual text-white">Photo Gallery</h2>
           <p className="text-white/50 text-sm">Chadheigaon Asta Prahari • 12 Years of Memories</p>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Filters */}
      <div className="fixed top-24 left-0 right-0 z-10 px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex flex-wrap items-center gap-4 max-w-7xl mx-auto">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/50" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="bg-black/50 text-white px-4 py-2 rounded-lg border border-amber-500/40 text-sm focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              <option value="all" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Years</option>
              {years.map(year => (
                <option key={year} value={year} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>{year}</option>
              ))}
            </select>
          </div>

          {/* Prahari Filter */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/50" />
            <select
              value={selectedPrahari}
              onChange={(e) => setSelectedPrahari(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="bg-black/50 text-white px-4 py-2 rounded-lg border border-amber-500/40 text-sm focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              <option value="all" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Prahari</option>
              {prahariNames.map((name, idx) => (
                <option key={idx} value={idx + 1} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>{name}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="ml-auto text-white/50 text-sm">
            Showing {filteredPhotos.length} photos
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="fixed top-40 left-0 right-0 bottom-0 overflow-y-auto px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layoutId={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => handlePhotoClick(photo, index)}
              className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all"
            >
              {/* Placeholder gradient - replace with actual Image component when you add photos */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-purple-900/20" />
              
              {/* Photo Number Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white/70 font-mono">
                {photo.id}
              </div>
              
              {/* Prahari Badge */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/20 rounded text-xs text-amber-300 border border-amber-500/30">
                Prahari {photo.prahariId}
              </div>

              {/* Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
                <p className="text-white/50 text-xs">{photo.year}</p>
              </div>

              {/* Empty State Message */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-white/30 text-xs">Photo {photo.id}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">No photos found for the selected filters</p>
            <button
              onClick={() => { setSelectedYear("all"); setSelectedPrahari("all"); }}
              className="mt-4 px-6 py-2 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-[55] bg-black/98 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto("prev"); }}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto("next"); }}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Photo Display */}
            <motion.div
              className="max-w-5xl w-full max-h-[80vh] flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo Container */}
              <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-amber-900/30 to-purple-900/30 rounded-xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/50 text-lg">{selectedPhoto.id}</p>
                    <p className="text-white/30 text-sm mt-2">Add your photo here</p>
                  </div>
                </div>
              </div>

              {/* Photo Info */}
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.caption}</h3>
                <div className="flex items-center justify-center gap-4 text-white/50 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedPhoto.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Prahari {selectedPhoto.prahariId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    {selectedPhoto.photographer}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {selectedPhoto.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/60 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-white/30 text-sm">
                  Photo {currentPhotoIndex + 1} of {filteredPhotos.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
