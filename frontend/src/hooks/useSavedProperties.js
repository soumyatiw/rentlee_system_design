'use client';

import { useState, useEffect } from 'react';
import { getSavedProperties, saveProperty, unsaveProperty } from '@/lib/api';
import { useAuthContext } from '@/context/AuthContext';

export default function useSavedProperties() {
  const [savedIds, setSavedIds] = useState(new Set());
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || user.role !== 'user') return;

    let mounted = true;
    const fetchSaved = async () => {
      try {
        const res = await getSavedProperties();
        if (mounted && res.success && res.data) {
          const ids = res.data.map(property => {
             // Depending on whether backend populates or not
             return typeof property === 'string' ? property : property._id;
          });
          setSavedIds(new Set(ids));
        }
      } catch (error) {
        console.error('Failed to fetch saved properties', error);
      }
    };

    fetchSaved();
    return () => { mounted = false; };
  }, [user]);

  const toggleSave = async (propertyId) => {
    if (!user || user.role !== 'user') return false;
    
    // Optimistic UI update
    const newSaved = new Set(savedIds);
    const isSaved = newSaved.has(propertyId);
    if (isSaved) {
      newSaved.delete(propertyId);
    } else {
      newSaved.add(propertyId);
    }
    setSavedIds(newSaved);

    try {
      if (isSaved) {
        await unsaveProperty(propertyId);
      } else {
        await saveProperty(propertyId);
      }
      return true;
    } catch (error) {
      console.error('Failed to toggle save', error);
      // Revert on failure
      setSavedIds(savedIds);
      return false;
    }
  };

  const isSaved = (propertyId) => savedIds.has(propertyId);

  return { savedIds, toggleSave, isSaved };
}
