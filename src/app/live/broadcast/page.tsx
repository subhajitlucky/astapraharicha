"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radio, Key, ArrowRight, Shield, AlertTriangle, ArrowLeft, Home } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const LiveStreamBroadcast = dynamic(
  () => import("@/components/livestream/LiveStreamBroadcast"),
  { ssr: false }
);

const ROOM_NAME = "astapraharicha-live";
// Simple broadcast key - change this to something secure!
const BROADCAST_KEY = "praharicha2026";

export default function BroadcastPage() {
  const [hostName, setHostName] = useState("");
  const [broadcastKey, setBroadcastKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (broadcastKey === BROADCAST_KEY && hostName.trim()) {
      setIsAuthenticated(true);
    } else {
      setError("Invalid broadcast key");
    }
  };

  const handleEndStream = () => {
    setIsAuthenticated(false);
    setHostName("");
    setBroadcastKey("");
  };

  if (isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black p-4 md:p-8">
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
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-100">Broadcast Studio</h1>
                <p className="text-amber-200/60 text-sm">You are the host • {hostName}</p>
              </div>
            </div>
            
            <Link
              href="/live"
              target="_blank"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-amber-200 text-sm transition-colors"
            >
              Open Viewer Page →
            </Link>
          </motion.div>

          {/* Broadcast Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10"
          >
            <LiveStreamBroadcast
              roomName={ROOM_NAME}
              hostName={hostName}
              onEnd={handleEndStream}
            />
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid md:grid-cols-3 gap-4"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-amber-500/20">
              <h3 className="text-amber-100 font-medium mb-1">📹 Camera</h3>
              <p className="text-amber-200/60 text-sm">Click the camera button to toggle video on/off</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-amber-500/20">
              <h3 className="text-amber-100 font-medium mb-1">🎤 Audio</h3>
              <p className="text-amber-200/60 text-sm">Click the mic button to mute/unmute yourself</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-amber-500/20">
              <h3 className="text-amber-100 font-medium mb-1">🖥️ Screen Share</h3>
              <p className="text-amber-200/60 text-sm">Share your screen to show presentations or videos</p>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black flex items-center justify-center p-4 relative">
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
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-amber-100 mb-2">
            🎥 Broadcast Studio
          </h1>
          <p className="text-amber-200/70">
            Enter credentials to start streaming
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Your name (shown to viewers)"
              className="w-full px-4 py-4 bg-white/5 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500/60 focus:bg-white/10 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50" />
            <input
              type="password"
              value={broadcastKey}
              onChange={(e) => setBroadcastKey(e.target.value)}
              placeholder="Broadcast key"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500/60 focus:bg-white/10 transition-all"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg"
            >
              <AlertTriangle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!hostName.trim() || !broadcastKey}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all"
          >
            <Radio className="w-5 h-5" />
            Enter Broadcast Studio
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/live"
            className="text-amber-200/60 hover:text-amber-200 text-sm transition-colors"
          >
            ← Back to viewer page
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
