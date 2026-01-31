"use client";

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Loader2, 
  Check,
  AlertCircle 
} from 'lucide-react';
import { uploadMemoryImage } from '@/lib/memoryService';
import { useCurrentPrahar } from '@/hooks/useCurrentPrahar';

interface MemoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  praharNumber: number;
  praharName: string;
  accentColor: string;
}

export default function MemoryUploadModal({
  isOpen,
  onClose,
  praharNumber,
  praharName,
  accentColor,
}: MemoryUploadModalProps) {
  const [step, setStep] = useState<'form' | 'uploading' | 'success' | 'error'>('form');
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { currentPrahar, timeRemaining } = useCurrentPrahar();
  const isUploadAllowed = currentPrahar === praharNumber;

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !name.trim()) {
      setError('Please fill in your name and select a photo');
      return;
    }

    if (!isUploadAllowed) {
      setError('Upload is only allowed during this Prahar\'s active time');
      return;
    }

    setStep('uploading');
    setError(null);

    try {
      await uploadMemoryImage(
        selectedFile,
        praharNumber,
        name.trim(),
        caption.trim() || undefined
      );
      setStep('success');
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload. Please try again.');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('form');
    setName('');
    setCaption('');
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  const formatTime = (time: { hours: number; minutes: number; seconds: number }) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="p-4 border-b border-white/10"
            style={{ background: `linear-gradient(135deg, ${accentColor}20, transparent)` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Share Your Memory</h2>
                <p className="text-sm text-white/60">{praharName}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
            
            {/* Time remaining indicator */}
            {isUploadAllowed && timeRemaining && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400">
                  Upload active • {formatTime(timeRemaining)} remaining
                </span>
              </div>
            )}
            
            {!isUploadAllowed && (
              <div className="mt-3 flex items-center gap-2 text-sm text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Uploads only allowed during active Prahar</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {step === 'form' && (
              <div className="space-y-4">
                {/* File Upload Area */}
                <div 
                  onClick={() => isUploadAllowed && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    isUploadAllowed 
                      ? 'border-white/20 hover:border-white/40 cursor-pointer' 
                      : 'border-white/10 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={!isUploadAllowed}
                  />
                  
                  {preview ? (
                    <div className="relative">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white/40" />
                      </div>
                      <p className="text-white/70">Tap to select a photo</p>
                      <p className="text-xs text-white/40">Max 10MB • JPG, PNG, WebP</p>
                    </div>
                  )}
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm text-white/70 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={!isUploadAllowed}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 disabled:opacity-50"
                    maxLength={50}
                  />
                </div>

                {/* Caption Input */}
                <div>
                  <label className="block text-sm text-white/70 mb-1">Caption (optional)</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption..."
                    disabled={!isUploadAllowed}
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none disabled:opacity-50"
                    maxLength={200}
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: isUploadAllowed ? 1.02 : 1 }}
                  whileTap={{ scale: isUploadAllowed ? 0.98 : 1 }}
                  onClick={handleUpload}
                  disabled={!isUploadAllowed || !selectedFile || !name.trim()}
                  className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: isUploadAllowed 
                      ? `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)` 
                      : '#444' 
                  }}
                >
                  <Upload className="w-5 h-5" />
                  Upload Memory
                </motion.button>

                <p className="text-xs text-white/40 text-center">
                  Photos will be reviewed before appearing in the gallery
                </p>
              </div>
            )}

            {step === 'uploading' && (
              <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 mx-auto text-white animate-spin mb-4" />
                <p className="text-white">Uploading your memory...</p>
                <p className="text-sm text-white/50 mt-1">Please wait</p>
              </div>
            )}

            {step === 'success' && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Memory Shared!</h3>
                <p className="text-white/60">
                  Your photo will appear after review.
                </p>
                <p className="text-sm text-white/40 mt-2">
                  Thank you for sharing your memory of {praharName}
                </p>
              </div>
            )}

            {step === 'error' && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Failed</h3>
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
