import { getDatabase, ref, set, onValue, remove, serverTimestamp, off } from 'firebase/database';
import app from './firebase';

export interface LiveStream {
  id: string;
  roomName: string;
  hostName: string;
  title: string;
  startedAt: number;
  viewerCount: number;
  isLive: boolean;
}

const db = getDatabase(app);

// Generate a unique room ID
export function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'room-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Register a new live stream
export async function registerLiveStream(
  roomName: string,
  hostName: string,
  title?: string
): Promise<void> {
  const streamRef = ref(db, `liveStreams/${roomName}`);
  await set(streamRef, {
    id: roomName,
    roomName,
    hostName,
    title: title || `${hostName}'s Live Stream`,
    startedAt: Date.now(),
    viewerCount: 0,
    isLive: true,
    updatedAt: serverTimestamp(),
  });
}

// Update viewer count for a stream
export async function updateViewerCount(roomName: string, count: number): Promise<void> {
  const countRef = ref(db, `liveStreams/${roomName}/viewerCount`);
  await set(countRef, count);
}

// End a live stream
export async function endLiveStream(roomName: string): Promise<void> {
  const streamRef = ref(db, `liveStreams/${roomName}`);
  await remove(streamRef);
}

// Subscribe to all active live streams
export function subscribeToLiveStreams(
  callback: (streams: LiveStream[]) => void
): () => void {
  const streamsRef = ref(db, 'liveStreams');
  
  const handleValue = (snapshot: import('firebase/database').DataSnapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    
    const streams: LiveStream[] = Object.values(data);
    // Sort by start time (newest first)
    streams.sort((a, b) => b.startedAt - a.startedAt);
    callback(streams);
  };

  onValue(streamsRef, handleValue);

  // Return unsubscribe function
  return () => off(streamsRef, 'value', handleValue);
}

// Subscribe to a single stream
export function subscribeToStream(
  roomName: string,
  callback: (stream: LiveStream | null) => void
): () => void {
  const streamRef = ref(db, `liveStreams/${roomName}`);
  
  const handleValue = (snapshot: import('firebase/database').DataSnapshot) => {
    const data = snapshot.val();
    callback(data);
  };

  onValue(streamRef, handleValue);

  return () => off(streamRef, 'value', handleValue);
}

// Keep stream alive (heartbeat)
export async function heartbeat(roomName: string): Promise<void> {
  const updatedRef = ref(db, `liveStreams/${roomName}/updatedAt`);
  await set(updatedRef, serverTimestamp());
}
