"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, User, ArrowRight, Sparkles, ArrowLeft, Home, Users, Clock, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { subscribeToLiveStreams, LiveStream } from "@/lib/livestreamService";

const LiveStreamViewer = dynamic(
  () => import("@/components/livestream/LiveStreamViewer"),
  { ssr: false }
);

function formatDuration(startedAt: number): string {
  const diff = Date.now() - startedAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
}

export default function LivePage() {
  const [viewerName, setViewerName] = useState("");
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to live streams
  useEffect(() => {
    const unsubscribe = subscribeToLiveStreams((streams) => {
      setLiveStreams(streams);
      setIsLoading(false);
      
      // If currently watching a stream that ended, go back to list
      if (selectedStream && !streams.find(s => s.roomName === selectedStream.roomName)) {
        setSelectedStream(null);
        setHasJoined(false);
      }
    });

    // Show cursor on live page
    document.body.classList.add('show-cursor');
    return () => {
      document.body.classList.remove('show-cursor');
      unsubscribe();
    };
  }, [selectedStream]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewerName.trim() && selectedStream) {
      setHasJoined(true);
    }
  };

  const handleSelectStream = (stream: LiveStream) => {
    setSelectedStream(stream);
  };

  const handleLeave = () => {
    setHasJoined(false);
  };

  const handleBackToList = () => {
    setSelectedStream(null);
    setHasJoined(false);
  };

  // Watching a stream
  if (hasJoined && selectedStream) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-orange-950/20 to-black p-3 sm:p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4 sm:mb-6 gap-2"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToList}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/80" />
              </motion.button>
              
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-amber-100 truncate">
                  {selectedStream.title}
                </h1>
                <p className="text-amber-200/60 text-xs sm:text-sm truncate">
                  Host: {selectedStream.hostName}
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeave}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full text-amber-200 text-xs sm:text-sm transition-colors flex-shrink-0"
            >
              Leave
            </motion.button>
          </motion.div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10"
            style={{ aspectRatio: '16/9', minHeight: '250px' }}
          >
            <LiveStreamViewer
              roomName={selectedStream.roomName}
              viewerName={viewerName}
              onLeave={handleLeave}
            />
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-amber-500/20"
          >
            <h2 className="text-base sm:text-lg font-semibold text-amber-100 mb-1.5 sm:mb-2">
              🪔 ଅଷ୍ଟ ପ୍ରହରୀ ମହୋତ୍ସବ - Live Darshan
            </h2>
            <p className="text-amber-200/70 text-sm sm:text-base">
              Experience the divine ceremony from anywhere in the world. 
              Join us for the sacred 48-hour continuous celebration.
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  // Stream selected, enter name
  if (selectedStream && !hasJoined) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-orange-950/20 to-black flex items-center justify-center p-4 relative">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToList}
          className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-black/40 backdrop-blur-md border border-amber-500/20 hover:border-amber-500/40 hover:bg-black/60 rounded-full transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
          <span className="text-sm text-amber-200/70 group-hover:text-amber-200 transition-colors hidden sm:inline">
            Back to Streams
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Stream Info */}
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
            <h1 className="text-2xl font-bold text-amber-100 mb-2">
              {selectedStream.title}
            </h1>
            <p className="text-amber-200/70">
              Hosted by {selectedStream.hostName}
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm text-amber-200/50">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {selectedStream.viewerCount} watching
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(selectedStream.startedAt)}
              </span>
            </div>
          </div>

          {/* Join Form */}
          <form onSubmit={handleJoin} className="space-y-3 sm:space-y-4">
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-500/50" />
              <input
                type="text"
                value={viewerName}
                onChange={(e) => setViewerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-amber-500/30 rounded-xl text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500/60 focus:bg-white/10 transition-all text-sm sm:text-base"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!viewerName.trim()}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Join Stream
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </form>

          <p className="text-center text-amber-200/40 text-sm mt-6">
            Free to watch • No account needed
          </p>
        </motion.div>
      </main>
    );
  }

  // Stream directory (no stream selected)
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-orange-950/20 to-black p-4 relative">
      {/* Back to Home Button */}
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

      <div className="max-w-2xl mx-auto pt-16 sm:pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
          >
            <Radio className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2">
            🪔 Live Darshan
          </h1>
          <p className="text-amber-200/70">
            Watch divine ceremony broadcasts
          </p>
        </motion.div>

        {/* Stream List */}
        <div className="space-y-4">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <RefreshCw className="w-8 h-8 text-amber-500/50 animate-spin mb-4" />
              <p className="text-amber-200/60">Loading streams...</p>
            </motion.div>
          ) : liveStreams.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 px-6 bg-white/5 rounded-2xl border border-amber-500/20"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Radio className="w-8 h-8 text-amber-500/50" />
              </div>
              <h3 className="text-lg font-semibold text-amber-100 mb-2">
                No Live Streams
              </h3>
              <p className="text-amber-200/60 text-sm mb-4">
                There are no active broadcasts right now. Check back later during the festival.
              </p>
              <p className="text-amber-200/40 text-xs">
                Streams will appear here automatically when hosts go live
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {liveStreams.map((stream, index) => (
                <motion.button
                  key={stream.roomName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectStream(stream)}
                  className="w-full p-4 sm:p-5 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Live indicator */}
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center relative">
                      <Radio className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black"
                      />
                    </div>

                    {/* Stream info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <motion.span
                          animate={{ opacity: [1, 0.6, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full"
                        >
                          LIVE
                        </motion.span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-amber-100 truncate">
                        {stream.title}
                      </h3>
                      <p className="text-amber-200/60 text-sm truncate">
                        {stream.hostName}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-amber-200/50">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {stream.viewerCount} watching
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(stream.startedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-5 h-5 text-amber-500/50 flex-shrink-0 mt-4" />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-amber-200/40 text-xs mt-8"
        >
          Free to watch • No account needed • Auto-refreshes
        </motion.p>
      </div>
    </main>
  );
}
