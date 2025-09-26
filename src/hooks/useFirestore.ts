import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
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

    // Then sync with Firebase in background
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
        setLocalData(items); // Update local storage
      },
      (err) => {
        setError(err.message);
        console.error('Firebase sync error:', err);
        // Continue using local data on error
      }
    );

    return () => unsubscribe();
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

      // Then sync to Firebase
      await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: new Date()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Firebase add error:', err);
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

      // Then sync to Firebase
      await updateDoc(doc(db, collectionName, id), updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Firebase update error:', err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // Remove from local storage immediately
      const updatedData = data.filter(item => (item as any).id !== id);
      setData(updatedData);
      setLocalData(updatedData);

      // Then sync to Firebase
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

    // Then sync with Firebase in background
    const unsubscribe = onSnapshot(doc(db, collectionName, docId),
      (doc) => {
        if (doc.exists()) {
          const docData = { id: doc.id, ...doc.data() } as T;
          setData(docData);
          setLocalData(docData);
        } else {
          setData(null);
          setLocalData(null);
        }
      },
      (err) => {
        setError(err.message);
        console.error('Firebase sync error:', err);
        // Continue using local data on error
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId, localData, setLocalData]);

  const updateDocument = async (updates: Partial<T>) => {
    try {
      // Update local storage immediately
      const updatedData = { ...data, ...updates } as T;
      setData(updatedData);
      setLocalData(updatedData);

      // Then sync to Firebase
      await updateDoc(doc(db, collectionName, docId), updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Firebase update error:', err);
    }
  };

  return { data, loading, error, updateDocument };
}