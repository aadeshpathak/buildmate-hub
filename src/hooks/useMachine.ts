import { useState, useEffect } from 'react';
import { getMachineById, type Machine } from '@/services/machineService';
import { loadMachines } from '@/data/machines';

export const useMachine = (id: string | undefined) => {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchMachine = async () => {
      try {
        setLoading(true);
        setError(null);
        const machineData = await getMachineById(id);

        // If Firestore returned no data, fall back to local file
        if (!machineData) {
          console.log('No machine from Firestore, falling back to local data...');
          try {
            const allMachines = await loadMachines();
            const localMachine = allMachines.find(m => m.id === id) || null;
            if (isMounted) {
              setMachine(localMachine);
            }
          } catch (fallbackErr) {
            console.error('Local fallback failed:', fallbackErr);
            if (isMounted) {
              setMachine(null);
            }
          }
        } else if (isMounted) {
          setMachine(machineData);
        }
      } catch (err) {
        console.error('Error fetching machine from Firebase, trying file fallback:', err);
        try {
          const allMachines = await loadMachines();
          const fallbackMachine = allMachines.find(m => m.id === id) || null;
          if (isMounted) {
            setMachine(fallbackMachine);
            setError(null);
          }
        } catch (fallbackErr) {
          console.error('File fallback also failed:', fallbackErr);
          if (isMounted) {
            setError('Failed to load machine details. Please check your connection.');
            setMachine(null);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMachine();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { machine, loading, error };
};