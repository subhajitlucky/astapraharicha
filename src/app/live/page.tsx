"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radio, User, ArrowRight, Sparkles, ArrowLeft, Home } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const LiveStreamViewer = dynamic(
  () => import("@/components/livestream/LiveStreamViewer"),
  { ssr: false }
);

const ROOM_NAME = "astapraharicha-live";

export default function LivePage() {
  const [viewerName, setViewerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewerName.trim()) {
      setHasJoined(true);
    }
  };

  const handleLeave = () => {
    setHasJoined(false);
    setViewerName("");
  };

  if (hasJoined) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-orange-950/20 to-black p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              {/* Back to Home */}
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-amber-400/80" />
                </motion.div>
              </Link>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-100">अष्टप्रहरीचा Live</h1>
                <p className="text-amber-200/60 text-sm">Divine ceremony broadcast</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeave}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-amber-200 text-sm transition-colors"
            >
              Leave Stream
            </motion.button>
          </motion.div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10"
          >
            <LiveStreamViewer
              roomName={ROOM_NAME}
              viewerName={viewerName}
              onLeave={handleLeave}
            />
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-6 bg-white/5 rounded-2xl border border-amber-500/20"
          >
            <h2 className="text-lg font-semibold text-amber-100 mb-2">
              🪔 अष्टप्रहरीचा महोत्सव - Live Darshan
            </h2>
            <p className="text-amber-200/70">
              Experience the divine ceremony from anywhere in the world. 
              Join us for the sacred 48-hour continuous celebration.
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-orange-950/20 to-black flex items-center justify-center p-4 relative">
      {/* Back to Home Button - Top Left */}
      <Link href="/">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-black/40 backdrop-blur-md border border-amber-500/20 hover:border-amber-500/40 hover:bg-black/60 rounded-full transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
          <span className="text-sm text-amber-200/70 group-hover:text-amber-200 transition-colors hidden sm:inline">
            Back to Home
          </span>
          <Home className="w-4 h-4 text-amber-400/60 sm:hidden" />
        </motion.div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Decorative Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
          >
            <Radio className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-amber-100 mb-2">
            🪔 Live Darshan
          </h1>
          <p className="text-amber-200/70">
            Join the divine ceremony broadcast
          </p>
        </div>

        {/* Join Form */}
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50" />
            <input
              type="text"
              value={viewerName}
              onChange={(e) => setViewerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500/60 focus:bg-white/10 transition-all"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!viewerName.trim()}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Join Live Stream
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>

        {/* Footer Note */}
        <p className="text-center text-amber-200/40 text-sm mt-6">
          Free to watch • No account needed
        </p>
      </motion.div>
    </main>
  );
}
