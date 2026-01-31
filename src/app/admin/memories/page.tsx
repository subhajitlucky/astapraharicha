"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, User, Image as ImageIcon, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { 
  UserMemory, 
  getPendingMemories, 
  approveMemory, 
  rejectMemory,
  FESTIVAL_CONFIG 
} from '@/lib/memoryService';

// Simple password protection - In production, use proper authentication
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'astaprahari2026';

const praharNames = [
  'First Watch',
  'Second Watch',
  'Third Watch',
  'Fourth Watch',
  'Fifth Watch',
  'Sixth Watch',
  'Seventh Watch',
  'Eighth Watch',
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrahar, setSelectedPrahar] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Check localStorage for previous auth
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  // Fetch pending memories
  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingMemories();
      // Filter by prahar if selected
      const filtered = selectedPrahar 
        ? data.filter(m => m.praharNumber === selectedPrahar)
        : data;
      setMemories(filtered);
    } catch (err) {
      console.error('Error fetching memories:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMemories();
    }
  }, [isAuthenticated, selectedPrahar]);

  const handleApprove = async (memory: UserMemory) => {
    if (!memory.id) return;
    setActionLoading(memory.id);
    try {
      await approveMemory(memory.id);
      setMemories(prev => prev.filter(m => m.id !== memory.id));
    } catch (err) {
      console.error('Error approving:', err);
    }
    setActionLoading(null);
  };

  const handleReject = async (memory: UserMemory) => {
    if (!memory.id) return;
    setActionLoading(memory.id);
    try {
      await rejectMemory(memory.id, memory.imageUrl);
      setMemories(prev => prev.filter(m => m.id !== memory.id));
    } catch (err) {
      console.error('Error rejecting:', err);
    }
    setActionLoading(null);
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-white/50 text-sm mt-2">Memory Approval Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-xl transition-colors"
            >
              Access Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Memory Approval</h1>
            <p className="text-white/50 text-sm mt-1">
              Festival Year: {FESTIVAL_CONFIG.year}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Prahar Filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPrahar(null)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedPrahar === null
                ? 'bg-amber-500 text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            All Prahars
          </button>
          {praharNames.map((name, index) => (
            <button
              key={index}
              onClick={() => setSelectedPrahar(index + 1)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedPrahar === index + 1
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {index + 1}. {name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-white/50 text-sm">Pending Memories</p>
              <p className="text-3xl font-bold text-white">{memories.length}</p>
            </div>
            <button
              onClick={fetchMemories}
              disabled={isLoading}
              className="ml-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Memory Grid */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-white text-lg">All caught up!</p>
            <p className="text-white/50 text-sm mt-1">No pending memories to review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {memories.map((memory) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -100 }}
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                >
                  {/* Image */}
                  <div 
                    className="aspect-video relative cursor-pointer group"
                    onClick={() => setPreviewImage(memory.imageUrl)}
                  >
                    <img
                      src={memory.imageUrl}
                      alt={memory.caption || 'Memory'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded-full text-xs text-white">
                      Prahar {memory.praharNumber}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-white/50" />
                      <span className="text-white font-medium">{memory.uploaderName}</span>
                    </div>
                    
                    {memory.caption && (
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {memory.caption}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1 text-white/40 text-xs mb-4">
                      <Clock className="w-3 h-3" />
                      {formatDate(memory.uploadedAt)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(memory)}
                        disabled={actionLoading === memory.id}
                        className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {actionLoading === memory.id ? (
                          <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(memory)}
                        disabled={actionLoading === memory.id}
                        className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {actionLoading === memory.id ? (
                          <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              src={previewImage}
              alt="Preview"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
