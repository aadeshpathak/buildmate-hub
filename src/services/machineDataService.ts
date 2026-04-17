import { Machine } from "../data/machines";

export interface ParsedMachine {
  id: string;
  model: string;
  description: string;
  capacity: string;
  listPrice: number;
  aspPrice: number;
  hasSwivelDrum: boolean;
  hasLoadCell: boolean;
  isAcura: boolean;
}

export class MachineDataService {
  private static instance: MachineDataService;
  private parsedMachines: ParsedMachine[] = [];
  private dataLoaded = false;

  private constructor() {}

  static getInstance(): MachineDataService {
    if (!MachineDataService.instance) {
      MachineDataService.instance = new MachineDataService();
    }
    return MachineDataService.instance;
  }

  async loadMachinesFromFile(): Promise<ParsedMachine[]> {
    // Return cached data if already loaded
    if (this.dataLoaded && Array.isArray(this.parsedMachines) && this.parsedMachines.length > 0) {
      return [...this.parsedMachines]; // Return a copy to prevent mutations
    }

    try {
      const response = await fetch('/machines-details.txt');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty machine data file');
      }

      this.parsedMachines = this.parseMachineData(text);

      // If no machines parsed, use fallback data
      if (!Array.isArray(this.parsedMachines) || this.parsedMachines.length === 0) {
        console.warn('No machines parsed from file, using fallback data');
        this.parsedMachines = this.getFallbackMachines();
      }

      this.dataLoaded = true;
      return [...this.parsedMachines]; // Return a copy
    } catch (error) {
      console.error('Failed to load machine data:', error);
      // Use fallback data
      this.parsedMachines = this.getFallbackMachines();
      this.dataLoaded = true;
      return [...this.parsedMachines]; // Return a copy
    }
  }

  private getFallbackMachines(): ParsedMachine[] {
    return [
      {
        id: 'argo-1000',
        model: 'Argo 1000',
        description: 'Self Loading Concrete Mixer (1 m3, non swivel drum)',
        capacity: '1 m³',
        listPrice: 1775000,
        aspPrice: 2080000,
        hasSwivelDrum: false,
        hasLoadCell: false,
        isAcura: false
      },
      {
        id: 'argo-2000',
        model: 'Argo 2000',
        description: 'Self Loading Concrete Mixer (2 m3, non swivel drum)',
        capacity: '2 m³',
        listPrice: 2940000,
        aspPrice: 3450000,
        hasSwivelDrum: false,
        hasLoadCell: false,
        isAcura: false
      },
      {
        id: 'argo-2300',
        model: 'Argo 2300',
        description: 'Self Loading Concrete Mixer (2.3 m3, swivel drum)',
        capacity: '2.3 m³',
        listPrice: 3115000,
        aspPrice: 3650000,
        hasSwivelDrum: true,
        hasLoadCell: false,
        isAcura: false
      },
      {
        id: 'argo-2300-acura',
        model: 'Argo 2300 Acura',
        description: 'Self Loading Concrete Mixer (2.3 m3, swivel drum, load cell)',
        capacity: '2.3 m³',
        listPrice: 3165000,
        aspPrice: 3725000,
        hasSwivelDrum: true,
        hasLoadCell: true,
        isAcura: true
      },
      {
        id: 'argo-2800',
        model: 'Argo 2800',
        description: 'Self Loading Concrete Mixer (2.8 m3, swivel drum)',
        capacity: '2.8 m³',
        listPrice: 3515000,
        aspPrice: 4125000,
        hasSwivelDrum: true,
        hasLoadCell: false,
        isAcura: false
      }
    ];
  }

  private parseMachineData(text: string): ParsedMachine[] {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const machines: ParsedMachine[] = [];

    let currentSection = '';
    let parsingPriceList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Section headers
      if (line.includes('=== SLCM')) {
        currentSection = 'SLCM';
        continue;
      }
      if (line.includes('=== BATCHING PLANTS - CRB')) {
        currentSection = 'CRB';
        continue;
      }
      if (line.includes('=== BATCHING PLANTS - IRB')) {
        currentSection = 'IRB';
        continue;
      }
      if (line.includes('=== BATCHING PLANTS - IBP')) {
        currentSection = 'IBP';
        continue;
      }
      if (line.includes('=== TRANSIT MIXERS')) {
        currentSection = 'AF';
        continue;
      }
      if (line.includes('=== CONCRETE PUMPS')) {
        currentSection = 'ASP';
        continue;
      }

      // Skip headers and notes
      if (line.includes('===') || line.includes('PRICE LIST') || line.includes('Overview') ||
          line.includes('Features') || line.includes('Applications') || line.includes('Models') ||
          line.includes('Salient Features') || line.includes('Technical Highlights') ||
          line.includes('Note:') || line.includes('NOTES') || line.includes('AJAX') ||
          line.includes('Made in India') || line.includes('Categories') || line.includes('Capacity Range') ||
          line.includes('Key Features') || line.includes('Sl No') || line.includes('Machine Model') ||
          line.includes('Description') || line.includes('Capacity') || line.includes('List Price') ||
          line.includes('ASP Price') || line.includes('Avg Price') || line.includes('Output')) {
        if (line.includes('PRICE LIST')) parsingPriceList = true;
        continue;
      }

      // Parse SLCM machines (numbered lines with prices)
      if (currentSection === 'SLCM' && /^\d+/.test(line) && line.includes('Argo')) {
        let fullLine = line;

        // Check if next lines are continuation (Argo model or Acura)
        let j = i + 1;
        while (j < lines.length) {
          const nextLine = lines[j];
          if (nextLine.match(/^Argo\s+\d+/) || nextLine.includes('Acura')) {
            fullLine += ' ' + nextLine;
            i = j; // Skip this line in main loop
            j++;
          } else {
            break;
          }
        }

        const machine = this.parseSLCMachineLine(fullLine);
        if (machine) {
          machines.push(machine);
        }
      }

      // Parse other machine types (model - capacity format)
      else if ((currentSection === 'CRB' || currentSection === 'IRB' || currentSection === 'IBP' ||
                currentSection === 'AF' || currentSection === 'ASP') && line.includes('-')) {
        const machine = this.parseOtherMachineLine(line, currentSection);
        if (machine) {
          machines.push(machine);
        }
      }
    }

    return machines;
  }

  private parseSLCMachineLine(line: string): ParsedMachine | null {
    try {
      // Extract prices using regex - look for the pattern XX,XX,XXX XX,XX,XXX at the end
      const priceRegex = /(\d+(?:,\d{3})*)\s+(\d+(?:,\d{3})*)$/;
      const priceMatch = line.match(priceRegex);

      if (!priceMatch) return null;

      const listPriceStr = priceMatch[1];
      const aspPriceStr = priceMatch[2];
      const descriptionPart = line.replace(priceRegex, '').trim();

      // Extract serial number
      const slNoMatch = descriptionPart.match(/^(\d+)/);
      if (!slNoMatch) return null;

      const slNo = slNoMatch[1];
      const modelDesc = descriptionPart.replace(/^\d+\s*/, '');

      // Parse prices
      const listPrice = parseInt(listPriceStr.replace(/,/g, ''), 10);
      const aspPrice = parseInt(aspPriceStr.replace(/,/g, ''), 10);

      // Initialize variables
      let model = '';
      let capacity = '';
      let hasSwivelDrum = false;
      let hasLoadCell = false;
      let isAcura = false;

      // Extract model name
      const argoMatch = line.match(/Argo\s+(\d+)/);
      if (argoMatch) {
        model = `Argo ${argoMatch[1]}`;
      }

      // Extract capacity
      const capacityMatch = modelDesc.match(/(\d+(?:\.\d+)?)\s*m3/);
      if (capacityMatch) {
        capacity = `${capacityMatch[1]} m³`;
      }

      // Check for features
      const fullDesc = modelDesc.toLowerCase();
      hasSwivelDrum = fullDesc.includes('swivel drum');
      hasLoadCell = fullDesc.includes('load cell');
      isAcura = fullDesc.includes('acura');

      // If no model but we have capacity, infer model from capacity
      if (!model && capacity) {
        const capNum = parseFloat(capacity);
        const capacityMap: Record<string, string> = {
          '1': 'Argo 1000',
          '2': 'Argo 2000',
          '2.3': 'Argo 2300',
          '2.8': 'Argo 2800',
          '3.5': 'Argo 3500',
          '4.3': 'Argo 4300',
          '4.8': 'Argo 4800'
        };
        model = capacityMap[capNum.toString()] || `Argo ${Math.round(capNum * 1000)}`;
      }

      // Generate ID
      const id = model ? model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : `argo-${slNo}`;

      return {
        id,
        model: model || `Argo ${slNo}`,
        description: modelDesc,
        capacity,
        listPrice,
        aspPrice,
        hasSwivelDrum,
        hasLoadCell,
        isAcura
      };
    } catch (error) {
      console.error('Error parsing machine line:', error);
      return null;
    }
  }

  private parseOtherMachineLine(line: string, category: string): ParsedMachine | null {
    try {
      // Parse lines like "CRB 20 - 20 cu.m/hr" or "CRB 20 - 20 cu.m/hr - 20,00,000 24,00,000"
      const parts = line.split(' - ');
      if (parts.length < 2) return null;

      const model = parts[0].trim();
      const capacity = parts[1].trim();
      let listPrice = 0;
      let aspPrice = 0;

      // Check if there are prices after another -
      if (parts.length >= 3) {
        const pricePart = parts[2].trim();
        const priceMatch = pricePart.match(/(\d+(?:,\d{3})*)\s+(\d+(?:,\d{3})*)$/);
        if (priceMatch) {
          listPrice = parseInt(priceMatch[1].replace(/,/g, ''));
          aspPrice = parseInt(priceMatch[2].replace(/,/g, ''));
        }
      }

      // Generate ID
      const id = model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // If prices not parsed, set default prices based on category
      if (listPrice === 0 || aspPrice === 0) {
        // Default pricing based on category and capacity
        if (category.startsWith('CRB') || category.startsWith('IRB') || category.startsWith('IBP')) {
          // Batching plants - price per capacity
          const capNum = parseInt(capacity);
          listPrice = capNum * 50000; // Rough estimate
          aspPrice = capNum * 60000;
        } else if (category === 'AF') {
          // Transit mixers
          const capNum = parseInt(capacity);
          listPrice = capNum * 800000; // Rough estimate
          aspPrice = capNum * 950000;
        } else if (category === 'ASP') {
          // Concrete pumps
          const capNum = parseInt(capacity);
          listPrice = capNum * 120000; // Rough estimate
          aspPrice = capNum * 140000;
        }
      }

      return {
        id,
        model,
        description: `${model} ${category} Series`,
        capacity,
        listPrice,
        aspPrice,
        hasSwivelDrum: false,
        hasLoadCell: category.includes('Acura') || category === 'SLCM',
        isAcura: category.includes('Acura')
      };
    } catch (error) {
      console.error('Error parsing other machine line:', error);
      return null;
    }
  }

  getAllMachines(): ParsedMachine[] {
    return this.parsedMachines;
  }

  getMachineById(id: string): ParsedMachine | undefined {
    return this.parsedMachines.find(machine => machine.id === id);
  }

  getMachinesByCapacity(minCapacity?: number, maxCapacity?: number): ParsedMachine[] {
    return this.parsedMachines.filter(machine => {
      const capacity = parseFloat(machine.capacity);
      if (minCapacity && capacity < minCapacity) return false;
      if (maxCapacity && capacity > maxCapacity) return false;
      return true;
    });
  }

  convertToMachineFormat(parsedMachine: ParsedMachine): Machine {
    try {
      if (!parsedMachine || typeof parsedMachine !== 'object') {
        throw new Error('Invalid parsed machine data');
      }

      // Available images mapping for different categories
      const availableImages: { [key: string]: string } = {
        // SLCM (Argo series)
        'argo-1000': '/assets/argo-2000.webp',
        'argo-2000': '/assets/argo-2000.webp',
        'argo-2300': '/assets/argo-2300.avif',
        'argo-2300-acura': '/assets/argo-2300.avif',
        'argo-2800': '/assets/argo-2800.webp',
        'argo-2800-acura': '/assets/argo-2800.webp',
        'argo-3500': '/assets/argo-3500.webp',
        'argo-3500-acura': '/assets/argo-3500.webp',
        'argo-4300': '/assets/argo-4500.avif',
        'argo-4300-acura': '/assets/argo-4500.avif',
        'argo-4800': '/assets/argo-4800.webp',
        'argo-4800-acura': '/assets/argo-4800.webp',
        'argo-5000': '/assets/argo-4800.webp',
        'argo-5000-acura': '/assets/argo-4800.webp',

        // Default images for other categories
        'crb': '/src/assets/machine-crane.jpg',
        'irb': '/src/assets/machine-crane.jpg',
        'ibp': '/src/assets/machine-crane.jpg',
        'af': '/src/assets/machine-bulldozer.jpg',
        'asp': '/src/assets/machine-backhoe.jpg'
      };

      // Determine category and image
      let category = "SLCM";
      let imageKey = (parsedMachine.model || '').toLowerCase().replace(/\s+/g, '-');

      if ((parsedMachine.model || '').startsWith('CRB')) {
        category = "CRB";
        imageKey = 'crb';
      } else if ((parsedMachine.model || '').startsWith('IRB')) {
        category = "IRB";
        imageKey = 'irb';
      } else if ((parsedMachine.model || '').startsWith('IBP')) {
        category = "IBP";
        imageKey = 'ibp';
      } else if ((parsedMachine.model || '').startsWith('AF')) {
        category = "AF";
        imageKey = 'af';
      } else if ((parsedMachine.model || '').startsWith('ASP')) {
        category = "ASP";
        imageKey = 'asp';
      } else if (parsedMachine.isAcura) {
        imageKey += '-acura';
      }

      const image = availableImages[imageKey] || availableImages[imageKey.replace('-acura', '')] || '/src/assets/machine-mixer.jpg';

      // Calculate daily rates based on category with error handling
      let dailyRate = 0;
      try {
        dailyRate = Math.round((parsedMachine.aspPrice || 0) * 0.08); // Default 8% of ASP per day

        // Adjust rates based on category
        if (category === 'CRB' || category === 'IRB' || category === 'IBP') {
          // Batching plants - higher daily rates due to capacity
          const capacityNum = parseInt(parsedMachine.capacity || '0') || 30;
          dailyRate = capacityNum * 1000; // Rough estimate per cu.m/hr
        } else if (category === 'AF') {
          // Transit mixers
          const capacityNum = parseInt(parsedMachine.capacity || '0') || 6;
          dailyRate = capacityNum * 15000; // Rough estimate per cu.m
        } else if (category === 'ASP') {
          // Concrete pumps
          const capacityNum = parseInt(parsedMachine.capacity || '0') || 30;
          dailyRate = capacityNum * 800; // Rough estimate per cu.m/hr
        }
      } catch (error) {
        console.warn('Error calculating rates for machine:', parsedMachine.model, error);
        dailyRate = 10000; // Fallback rate
      }

      const hourlyRate = Math.round(dailyRate / 8);

      // Create detailed specs based on category with error handling
      let specs: Record<string, string> = {};

      try {
        if (category === 'SLCM') {
          specs = {
            "Capacity": parsedMachine.capacity || 'N/A',
            "Engine": "Mahindra / Kirloskar / Ashok Leyland",
            "Water Pump": "230–400 LPM",
            "Speed": "Up to ~29 km/h",
            "List Price": `₹${(parsedMachine.listPrice || 0).toLocaleString()}`,
            "ASP Price": `₹${(parsedMachine.aspPrice || 0).toLocaleString()}`,
            "Swivel Drum": parsedMachine.hasSwivelDrum ? "Yes" : "No",
            "Load Cell Weighing": parsedMachine.hasLoadCell ? "Yes" : "No",
            "Telematics": "Yes",
            "3-Way Steering + 4WD": "Yes",
            "Auto Cleaning System": "Yes",
            "Electronic Drum Control": "Yes"
          };
        } else if (category.startsWith('CRB') || category.startsWith('IRB') || category.startsWith('IBP')) {
          specs = {
            "Capacity": parsedMachine.capacity || 'N/A',
            "Design": category === 'CRB' ? "Modular (1-day installation)" : category === 'IRB' ? "Inline Bin" : "Belt Conveyor",
            "Features": "SCADA + PLC Control Panel",
            "Mixer Type": "Planetary / Twin Shaft",
            "Aggregate Weighing": "Yes",
            "Skip Bucket System": category === 'CRB' ? "Dual Rope" : "N/A",
            "Applications": "Precast, Oil & Gas, RMC, Cement Plants"
          };
        } else if (category === 'AF') {
          specs = {
            "Capacity": parsedMachine.capacity || 'N/A',
            "Drive System": "PTO (Engine Powered Drum)",
            "Features": "Hydro-pneumatic Pressure Tank",
            "Maintenance": "Low Maintenance",
            "Safety": "High Safety + Stability",
            "Drum Life": "Longer Drum Life",
            "Applications": "Rural + Urban Projects"
          };
        } else if (category === 'ASP') {
          specs = {
            "Output": parsedMachine.capacity || 'N/A',
            "Technology": "S-Valve Technology",
            "Control": "Remote Control",
            "Lubrication": "Auto Lubrication",
            "Design": "Compact Integrated Design",
            "Efficiency": "Low Pressure Drop + High Efficiency",
            "Applications": "Horizontal + Vertical Pumping"
          };
        }
      } catch (error) {
        console.warn('Error creating specs for machine:', parsedMachine.model, error);
        specs = { "Error": "Unable to load specifications" };
      }

      // Generate appropriate name based on category
      let name = parsedMachine.model || 'Unknown Machine';
      if (category === 'SLCM') {
        name = `${parsedMachine.model || 'Unknown'} Self-Loading Concrete Mixer`;
      } else if (category.startsWith('CRB') || category.startsWith('IRB') || category.startsWith('IBP')) {
        name = `${parsedMachine.model || 'Unknown'} Batching Plant`;
      } else if (category === 'AF') {
        name = `${parsedMachine.model || 'Unknown'} Transit Mixer`;
      } else if (category === 'ASP') {
        name = `${parsedMachine.model || 'Unknown'} Concrete Pump`;
      }

      return {
        id: parsedMachine.id || 'unknown',
        name,
        category,
        image,
        pricePerHour: hourlyRate,
        pricePerDay: dailyRate,
        rating: 4.8, // Premium rating for all AJAX machines
        reviews: Math.floor(Math.random() * 100) + 100, // Realistic review counts
        available: true, // All AJAX machines available
        location: "Mumbai, MH", // Primary location
        specs,
        description: this.generateDescription(parsedMachine, category)
      };
    } catch (error) {
      console.error('Error converting machine format:', parsedMachine, error);
      // Return a safe fallback machine
      return {
        id: 'error-fallback',
        name: 'Machine Unavailable',
        category: 'Unknown',
        image: '/src/assets/machine-mixer.jpg',
        pricePerHour: 100,
        pricePerDay: 800,
        rating: 0,
        reviews: 0,
        available: false,
        location: 'N/A',
        specs: { "Error": "Unable to load machine data" },
        description: 'This machine data could not be loaded.'
      };
    }
  }

  private generateDescription(parsedMachine: ParsedMachine, category: string): string {
    try {
      const model = parsedMachine.model || 'Unknown';

      if (category === 'SLCM') {
        const features = [];
        if (parsedMachine.hasSwivelDrum) features.push('swivel drum');
        if (parsedMachine.hasLoadCell) features.push('load cell weighing system');
        if (parsedMachine.isAcura) features.push('Acura telematics');

        const featureText = features.length > 0 ? ` with ${features.join(', ')}` : '';
        return `Premium ${model} Self-Loading Concrete Mixer${featureText}. Global leader in SLCM technology with 20,000+ machines delivered worldwide. Features 3-way steering, 4WD, telematics, auto cleaning, and electronic drum control. Perfect for smart city projects, buildings, CC roads, and canal lining.`;
      }

      if (category.startsWith('CRB')) {
        return `High-productivity ${model} Concrete Batching Plant preferred by RMC companies. Features modular design with 1-day installation, skip bucket dual rope system, aggregate weighing hopper, planetary/twin shaft mixer, and SCADA + PLC control panel. Ideal for precast, oil & gas, RMC, and cement plant applications.`;
      }

      if (category.startsWith('IRB')) {
        return `Energy-efficient ${model} Inline Bin Concrete Batching Plant with skip conveyor system. Features inline bin aggregate storage, high capacity bins, and accurate weighing systems. Perfect for large-scale concrete production with low energy consumption.`;
      }

      if (category.startsWith('IBP')) {
        return `High-throughput ${model} Belt Conveyor Concrete Batching Plant. Designed for maximum efficiency with belt conveyor systems and high processing capacity. Ideal for large-scale construction projects requiring continuous concrete supply.`;
      }

      if (category === 'AF') {
        return `Reliable ${model} Transit Mixer designed for rural and urban construction projects. Features PTO-driven engine-powered drum, longer drum life, low maintenance, high safety and stability, plus hydro-pneumatic pressure tank. Built for demanding construction environments.`;
      }

      if (category === 'ASP') {
        return `Advanced ${model} Concrete Pump designed for horizontal and vertical pumping applications. Features S-valve technology, remote control, auto lubrication, and compact integrated design. Offers low pressure drop and high efficiency for professional concrete placement.`;
      }

      return `Premium ${model} construction equipment from AJAX. Made in India for the world with exceptional quality and reliability.`;
    } catch (error) {
      console.warn('Error generating description for machine:', parsedMachine, error);
      return 'Premium construction equipment from AJAX. Made in India for the world with exceptional quality and reliability.';
    }
  }
}