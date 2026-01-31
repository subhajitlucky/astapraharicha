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
import { Track, facingModeFromLocalTrack, LocalVideoTrack, createLocalVideoTrack } from "livekit-client";
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
  RefreshCw,
  SwitchCamera
} from "lucide-react";

interface LiveStreamBroadcastProps {
  roomName: string;
  hostName: string;
  onEnd?: () => void;
}

// Inner component that has access to LiveKit context
function BroadcastStudioInner({ onEnd }: { onEnd?: () => void }) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false });
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);

  const viewerCount = Math.max(0, participants.length - 1);
  
  const localVideoTrack = tracks.find(
    (track) => track.participant.isLocal && track.source === Track.Source.Camera
  );

  // Initialize tracks when localParticipant is ready
  useEffect(() => {
    if (localParticipant) {
      console.log('Local participant ready:', localParticipant.identity);
      
      const videoTrack = localParticipant.getTrackPublication(Track.Source.Camera);
      const audioTrack = localParticipant.getTrackPublication(Track.Source.Microphone);
      
      if (videoTrack) {
        setIsVideoEnabled(!videoTrack.isMuted);
      }
      if (audioTrack) {
        setIsAudioEnabled(!audioTrack.isMuted);
      }
    }
  }, [localParticipant]);

  const toggleVideo = useCallback(async () => {
    if (localParticipant) {
      try {
        await localParticipant.setCameraEnabled(!isVideoEnabled);
        setIsVideoEnabled(!isVideoEnabled);
      } catch (error) {
        console.error('Error toggling video:', error);
      }
    }
  }, [localParticipant, isVideoEnabled]);

  const toggleAudio = useCallback(async () => {
    if (localParticipant) {
      try {
        await localParticipant.setMicrophoneEnabled(!isAudioEnabled);
        setIsAudioEnabled(!isAudioEnabled);
      } catch (error) {
        console.error('Error toggling audio:', error);
      }
    }
  }, [localParticipant, isAudioEnabled]);

  const toggleScreenShare = useCallback(async () => {
    if (localParticipant) {
      try {
        await localParticipant.setScreenShareEnabled(!isScreenSharing);
        setIsScreenSharing(!isScreenSharing);
      } catch (error) {
        console.error('Error toggling screen share:', error);
      }
    }
  }, [localParticipant, isScreenSharing]);

  // Switch between front and rear camera
  const switchCamera = useCallback(async () => {
    if (!localParticipant || isSwitchingCamera) return;
    
    setIsSwitchingCamera(true);
    try {
      const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
      
      // Get current camera track
      const currentTrack = localParticipant.getTrackPublication(Track.Source.Camera);
      
      // Create new track with opposite facing mode
      const newTrack = await createLocalVideoTrack({
        facingMode: newFacingMode,
        resolution: { width: 1280, height: 720 },
      });
      
      // Publish the new track (this will replace the old one)
      if (currentTrack) {
        await localParticipant.unpublishTrack(currentTrack.track as LocalVideoTrack);
      }
      await localParticipant.publishTrack(newTrack);
      
      setFacingMode(newFacingMode);
      console.log('Camera switched to:', newFacingMode);
    } catch (error) {
      console.error('Error switching camera:', error);
    } finally {
      setIsSwitchingCamera(false);
    }
  }, [localParticipant, facingMode, isSwitchingCamera]);

  const startBroadcast = useCallback(async () => {
    if (localParticipant) {
      try {
        await localParticipant.setCameraEnabled(true);
        await localParticipant.setMicrophoneEnabled(true);
        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
        setIsLive(true);
      } catch (error) {
        console.error('Error starting broadcast:', error);
      }
    }
  }, [localParticipant]);

  const endBroadcast = useCallback(async () => {
    if (localParticipant) {
      try {
        await localParticipant.setCameraEnabled(false);
        await localParticipant.setMicrophoneEnabled(false);
        setIsLive(false);
        onEnd?.();
      } catch (error) {
        console.error('Error ending broadcast:', error);
      }
    }
  }, [localParticipant, onEnd]);

  return (
    <div className="w-full h-full relative">
      <RoomAudioRenderer />
      
      {/* Video Display Area */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black via-orange-950/10 to-black">
        {localVideoTrack ? (
          <VideoTrack
            trackRef={localVideoTrack}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center px-4 pb-24">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mb-3 sm:mb-4"
            >
              <Video className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            </motion.div>
            <p className="text-amber-200 text-sm sm:text-lg font-medium mb-1 text-center">Ready to Broadcast</p>
            <p className="text-amber-200/60 text-xs sm:text-sm text-center">Click "GO LIVE" to start</p>
          </div>
        )}
      </div>

      {/* Controls Overlay - positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-10">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {isLive ? (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1 sm:gap-2 bg-red-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                <span className="text-white font-semibold text-[10px] sm:text-sm">LIVE</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <span className="text-white font-semibold text-[10px] sm:text-sm">OFFLINE</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 sm:gap-1.5 text-white/80 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium text-[10px] sm:text-sm">{viewerCount}</span>
            </div>
          </div>

          {/* Main Go Live / End Button */}
          {!isLive ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startBroadcast}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-full text-white font-bold shadow-lg shadow-red-600/30 transition-all text-[10px] sm:text-sm"
            >
              <Radio className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>GO LIVE</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={endBroadcast}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-gray-700 hover:bg-gray-800 rounded-full text-white font-bold transition-all text-[10px] sm:text-sm"
            >
              <StopCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>END</span>
            </motion.button>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleVideo}
            className={`p-2 sm:p-3 rounded-full transition-colors ${
              isVideoEnabled 
                ? "bg-white/20 hover:bg-white/30 text-white" 
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isVideoEnabled ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          </motion.button>

          {/* Switch Camera Button - visible on mobile/tablet */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={switchCamera}
            disabled={isSwitchingCamera || !isVideoEnabled}
            className={`p-2 sm:p-3 rounded-full transition-colors ${
              isSwitchingCamera
                ? "bg-amber-600 text-white animate-pulse"
                : "bg-white/20 hover:bg-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
            title={facingMode === 'user' ? 'Switch to rear camera' : 'Switch to front camera'}
          >
            <SwitchCamera className={`w-4 h-4 sm:w-5 sm:h-5 ${isSwitchingCamera ? 'animate-spin' : ''}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAudio}
            className={`p-2 sm:p-3 rounded-full transition-colors ${
              isAudioEnabled 
                ? "bg-white/20 hover:bg-white/30 text-white" 
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isAudioEnabled ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleScreenShare}
            className={`p-2 sm:p-3 rounded-full transition-colors hidden sm:flex ${
              isScreenSharing 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>
    </div>
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
    const initialize = async () => {
      try {
        // First, request media permissions
        console.log('Requesting media permissions...');
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          // Stop the tracks immediately - we just needed to get permission
          stream.getTracks().forEach(track => track.stop());
          console.log('Media permissions granted');
        } catch (mediaError) {
          console.error('Media permission error:', mediaError);
          setError("Camera and microphone access denied. Please allow access to broadcast.");
          setIsConnecting(false);
          return;
        }

        // Then get the LiveKit token
        console.log('Getting LiveKit token...');
        const response = await fetch(
          `/api/livekit?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(hostName)}&host=true`
        );
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setToken(data.token);
          console.log('Token received');
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError("Failed to connect");
      } finally {
        setIsConnecting(false);
      }
    };

    initialize();
  }, [roomName, hostName]);

  if (isConnecting) {
    return (
      <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-black via-orange-950/20 to-black rounded-2xl flex flex-col items-center justify-center">
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
      <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-black via-red-950/20 to-black rounded-2xl flex flex-col items-center justify-center p-8">
        <p className="text-red-400 text-lg mb-4 text-center">{error}</p>
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
    <div className="w-full h-full min-h-[300px] bg-black rounded-2xl overflow-hidden relative">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        video={{ facingMode: 'environment' }}  
        audio={true}
        data-lk-theme="default"
        style={{ height: '100%', width: '100%' }}
        onError={(error) => {
          console.error('LiveKit Room Error:', error);
          setError(`Connection error: ${error.message}`);
        }}
        onConnected={() => {
          console.log('Connected to room successfully');
        }}
      >
        <BroadcastStudioInner onEnd={onEnd} />
      </LiveKitRoom>
    </div>
  );
}
