import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase';
import { GeneratedItinerary, SavedTrip, TravelMemory, ContactMessage } from '../types/travel';

/* =========================================================================
   MY TRIPS (FIRESTORE)
   Path: users/{userId}/trips/{tripId}
   ========================================================================= */

export async function saveTripToFirestore(
  userId: string,
  itinerary: GeneratedItinerary
): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized');

  const tripDocRef = doc(collection(db, 'users', userId, 'trips'));
  const tripDocId = tripDocRef.id;

  const tripData = {
    firestoreId: tripDocId,
    itinerary,
    userId,
    savedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    createdAt: serverTimestamp(),
  };

  await setDoc(tripDocRef, tripData);
  return tripDocId;
}

export async function loadUserTripsFromFirestore(userId: string): Promise<SavedTrip[]> {
  if (!db) throw new Error('Firestore is not initialized');

  try {
    const tripsCol = collection(db, 'users', userId, 'trips');
    const q = query(tripsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const trips: SavedTrip[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      trips.push({
        id: data.itinerary?.id || docSnap.id,
        firestoreId: docSnap.id,
        userId: data.userId || userId,
        itinerary: data.itinerary,
        savedAt: data.savedAt || 'Recently',
      });
    });

    return trips;
  } catch (err: any) {
    // If index or order error, try fallback without orderBy
    console.warn('Trips query with order fallback:', err);
    const tripsCol = collection(db, 'users', userId, 'trips');
    const snapshot = await getDocs(tripsCol);
    const trips: SavedTrip[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      trips.push({
        id: data.itinerary?.id || docSnap.id,
        firestoreId: docSnap.id,
        userId: data.userId || userId,
        itinerary: data.itinerary,
        savedAt: data.savedAt || 'Recently',
      });
    });
    return trips;
  }
}

export async function deleteTripFromFirestore(userId: string, firestoreId: string): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized');
  const docRef = doc(db, 'users', userId, 'trips', firestoreId);
  await deleteDoc(docRef);
}

/* =========================================================================
   MEMORIES (FIREBASE STORAGE & FIRESTORE)
   Storage path: users/{userId}/memories/{timestamp}_{filename}
   Firestore doc: users/{userId}/memories/{memoryId}
   ========================================================================= */

export async function uploadMemoryToFirebase(
  userId: string,
  params: {
    travelerName: string;
    destination: string;
    date: string;
    caption: string;
    imageFile: File;
  }
): Promise<TravelMemory> {
  if (!db || !storage) throw new Error('Firebase services are not initialized');

  const { travelerName, destination, date, caption, imageFile } = params;

  // 1. Upload to Firebase Storage in user's isolated folder
  const sanitizedFileName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `users/${userId}/memories/${Date.now()}_${sanitizedFileName}`;
  const imageRef = ref(storage, storagePath);

  // Upload byte data
  const uploadResult = await uploadBytes(imageRef, imageFile, {
    contentType: imageFile.type || 'image/jpeg',
  });

  // Retrieve download URL
  const photoUrl = await getDownloadURL(uploadResult.ref);

  // 2. Save metadata document in Firestore under users/{userId}/memories
  const memoryDocRef = doc(collection(db, 'users', userId, 'memories'));
  const memoryId = memoryDocRef.id;

  const memoryData = {
    id: memoryId,
    travelerName,
    destination,
    date,
    caption,
    photoUrl,
    storagePath,
    userId,
    createdAt: serverTimestamp(),
  };

  await setDoc(memoryDocRef, memoryData);

  return {
    id: memoryId,
    travelerName,
    destination,
    date,
    caption,
    photoUrl,
    storagePath,
    userId,
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

export async function loadMemoriesFromFirestore(userId?: string): Promise<TravelMemory[]> {
  if (!db) throw new Error('Firestore is not initialized');
  if (!userId) return [];

  try {
    const userMemCol = collection(db, 'users', userId, 'memories');
    const q = query(userMemCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const memories: TravelMemory[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      let createdStr = 'Recently';
      if (data.createdAt instanceof Timestamp) {
        createdStr = data.createdAt.toDate().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }

      memories.push({
        id: docSnap.id,
        travelerName: data.travelerName || 'Explorer',
        destination: data.destination || 'Goa',
        date: data.date || '',
        caption: data.caption || '',
        photoUrl: data.photoUrl || '',
        storagePath: data.storagePath,
        userId: data.userId || userId,
        createdAt: createdStr,
      });
    });

    return memories;
  } catch (err: any) {
    console.warn('User memories query order fallback:', err);
    try {
      const userMemCol = collection(db, 'users', userId, 'memories');
      const snapshot = await getDocs(userMemCol);
      const memories: TravelMemory[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        memories.push({
          id: docSnap.id,
          travelerName: data.travelerName || 'Explorer',
          destination: data.destination || 'Goa',
          date: data.date || '',
          caption: data.caption || '',
          photoUrl: data.photoUrl || '',
          storagePath: data.storagePath,
          userId: data.userId || userId,
          createdAt: 'Recently',
        });
      });
      return memories;
    } catch (fallbackErr) {
      console.warn('Failed to load user memories from Firestore:', fallbackErr);
      return [];
    }
  }
}

export async function deleteMemoryFromFirebase(
  userId: string,
  memoryId: string,
  storagePath?: string
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized');

  // 1. Delete image file from Storage if exists
  if (storage && storagePath) {
    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
    } catch (err: any) {
      // Ignore 404/not-found to allow clean metadata deletion
      if (err?.code !== 'storage/object-not-found') {
        console.warn('Storage deletion skipped or file not found:', err);
      }
    }
  }

  // 2. Delete document from Firestore user subcollection
  if (userId) {
    try {
      const docRef = doc(db, 'users', userId, 'memories', memoryId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore user memory doc delete error:', err);
    }
  }

  // Also clean up root collection document if it was created under legacy structure
  try {
    const rootDocRef = doc(db, 'memories', memoryId);
    await deleteDoc(rootDocRef);
  } catch {
    // Ignore legacy cleanup errors
  }
}

/* =========================================================================
   CONTACT FORM (FIRESTORE)
   Collection: contactMessages/{messageId}
   ========================================================================= */

export async function submitContactMessageToFirestore(data: {
  username: string;
  email: string;
  phoneNumber: string;
  message: string;
}): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized');

  const payload = {
    username: data.username.trim(),
    email: data.email.trim(),
    phoneNumber: data.phoneNumber.trim(),
    phone: data.phoneNumber.trim(),
    'phone number': data.phoneNumber.trim(),
    message: data.message.trim(),
    createdAt: serverTimestamp(),
    timestamp: serverTimestamp(),
    timestampIso: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, 'contactMessages'), payload);
  return docRef.id;
}
