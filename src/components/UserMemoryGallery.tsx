"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Clock, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
import { UserMemory, subscribeToMemories } from '@/lib/memoryService';
import { useCurrentPrahar } from '@/hooks/useCurrentPrahar';
import MemoryUploadModal from './MemoryUploadModal';

interface UserMemoryGalleryProps {
  praharNumber: number;
  praharName: string;
  accentColor: string;
}

export default function UserMemoryGallery({
  praharNumber,
  praharName,
  accentColor,
}: UserMemoryGalleryProps) {
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<UserMemory | null>(null);
  
  const { currentPrahar } = useCurrentPrahar();
  const isCurrentPrahar = currentPrahar === praharNumber;

  // Subscribe to real-time updates
  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = subscribeToMemories(praharNumber, (newMemories) => {
      setMemories(newMemories);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [praharNumber]);

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-8">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Camera className="w-5 h-5" style={{ color: accentColor }} />
          Community Memories
          {memories.length > 0 && (
            <span className="text-sm text-white/50">({memories.length})</span>
          )}
        </h3>
        
        {/* Upload Button - Only show during active prahar */}
        <motion.button
          whileHover={{ scale: isCurrentPrahar ? 1.05 : 1 }}
          whileTap={{ scale: isCurrentPrahar ? 0.95 : 1 }}
          onClick={() => setIsUploadModalOpen(true)}
          disabled={!isCurrentPrahar}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isCurrentPrahar
              ? 'text-white hover:opacity-90'
              : 'bg-white/5 text-white/40 cursor-not-allowed'
          }`}
          style={isCurrentPrahar ? { backgroundColor: accentColor } : {}}
        >
          <Camera className="w-4 h-4" />
          {isCurrentPrahar ? 'Share Memory' : 'Not Active'}
        </motion.button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && memories.length === 0 && (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Camera className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/50 mb-2">No memories shared yet</p>
          {isCurrentPrahar ? (
            <p className="text-sm text-white/30">
              Be the first to share a memory from this Prahar!
            </p>
          ) : (
            <p className="text-sm text-white/30">
              Memories can only be uploaded during the active Prahar
            </p>
          )}
        </div>
      )}

      {/* Memory Grid */}
      {!isLoading && memories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedMemory(memory)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={memory.imageUrl}
                alt={memory.caption || 'Memory'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium truncate flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {memory.uploaderName}
                  </p>
                  {memory.caption && (
                    <p className="text-white/70 text-xs truncate mt-0.5">
                      {memory.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <MemoryUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        praharNumber={praharNumber}
        praharName={praharName}
        accentColor={accentColor}
      />

      {/* Lightbox for selected memory */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedMemory(null)}
          >
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.caption || 'Memory'}
                className="max-h-[70vh] object-contain rounded-xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-medium flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  {selectedMemory.uploaderName}
                </p>
                {selectedMemory.caption && (
                  <p className="text-white/70 mt-1">{selectedMemory.caption}</p>
                )}
                <p className="text-white/40 text-sm mt-2 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(selectedMemory.uploadedAt)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
