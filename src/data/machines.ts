import { MachineDataService } from "@/services/machineDataService";

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
}

// Initialize service
const machineDataService = MachineDataService.getInstance();

// Dynamic machines loaded from file
export let machines: Machine[] = [];

// Load machines asynchronously
export const loadMachines = async (): Promise<Machine[]> => {
  const parsedMachines = await machineDataService.loadMachinesFromFile();
  machines = parsedMachines.map(machine => machineDataService.convertToMachineFormat(machine));
  return machines;
};

// Get machines synchronously (after loading)
export const getMachines = (): Machine[] => {
  return machines;
};

export const categories = [
   { id: "slcm", name: "Self-Loading Concrete Mixers", icon: "🏗️", count: 22, description: "ARGO series with capacities from 1-5.0 cu.m" },
  { id: "crb", name: "CRB Batching Plants", icon: "🏭", count: 7, description: "Modular batching plants 20-120 cu.m/hr" },
  { id: "irb", name: "IRB Batching Plants", icon: "🏭", count: 6, description: "Inline bin batching plants 30-120 cu.m/hr" },
  { id: "ibp", name: "IBP Batching Plants", icon: "🏭", count: 9, description: "Belt conveyor batching plants 30-240 cu.m/hr" },
  { id: "af", name: "Transit Mixers", icon: "🚛", count: 7, description: "AF series 6-11 cu.m PTO driven mixers" },
  { id: "asp", name: "Concrete Pumps", icon: "🏗️", count: 7, description: "ASP series 30-97 cu.m/hr output" },
];

export const stats = [
   { label: "AJAX Machines Available", value: "58" },
  { label: "Global Projects Completed", value: "20,000+" },
  { label: "Countries Exported To", value: "50+" },
  { label: "Years of Excellence", value: "35+" },
];
