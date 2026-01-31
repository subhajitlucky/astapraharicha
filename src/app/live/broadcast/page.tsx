"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, Key, ArrowRight, Shield, AlertTriangle, ArrowLeft, Home } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const LiveStreamBroadcast = dynamic(
  () => import("@/components/livestream/LiveStreamBroadcast"),
  { ssr: false }
);

const ROOM_NAME = "astapraharicha-live";

export default function BroadcastPage() {
  const [hostName, setHostName] = useState("");
  const [broadcastKey, setBroadcastKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Force cursor visibility on this page
  useEffect(() => {
    document.body.classList.add('show-cursor');
    return () => {
      document.body.classList.remove('show-cursor');
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);
    
    try {
      const response = await fetch("/api/broadcast/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: broadcastKey }),
      });
      
      const data = await response.json();
      
      if (data.valid && hostName.trim()) {
        setIsAuthenticated(true);
      } else {
        setError(data.error || "Invalid broadcast key");
      }
    } catch {
      setError("Failed to verify. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEndStream = () => {
    setIsAuthenticated(false);
    setHostName("");
    setBroadcastKey("");
  };

  if (isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black p-3 sm:p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4 sm:mb-6 gap-2"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Back to Home */}
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/80" />
                </motion.div>
              </Link>
              
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-amber-100 truncate">ଅଷ୍ଟ ପ୍ରହରୀ Broadcast</h1>
                <p className="text-amber-200/60 text-xs sm:text-sm truncate">Host: {hostName}</p>
              </div>
            </div>
            
            <Link
              href="/live"
              target="_blank"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full text-amber-200 text-xs sm:text-sm transition-colors flex-shrink-0 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Open Viewer Page →</span>
              <span className="sm:hidden">Viewer</span>
            </Link>
          </motion.div>

          {/* Broadcast Container - removed aspect-video to prevent clipping controls */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full rounded-xl sm:rounded-2xl overflow-visible shadow-2xl shadow-red-500/10"
            style={{ aspectRatio: '16/9', minHeight: '280px' }}
          >
            <LiveStreamBroadcast
              roomName={ROOM_NAME}
              hostName={hostName}
              onEnd={handleEndStream}
            />
          </motion.div>

          {/* Quick Tips - Hidden on mobile since controls are visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 sm:mt-6 hidden sm:grid grid-cols-3 gap-2 sm:gap-4"
          >
            <div className="p-2 sm:p-3 bg-white/5 rounded-lg border border-amber-500/10 text-center">
              <p className="text-amber-200/50 text-xs">📹 Camera - toggle video</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/5 rounded-lg border border-amber-500/10 text-center">
              <p className="text-amber-200/50 text-xs">🎤 Audio - mute/unmute</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/5 rounded-lg border border-amber-500/10 text-center">
              <p className="text-amber-200/50 text-xs">🖥️ Screen - share display</p>
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
        className="w-full max-w-md px-4 sm:px-0"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-1.5 sm:mb-2">
            🎥 ଅଷ୍ଟ ପ୍ରହରୀ Broadcast
          </h1>
          <p className="text-amber-200/70 text-sm sm:text-base">
            Enter credentials to start streaming
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-3 sm:space-y-4">
          <div className="relative">
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Your name (shown to viewers)"
              className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500/60 focus:bg-white/10 transition-all text-sm sm:text-base"
              required
              autoComplete="name"
            />
          </div>

          <div className="relative">
            <Key className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-500/50 pointer-events-none" />
            <input
              type="password"
              value={broadcastKey}
              onChange={(e) => setBroadcastKey(e.target.value)}
              placeholder="Broadcast key"
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500/60 focus:bg-white/10 transition-all text-sm sm:text-base"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-xs sm:text-sm bg-red-500/10 p-2.5 sm:p-3 rounded-lg"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!hostName.trim() || !broadcastKey || isVerifying}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all text-sm sm:text-base"
          >
            {isVerifying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Verifying...
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
                Enter Broadcast Studio
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-4 sm:mt-6">
          <Link
            href="/live"
            className="text-amber-200/60 hover:text-amber-200 text-xs sm:text-sm transition-colors"
          >
            ← Back to viewer page
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
