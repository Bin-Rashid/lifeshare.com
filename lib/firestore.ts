import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { User, AppConfig } from '@/types';

// User operations
export const createUser = async (userData: Omit<User, 'uid' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'users'), {
    ...userData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const getUser = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { uid: docSnap.id, ...docSnap.data() } as User : null;
};

export const updateUser = async (uid: string, userData: Partial<User>) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, userData);
};

export const deleteUser = async (uid: string) => {
  await deleteDoc(doc(db, 'users', uid));
};

export const getAllDonors = async (filters?: { district?: string; city?: string; bloodGroup?: string }) => {
  let q = query(collection(db, 'users'), where('role', '==', 'donor'));
  
  if (filters?.district) {
    q = query(q, where('district', '==', filters.district));
  }
  if (filters?.city) {
    q = query(q, where('city', '==', filters.city));
  }
  if (filters?.bloodGroup) {
    q = query(q, where('bloodGroup', '==', filters.bloodGroup));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
};

// App config operations
export const getAppConfig = async (): Promise<AppConfig> => {
  const docRef = doc(db, 'config', 'app');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as AppConfig;
  }
  
  // Default config
  return {
    heroQuote: 'রক্তদান জীবনদান - একটি রক্ত অনেকগুলো জীবন বাঁচাতে পারে',
    whatsappNumber: '+880XXXXXXXXX'
  };
};

export const updateAppConfig = async (config: Partial<AppConfig>) => {
  const docRef = doc(db, 'config', 'app');
  await updateDoc(docRef, config);
};

// File upload
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};