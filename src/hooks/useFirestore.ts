import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLocalStorage } from './useLocalStorage';

export function useFirestoreCollection<T>(collectionName: string) {
  const [localData, setLocalData] = useLocalStorage<T[]>(`${collectionName}-local`, []);
  const [data, setData] = useState<T[]>(localData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Start with local data for immediate display
    setData(localData);
    setLoading(false);

    // Then sync with Firebase in background if available
    if (db) {
      try {
        const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const items = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as T[];
            console.log(`Fetched ${items.length} items from ${collectionName}`);
            setData(items);
            setLocalData(items); // Update local storage
            setError(null);
          },
          (err) => {
            setError(err.message);
            console.error('Firebase sync error:', err);
            // Continue using local data on error
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error('Firebase query error:', err);
        setError(err instanceof Error ? err.message : 'Firebase error');
      }
    } else {
      console.log('Firebase not available, using local storage only');
    }
  }, [collectionName, localData, setLocalData]);

  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      // Add to local storage immediately
      const newItem = {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date()
      } as T;
      
      const updatedData = [newItem, ...data];
      setData(updatedData);
      setLocalData(updatedData);
      console.log('Added item locally:', newItem);

      // Then sync to Firebase if available
      if (db) {
        try {
          const docRef = await addDoc(collection(db, collectionName), {
            ...item,
            createdAt: new Date()
          });
          console.log('Added to Firebase with ID:', docRef.id);
        } catch (firebaseError) {
          console.error('Firebase add error:', firebaseError);
          // Don't throw error, local storage already updated
        }
      }
    } catch (err) {
      console.error('Firebase add error:', err);
      // Item is already in local storage, so this is not critical
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      // Update local storage immediately
      const updatedData = data.map(item => 
        (item as any).id === id ? { ...item, ...updates } : item
      );
      setData(updatedData);
      setLocalData(updatedData);

      // Then sync to Firebase if available
      if (db) {
        try {
          await updateDoc(doc(db, collectionName, id), updates);
          console.log('Updated in Firebase:', id);
        } catch (firebaseError) {
          console.error('Firebase update error:', firebaseError);
        }
      }
    } catch (err) {
      console.error('Firebase update error:', err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // Remove from local storage immediately
      const updatedData = data.filter(item => (item as any).id !== id);
      setData(updatedData);
      setLocalData(updatedData);

      // Then sync to Firebase if available
      if (db) {
        try {
          await deleteDoc(doc(db, collectionName, id));
          console.log('Deleted from Firebase:', id);
        } catch (firebaseError) {
          console.error('Firebase delete error:', firebaseError);
        }
      }
    } catch (err) {
      console.error('Firebase delete error:', err);
    }
  };

  return { data, loading, error, addItem, updateItem, deleteItem };
}

export function useFirestoreDocument<T>(collectionName: string, docId: string) {
  const [localData, setLocalData] = useLocalStorage<T | null>(`${collectionName}-${docId}-local`, null);
  const [data, setData] = useState<T | null>(localData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Start with local data for immediate display
    setData(localData);
    setLoading(false);

    // Then sync with Firebase in background if available
    if (db) {
      try {
        const unsubscribe = onSnapshot(doc(db, collectionName, docId),
          (doc) => {
            if (doc.exists()) {
              const docData = { id: doc.id, ...doc.data() } as T;
              console.log(`Fetched document ${docId} from ${collectionName}:`, docData);
              setData(docData);
              setLocalData(docData);
              setError(null);
            } else {
              console.log(`Document ${docId} does not exist in ${collectionName}`);
              // Don't clear local data if Firebase document doesn't exist
              // setData(null);
              // setLocalData(null);
            }
          },
          (err) => {
            setError(err.message);
            console.error('Firebase sync error:', err);
            // Continue using local data on error
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error('Firebase document query error:', err);
        setError(err instanceof Error ? err.message : 'Firebase error');
      }
    } else {
      console.log('Firebase not available, using local storage only');
    }
  }, [collectionName, docId, localData, setLocalData]);

  const updateDocument = async (updates: Partial<T>) => {
    try {
      // Update local storage immediately
      const updatedData = { ...data, ...updates } as T;
      setData(updatedData);
      setLocalData(updatedData);
      console.log('Updated document locally:', updatedData);

      // Then sync to Firebase if available
      if (db) {
        try {
          await setDoc(doc(db, collectionName, docId), updates, { merge: true });
          console.log('Updated document in Firebase:', docId);
        } catch (firebaseError) {
          console.error('Firebase update error:', firebaseError);
        }
      }
    } catch (err) {
      console.error('Firebase update error:', err);
    }
  };

  return { data, loading, error, updateDocument };
}