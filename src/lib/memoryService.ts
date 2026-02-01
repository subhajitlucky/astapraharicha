import { getDatabase, ref, push, set, get, onValue, off, remove, update } from 'firebase/database';
import app from './firebase';

const db = getDatabase(app);

// Types
export interface UserMemory {
  id?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  praharNumber: number;
  uploaderName: string;
  caption?: string;
  uploadedAt: number; // timestamp
  isApproved: boolean;
  festivalYear: number;
}

// Festival configuration
export const FESTIVAL_CONFIG = {
  // Allowed upload dates (Jan 31, Feb 1, Feb 2, 2026)
  allowedDates: ['2026-01-31', '2026-02-01', '2026-02-02'],
  // Prahar time slots (each 3 hours, starting 6 AM)
  praharStartHour: 6, // 6:00 AM
  praharDurationHours: 3,
  totalPrahars: 8,
  year: 2026,
  // DEV MODE: Set to true to allow uploads anytime for testing
  devMode: process.env.NODE_ENV === 'development',
};

// Get current prahar based on TIME OF DAY (not date)
export function getCurrentPrahar(): number | null {
  const now = new Date();
  
  // Check if today is an allowed date (unless dev mode)
  if (!FESTIVAL_CONFIG.devMode) {
    const todayStr = now.toISOString().split('T')[0];
    if (!FESTIVAL_CONFIG.allowedDates.includes(todayStr)) {
      return null;
    }
  }
  
  const currentHour = now.getHours();
  const startHour = FESTIVAL_CONFIG.praharStartHour;
  const duration = FESTIVAL_CONFIG.praharDurationHours;
  
  // Before first prahar (before 6 AM)
  if (currentHour < startHour) return null;
  
  // Calculate which prahar based on hour
  const hoursSinceStart = currentHour - startHour;
  const prahar = Math.floor(hoursSinceStart / duration) + 1;
  
  // After last prahar
  if (prahar > FESTIVAL_CONFIG.totalPrahars) return null;
  
  return prahar;
}

// Check if uploads are allowed for a specific prahar
export function isUploadAllowed(praharNumber: number): boolean {
  const currentPrahar = getCurrentPrahar();
  return currentPrahar === praharNumber;
}

// Get time remaining in current prahar
export function getTimeRemainingInPrahar(): { hours: number; minutes: number; seconds: number } | null {
  const currentPrahar = getCurrentPrahar();
  if (!currentPrahar) return null;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  
  const praharEndHour = FESTIVAL_CONFIG.praharStartHour + (currentPrahar * FESTIVAL_CONFIG.praharDurationHours);
  
  let remainingHours = praharEndHour - currentHour - 1;
  let remainingMinutes = 59 - currentMinute;
  let remainingSeconds = 59 - currentSecond;
  
  if (remainingSeconds < 0) {
    remainingSeconds += 60;
    remainingMinutes--;
  }
  if (remainingMinutes < 0) {
    remainingMinutes += 60;
    remainingHours--;
  }
  
  if (remainingHours < 0) return null;
  
  return { hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds };
}

// Upload image to Cloudinary and save to Realtime Database
export async function uploadMemoryImage(
  file: File, 
  praharNumber: number,
  uploaderName: string,
  caption?: string
): Promise<UserMemory> {
  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }
  
  console.log('Uploading image via Cloudinary...');
  
  // Upload to Cloudinary via API route
  let imageUrl: string;
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('praharNumber', String(praharNumber));
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }
    
    imageUrl = result.url;
    console.log('Got URL:', imageUrl);
  } catch (uploadError: any) {
    console.error('Cloudinary upload error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
  }
  
  // Save to Firebase Realtime Database (FREE!)
  try {
    const memoryData: Omit<UserMemory, 'id'> = {
      imageUrl,
      praharNumber,
      uploaderName: uploaderName.trim(),
      uploadedAt: Date.now(),
      isApproved: false,
      festivalYear: FESTIVAL_CONFIG.year,
    };
    
    // Only add caption if it exists
    if (caption && caption.trim()) {
      memoryData.caption = caption.trim();
    }
    
    console.log('Saving to Realtime Database...');
    const memoriesRef = ref(db, 'userMemories');
    const newMemoryRef = push(memoriesRef);
    await set(newMemoryRef, memoryData);
    console.log('Saved with ID:', newMemoryRef.key);
    
    return {
      id: newMemoryRef.key || undefined,
      ...memoryData,
    };
  } catch (dbError: any) {
    console.error('Database save error:', dbError);
    throw new Error(`Failed to save memory data: ${dbError.message || 'Database error'}`);
  }
}

// Fetch memories for a specific prahar
export async function getMemoriesForPrahar(
  praharNumber: number, 
  approvedOnly: boolean = true
): Promise<UserMemory[]> {
  const memoriesRef = ref(db, 'userMemories');
  const snapshot = await get(memoriesRef);
  
  if (!snapshot.exists()) return [];
  
  const memories: UserMemory[] = [];
  snapshot.forEach((child) => {
    const data = child.val();
    if (data.praharNumber === praharNumber && 
        data.festivalYear === FESTIVAL_CONFIG.year &&
        (!approvedOnly || data.isApproved)) {
      memories.push({ id: child.key, ...data });
    }
  });
  
  // Sort by uploadedAt descending
  return memories.sort((a, b) => b.uploadedAt - a.uploadedAt);
}

// Fetch all pending memories (for admin)
export async function getPendingMemories(): Promise<UserMemory[]> {
  const memoriesRef = ref(db, 'userMemories');
  const snapshot = await get(memoriesRef);
  
  if (!snapshot.exists()) return [];
  
  const memories: UserMemory[] = [];
  snapshot.forEach((child) => {
    const data = child.val();
    if (data.festivalYear === FESTIVAL_CONFIG.year && !data.isApproved) {
      memories.push({ id: child.key, ...data });
    }
  });
  
  return memories.sort((a, b) => b.uploadedAt - a.uploadedAt);
}

// Approve a memory
export async function approveMemory(memoryId: string): Promise<void> {
  const memoryRef = ref(db, `userMemories/${memoryId}`);
  await update(memoryRef, { isApproved: true });
}

// Reject/delete a memory
export async function rejectMemory(memoryId: string, imageUrl: string): Promise<void> {
  const memoryRef = ref(db, `userMemories/${memoryId}`);
  await remove(memoryRef);
}

// Real-time listener for memories
export function subscribeToMemories(
  praharNumber: number,
  callback: (memories: UserMemory[]) => void,
  approvedOnly: boolean = true
): () => void {
  const memoriesRef = ref(db, 'userMemories');
  
  const handleValue = (snapshot: import('firebase/database').DataSnapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const memories: UserMemory[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.praharNumber === praharNumber && 
          data.festivalYear === FESTIVAL_CONFIG.year &&
          (!approvedOnly || data.isApproved)) {
        memories.push({ id: child.key, ...data });
      }
    });
    
    callback(memories.sort((a, b) => b.uploadedAt - a.uploadedAt));
  };
  
  onValue(memoriesRef, handleValue);
  return () => off(memoriesRef, 'value', handleValue);
}

// Subscribe to all pending memories (for admin)
export function subscribeToPendingMemories(
  callback: (memories: UserMemory[]) => void
): () => void {
  const memoriesRef = ref(db, 'userMemories');
  
  const handleValue = (snapshot: import('firebase/database').DataSnapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const memories: UserMemory[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.festivalYear === FESTIVAL_CONFIG.year && !data.isApproved) {
        memories.push({ id: child.key, ...data });
      }
    });
    
    callback(memories.sort((a, b) => b.uploadedAt - a.uploadedAt));
  };
  
  onValue(memoriesRef, handleValue);
  return () => off(memoriesRef, 'value', handleValue);
}
