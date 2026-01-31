import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  doc,
  onSnapshot,
  Timestamp,
  deleteDoc,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

// Types
export interface UserMemory {
  id?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  praharNumber: number;
  uploaderName: string;
  caption?: string;
  uploadedAt: Timestamp;
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
// Prahar 1: 6AM-9AM, Prahar 2: 9AM-12PM, etc.
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
  
  // After last prahar (after 6 AM next day / prahar 8 ends at 6 AM)
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
  
  // Calculate when this prahar ends
  const praharEndHour = FESTIVAL_CONFIG.praharStartHour + (currentPrahar * FESTIVAL_CONFIG.praharDurationHours);
  
  // Time remaining calculation
  let remainingHours = praharEndHour - currentHour - 1;
  let remainingMinutes = 59 - currentMinute;
  let remainingSeconds = 59 - currentSecond;
  
  // Adjust if seconds/minutes overflow
  if (remainingSeconds < 0) {
    remainingSeconds += 60;
    remainingMinutes--;
  }
  if (remainingMinutes < 0) {
    remainingMinutes += 60;
    remainingHours--;
  }
  
  if (remainingHours < 0) return null;
  
  return { 
    hours: remainingHours, 
    minutes: remainingMinutes, 
    seconds: remainingSeconds 
  };
}

// Upload image to Firebase Storage
export async function uploadMemoryImage(
  file: File, 
  praharNumber: number,
  uploaderName: string,
  caption?: string
): Promise<UserMemory> {
  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }
  
  // Create unique filename
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const filename = `${timestamp}_${safeName}`;
  const storagePath = `memories/${FESTIVAL_CONFIG.year}/prahar-${praharNumber}/${filename}`;
  
  // Upload to Firebase Storage
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(snapshot.ref);
  
  // Save metadata to Firestore
  const memoryData: Omit<UserMemory, 'id'> = {
    imageUrl,
    praharNumber,
    uploaderName: uploaderName.trim(),
    caption: caption?.trim() || undefined,
    uploadedAt: Timestamp.now(),
    isApproved: false, // Requires approval
    festivalYear: FESTIVAL_CONFIG.year,
  };
  
  const docRef = await addDoc(collection(db, 'userMemories'), memoryData);
  
  return {
    id: docRef.id,
    ...memoryData,
  };
}

// Fetch memories for a specific prahar (approved only for public)
export async function getMemoriesForPrahar(
  praharNumber: number, 
  approvedOnly: boolean = true
): Promise<UserMemory[]> {
  const memoriesRef = collection(db, 'userMemories');
  
  let q;
  if (approvedOnly) {
    q = query(
      memoriesRef,
      where('praharNumber', '==', praharNumber),
      where('festivalYear', '==', FESTIVAL_CONFIG.year),
      where('isApproved', '==', true),
      orderBy('uploadedAt', 'desc')
    );
  } else {
    q = query(
      memoriesRef,
      where('praharNumber', '==', praharNumber),
      where('festivalYear', '==', FESTIVAL_CONFIG.year),
      orderBy('uploadedAt', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data()
  } as UserMemory));
}

// Fetch all pending memories (for admin)
export async function getPendingMemories(): Promise<UserMemory[]> {
  const memoriesRef = collection(db, 'userMemories');
  const q = query(
    memoriesRef,
    where('festivalYear', '==', FESTIVAL_CONFIG.year),
    where('isApproved', '==', false),
    orderBy('uploadedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data()
  } as UserMemory));
}

// Approve a memory
export async function approveMemory(memoryId: string): Promise<void> {
  const memoryRef = doc(db, 'userMemories', memoryId);
  await updateDoc(memoryRef, { isApproved: true });
}

// Reject/delete a memory
export async function rejectMemory(memoryId: string, imageUrl: string): Promise<void> {
  // Delete from storage
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting from storage:', error);
  }
  
  // Delete from Firestore
  const memoryRef = doc(db, 'userMemories', memoryId);
  await deleteDoc(memoryRef);
}

// Real-time listener for memories
export function subscribeToMemories(
  praharNumber: number,
  callback: (memories: UserMemory[]) => void,
  approvedOnly: boolean = true
): () => void {
  const memoriesRef = collection(db, 'userMemories');
  
  let q;
  if (approvedOnly) {
    q = query(
      memoriesRef,
      where('praharNumber', '==', praharNumber),
      where('festivalYear', '==', FESTIVAL_CONFIG.year),
      where('isApproved', '==', true),
      orderBy('uploadedAt', 'desc')
    );
  } else {
    q = query(
      memoriesRef,
      where('praharNumber', '==', praharNumber),
      where('festivalYear', '==', FESTIVAL_CONFIG.year),
      orderBy('uploadedAt', 'desc')
    );
  }
  
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const memories = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    } as UserMemory));
    callback(memories);
  });
}

// Subscribe to all pending memories (for admin)
export function subscribeToPendingMemories(
  callback: (memories: UserMemory[]) => void
): () => void {
  const memoriesRef = collection(db, 'userMemories');
  const q = query(
    memoriesRef,
    where('festivalYear', '==', FESTIVAL_CONFIG.year),
    where('isApproved', '==', false),
    orderBy('uploadedAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const memories = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    } as UserMemory));
    callback(memories);
  });
}
