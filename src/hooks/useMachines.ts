import { useState, useEffect } from 'react';
import { Machine, loadMachines, getMachines } from '@/data/machines';

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMachineData = async () => {
      try {
        setLoading(true);
        const machineData = await loadMachines();

        if (isMounted) {
          setMachines(machineData);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading machines:', err);
        if (isMounted) {
          setError('Failed to load machine data');
          // Set some fallback machines if loading fails
          setMachines([
            {
              id: 'fallback-1',
              name: 'Argo 2000 Self-Loading Concrete Mixer',
              category: 'SLCM',
              image: '/assets/argo-2000.webp',
              pricePerHour: 400,
              pricePerDay: 9600,
              rating: 4.9,
              reviews: 150,
              available: true,
              location: 'Mumbai, MH',
              specs: {
                'Capacity': '2 m³',
                'Swivel Drum': 'No',
                'Load Cell': 'No'
              },
              description: 'Premium self-loading concrete mixer'
            }
          ]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMachineData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { machines, loading, error, refetch: () => loadMachines().then(setMachines) };
};