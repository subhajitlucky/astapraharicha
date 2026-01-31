"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  useRoomContext,
  useParticipants,
  useLocalParticipant,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, createLocalVideoTrack, createLocalAudioTrack } from "livekit-client";
import { motion } from "framer-motion";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  Radio, 
  MonitorUp,
  StopCircle,
  Settings,
  RefreshCw
} from "lucide-react";

interface LiveStreamBroadcastProps {
  roomName: string;
  hostName: string;
  onEnd?: () => void;
}

function BroadcastControls({ onEnd }: { onEnd?: () => void }) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const viewerCount = Math.max(0, participants.length - 1);

  const toggleVideo = useCallback(async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [localParticipant, isVideoEnabled]);

  const toggleAudio = useCallback(async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [localParticipant, isAudioEnabled]);

  const toggleScreenShare = useCallback(async () => {
    if (localParticipant) {
      await localParticipant.setScreenShareEnabled(!isScreenSharing);
      setIsScreenSharing(!isScreenSharing);
    }
  }, [localParticipant, isScreenSharing]);

  const startBroadcast = useCallback(async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(true);
      await localParticipant.setMicrophoneEnabled(true);
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
      setIsLive(true);
    }
  }, [localParticipant]);

  const endBroadcast = useCallback(async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(false);
      await localParticipant.setMicrophoneEnabled(false);
      setIsLive(false);
      onEnd?.();
    }
  }, [localParticipant, onEnd]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {isLive ? (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full"
            >
              <span className="w-2 h-2 bg-white rounded-full" />
              <span className="text-white font-semibold">LIVE</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="text-white font-semibold">OFFLINE</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-white/80 bg-white/10 px-4 py-2 rounded-full">
            <Users className="w-4 h-4" />
            <span className="font-medium">{viewerCount} viewers</span>
          </div>
        </div>

        {/* Main Go Live / End Button */}
        {!isLive ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startBroadcast}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-full text-white font-bold shadow-lg shadow-red-600/30 transition-all"
          >
            <Radio className="w-5 h-5" />
            GO LIVE
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={endBroadcast}
            className="flex items-center gap-2 px-8 py-3 bg-gray-700 hover:bg-gray-800 rounded-full text-white font-bold transition-all"
          >
            <StopCircle className="w-5 h-5" />
            END STREAM
          </motion.button>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${
            isVideoEnabled 
              ? "bg-white/20 hover:bg-white/30 text-white" 
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-colors ${
            isAudioEnabled 
              ? "bg-white/20 hover:bg-white/30 text-white" 
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleScreenShare}
          className={`p-4 rounded-full transition-colors ${
            isScreenSharing 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          <MonitorUp className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}

function LocalVideo() {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false });
  const localVideoTrack = tracks.find(
    (track) => track.participant.isLocal && track.source === Track.Source.Camera
  );

  if (!localVideoTrack) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mb-6"
        >
          <Video className="w-16 h-16 text-white" />
        </motion.div>
        <p className="text-amber-200 text-2xl font-medium mb-2">Ready to Broadcast</p>
        <p className="text-amber-200/60">Click "GO LIVE" to start streaming</p>
      </div>
    );
  }

  return (
    <VideoTrack
      trackRef={localVideoTrack}
      className="w-full h-full object-cover"
    />
  );
}

export default function LiveStreamBroadcast({
  roomName,
  hostName,
  onEnd,
}: LiveStreamBroadcastProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(hostName)}&host=true`
        );
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setToken(data.token);
        }
      } catch (err) {
        setError("Failed to connect");
      } finally {
        setIsConnecting(false);
      }
    };

    getToken();
  }, [roomName, hostName]);

  if (isConnecting) {
    return (
      <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-black via-orange-950/20 to-black rounded-2xl flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full mb-4"
        />
        <p className="text-amber-200">Connecting to broadcast server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-black via-red-950/20 to-black rounded-2xl flex flex-col items-center justify-center p-8">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-full text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="w-full h-full min-h-[500px] bg-black rounded-2xl overflow-hidden relative">
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
          <LocalVideo />
        </div>
        <BroadcastControls onEnd={onEnd} />
      </LiveKitRoom>
    </div>
  );
}
