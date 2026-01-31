"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  useRoomContext,
  useParticipants,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Radio, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";

interface LiveStreamViewerProps {
  roomName: string;
  viewerName: string;
  onLeave?: () => void;
}

function VideoDisplay() {
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare], {
    onlySubscribed: true,
  });
  
  const videoTrack = tracks.find(
    (track) => track.publication?.kind === "video"
  );

  if (!videoTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mb-6"
        >
          <Radio className="w-12 h-12 text-white" />
        </motion.div>
        <p className="text-amber-200 text-xl font-medium">प्रतीक्षा करें...</p>
        <p className="text-amber-200/60 text-sm mt-2">Waiting for broadcast to start</p>
      </div>
    );
  }

  return (
    <VideoTrack
      trackRef={videoTrack}
      className="w-full h-full object-contain"
    />
  );
}

function ViewerControls({ onLeave }: { onLeave?: () => void }) {
  const room = useRoomContext();
  const participants = useParticipants();
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewerCount = participants.length;

  const toggleMute = () => {
    if (room) {
      room.localParticipant.setMicrophoneEnabled(false);
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
      <div className="flex items-center justify-between">
        {/* Live Badge & Viewer Count */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full"
          >
            <span className="w-2 h-2 bg-white rounded-full" />
            <span className="text-white text-sm font-semibold">LIVE</span>
          </motion.div>
          
          <div className="flex items-center gap-2 text-white/80">
            <Users className="w-4 h-4" />
            <span className="text-sm">{viewerCount} watching</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>

          {onLeave && (
            <button
              onClick={onLeave}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              Leave
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveStreamViewer({
  roomName,
  viewerName,
  onLeave,
}: LiveStreamViewerProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(viewerName)}&host=false`
        );
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setToken(data.token);
        }
      } catch (err) {
        setError("Failed to connect to stream");
      } finally {
        setIsConnecting(false);
      }
    };

    getToken();
  }, [roomName, viewerName]);

  if (isConnecting) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-black via-orange-950/20 to-black rounded-2xl flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-black via-red-950/20 to-black rounded-2xl flex flex-col items-center justify-center p-8">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-full text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="w-full h-full min-h-[400px] bg-black rounded-2xl overflow-hidden relative">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        video={false}
        audio={false}
        className="w-full h-full"
      >
        <RoomAudioRenderer />
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black via-orange-950/10 to-black">
          <VideoDisplay />
        </div>
        <ViewerControls onLeave={onLeave} />
      </LiveKitRoom>
    </div>
  );
}
