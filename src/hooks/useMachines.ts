import { useState, useEffect, useCallback } from 'react';
import { getMachines, searchMachines, getMachinesByCategory, type Machine } from '@/services/machineService';

export const useMachines = (searchTerm?: string, category?: string) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreMachines = useCallback(async () => {
    try {
      let machineData: Machine[];

      if (searchTerm && searchTerm.trim()) {
        machineData = await searchMachines(searchTerm.trim());
      } else if (category && category !== 'all') {
        machineData = await getMachinesByCategory(category);
      } else {
        machineData = await getMachines();
      }

      // Load all machines at once for better performance
      if (machineData.length > 0) {
        setMachines(machineData);
        setLoadedCount(machineData.length);
        setHasMore(false);
      } else {
        setMachines([]);
        setLoadedCount(0);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching machines from Firebase:', err);
      setError('Failed to connect to Firebase. Please check your internet connection.');
      setMachines([]);
      setLoadedCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category]);

  useEffect(() => {
    let isMounted = true;

    const fetchMachines = async () => {
      if (isMounted) {
        setLoading(true);
        setError(null);
        await loadMoreMachines();
      }
    };

    fetchMachines();

    return () => {
      isMounted = false;
    };
  }, [loadMoreMachines]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    setMachines([]);
    setLoadedCount(0);
    setHasMore(true);
    await loadMoreMachines();
  };

  return {
    machines,
    loading,
    error,
    loadedCount,
    hasMore,
    loadMore: loadMoreMachines,
    refetch
  };
};