import { useState, useEffect } from 'react';
import { getMachineById, type Machine } from '@/services/machineService';

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

        if (isMounted) {
          setMachine(machineData);
        }
      } catch (err) {
        console.error('Error fetching machine:', err);
        if (isMounted) {
          setError('Failed to connect to Firebase. Please check your internet connection and Firebase configuration.');
          setMachine(null);
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