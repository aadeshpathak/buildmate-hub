import { collection, query, orderBy, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Machine {
  id: string;
  name: string;
  category: string;
  image: string;
  pricePerHour: number;
  pricePerDay: number;
  rating: number;
  reviews: number;
  available: boolean;
  location: string;
  specs: Record<string, string>;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Fetch all machines
export async function getMachines(): Promise<Machine[]> {
  try {
    const machinesRef = collection(db, 'machines');
    const q = query(machinesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Machine[];
  } catch (error) {
    console.error('Error fetching machines:', error);
    return [];
  }
}

// Fetch machine by ID
export async function getMachineById(id: string): Promise<Machine | null> {
  try {
    const docRef = doc(db, 'machines', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as Machine;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching machine:', error);
    return null;
  }
}

// Search machines
export async function searchMachines(searchTerm: string): Promise<Machine[]> {
  try {
    const machinesRef = collection(db, 'machines');
    const q = query(machinesRef, orderBy('name'));
    const querySnapshot = await getDocs(q);

    const allMachines = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Machine[];

    // Client-side filtering for search
    return allMachines.filter(machine =>
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching machines:', error);
    return [];
  }
}

// Filter machines by category
export async function getMachinesByCategory(categoryId: string): Promise<Machine[]> {
  try {
    let categoryFilter: string;

    // For flexible filtering, we'll use the categoryId as-is and do smart matching
    categoryFilter = categoryId;

    // First get all machines, then filter client-side to avoid Firestore index issues
    const machinesRef = collection(db, 'machines');
    const q = query(machinesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const allMachines = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Machine[];

    // Client-side filtering by category
    // Very flexible filtering that tries multiple matching strategies
    const result = allMachines.filter(machine => {
      const machineCategory = machine.category.toLowerCase();
      const filterCategory = categoryId.toLowerCase();

      // Exact match (case insensitive)
      if (machineCategory === filterCategory) return true;

      // Partial match - if either contains the other
      if (machineCategory.includes(filterCategory) || filterCategory.includes(machineCategory)) return true;

      // Special batching plants logic
      if (filterCategory.includes('batch') && (
        machineCategory.includes('batch') ||
        machineCategory.includes('crb') ||
        machineCategory.includes('irb') ||
        machineCategory.includes('ibp')
      )) return true;

      // Special concrete mixers logic
      if ((filterCategory.includes('slcm') || filterCategory.includes('mixer')) &&
          (machineCategory.includes('slcm') || machineCategory.includes('mixer'))) return true;

      // Special transit mixers logic
      if (filterCategory.includes('transit') && machineCategory.includes('transit')) return true;

      // Special concrete pumps logic
      if (filterCategory.includes('pump') && machineCategory.includes('pump')) return true;

      return false;
    });

    return result;
  } catch (error) {
    console.error('Error fetching machines by category:', error);
    return [];
  }
}

// Get total count of machines in Firestore
export async function getMachinesCount(): Promise<number> {
  try {
    const machinesRef = collection(db, 'machines');
    const querySnapshot = await getDocs(machinesRef);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting machines count:', error);
    return 0;
  }
}

// Check if Firestore has data
export async function hasData(): Promise<boolean> {
  try {
    const count = await getMachinesCount();
    return count > 0;
  } catch (error) {
    console.error('Error checking data existence:', error);
    return false;
  }
}

// Verify Firestore data integrity
export async function verifyFirestoreData(): Promise<{
  totalCount: number;
  categories: Record<string, number>;
  sampleData: Machine[];
  isValid: boolean;
}> {
  try {
    const machines = await getMachines();

    // Count by category
    const categories: Record<string, number> = {};
    machines.forEach(machine => {
      categories[machine.category] = (categories[machine.category] || 0) + 1;
    });

    // Get sample data
    const sampleData = machines.slice(0, 5);

    return {
      totalCount: machines.length,
      categories,
      sampleData,
      isValid: machines.length > 0 && Object.keys(categories).length > 0
    };
  } catch (error) {
    console.error('Error verifying Firestore data:', error);
    return {
      totalCount: 0,
      categories: {},
      sampleData: [],
      isValid: false
    };
  }
}