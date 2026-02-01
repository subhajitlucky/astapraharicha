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
import { updateViewerCount } from "@/lib/livestreamService";

interface LiveStreamViewerProps {
  roomName: string;
  viewerName: string;
  onLeave?: () => void;
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
    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10">
      <div className="flex items-center justify-between gap-2">
        {/* Live Badge & Viewer Count */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-1 sm:gap-1.5 bg-red-600 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            <span className="text-white text-[10px] sm:text-xs font-semibold">LIVE</span>
          </motion.div>
          
          <div className="flex items-center gap-1 sm:gap-1.5 text-white/80">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs">{viewerCount}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            )}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden sm:block"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Inner component that has access to LiveKit context
function ViewerInner({ onLeave, roomName }: { onLeave?: () => void; roomName: string }) {
  const participants = useParticipants();
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare], {
    onlySubscribed: true,
  });
  
  // Update viewer count in Firebase when participants change
  useEffect(() => {
    const viewerCount = Math.max(0, participants.length - 1); // Exclude the host
    updateViewerCount(roomName, viewerCount).catch(console.error);
  }, [participants.length, roomName]);
  
  const videoTrack = tracks.find(
    (track) => track.publication?.kind === "video"
  );

  return (
    <div className="w-full h-full relative">
      <RoomAudioRenderer />
      
      {/* Video Display Area */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black via-orange-950/10 to-black">
        {videoTrack ? (
          <VideoTrack
            trackRef={videoTrack}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4 pb-16">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mb-3 md:mb-4"
            >
              <Radio className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
            </motion.div>
            <p className="text-amber-200 text-sm sm:text-base md:text-lg font-medium">ଅପେକ୍ଷା କରନ୍ତୁ...</p>
            <p className="text-amber-200/60 text-[10px] sm:text-xs mt-1 text-center">Waiting for broadcast to start</p>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <ViewerControls onLeave={onLeave} />
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
      <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-black via-orange-950/20 to-black rounded-xl sm:rounded-2xl flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-black via-red-950/20 to-black rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <p className="text-red-400 text-sm sm:text-base md:text-lg mb-3 md:mb-4 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 sm:px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-full text-white text-sm sm:text-base transition-colors"
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
    <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] bg-black rounded-xl sm:rounded-2xl overflow-hidden relative">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        video={false}
        audio={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ViewerInner onLeave={onLeave} roomName={roomName} />
      </LiveKitRoom>
    </div>
  );
}
