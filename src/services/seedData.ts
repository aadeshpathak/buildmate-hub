// Complete AJAX machine data for seeding Firestore with official AJAX images
import { collection, doc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getMachines } from './machineService';
const sampleMachines = [
  // SLCM - ARGO Series (with official AJAX image URLs)
  {
    name: 'ARGO 1000',
    category: 'SLCM Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/655f289a654af14884bd3bdb_Frame%201345.webp',
    pricePerHour: 295,
    pricePerDay: 7080,
    rating: 4.5,
    reviews: 85,
    available: true,
    location: 'Mumbai, Maharashtra',
    specs: {
      'Capacity': '1.0 m³',
      'Drive': '4WD',
      'Drum Speed': '18 RPM',
      'Water Tank': '240L',
      'Engine': '48 HP'
    },
    description: 'Compact self-loading concrete mixer perfect for small construction projects.'
  },
  {
    name: 'ARGO 2000',
    category: 'SLCM Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/655f289a026b137307893863_Frame%201344.webp',
    pricePerHour: 490,
    pricePerDay: 11760,
    rating: 4.8,
    reviews: 150,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Capacity': '2.0 m³',
      'Drive': '4WD',
      'Drum Speed': '~20 RPM',
      'Water Tank': '250L',
      'Load Cell': 'Optional'
    },
    description: 'Premium self-loading concrete mixer with advanced load cell technology for precise mixing ratios.'
  },
  {
    name: 'ARGO 2300 Non-Swivel',
    category: 'SLCM Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/655f2251461b81d9b60f40e4_argo-2300.webp',
    pricePerHour: 498,
    pricePerDay: 11952,
    rating: 4.6,
    reviews: 95,
    available: true,
    location: 'Bangalore, Karnataka',
    specs: {
      'Capacity': '2.3 m³',
      'Drive': '4WD',
      'Water Tank': '400L',
      'Load Cell': 'Optional',
      'Drum': 'Non-swivel'
    },
    description: 'Enhanced capacity mixer with improved output and optional load cell system.'
  },
  {
    name: 'ARGO 2300 Swivel',
    category: 'SLCM Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/655f289a026b137307893863_Frame%201344.webp',
    pricePerHour: 521,
    pricePerDay: 12504,
    rating: 4.7,
    reviews: 110,
    available: true,
    location: 'Chennai, Tamil Nadu',
    specs: {
      'Capacity': '2.3 m³',
      'Drive': '4WD',
      'Water Tank': '400L',
      'Load Cell': 'Optional',
      'Drum': 'Swivel (Flexible discharge)'
    },
    description: 'Swivel drum version for flexible concrete discharge in various directions.'
  },
  {
    name: 'ARGO 2800 Non-Swivel',
    category: 'SLCM Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/655f289a949b61d4384faa64_Frame%201342.webp',
    pricePerHour: 565,
    pricePerDay: 13560,
    rating: 4.8,
    reviews: 125,
    available: true,
    location: 'Pune, Maharashtra',
    specs: {
      'Capacity': '2.8 m³',
      'Drive': '4WD',
      'Load Cell': 'Optional',
      'Drum': 'Non-swivel'
    },
    description: 'Higher capacity mixer for increased productivity on construction sites.'
  },
  {
    name: 'ARGO 3500 Non-Swivel',
    category: 'SLCM Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/655f289adf342f7f3303bbbc_Frame%201343.webp',
    pricePerHour: 607,
    pricePerDay: 14568,
    rating: 4.9,
    reviews: 140,
    available: true,
    location: 'Hyderabad, Telangana',
    specs: {
      'Capacity': '3.5 m³',
      'Drive': '4WD',
      'Load Cell': 'Optional',
      'Output': 'High productivity'
    },
    description: 'High-capacity mixer designed for maximum productivity and efficiency.'
  },
  {
    name: 'ARGO 4300 Non-Swivel',
    category: 'SLCM Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/655f289973164e507222066f_Frame%201347.webp',
    pricePerHour: 667,
    pricePerDay: 16008,
    rating: 4.8,
    reviews: 98,
    available: true,
    location: 'Ahmedabad, Gujarat',
    specs: {
      'Capacity': '4.3 m³',
      'Drive': '4WD',
      'Load Cell': 'Optional',
      'Output': 'Large capacity'
    },
    description: 'Heavy-duty mixer for large-scale concrete production requirements.'
  },
  {
    name: 'ARGO 4800 Non-Swivel + Load Cell',
    category: 'SLCM Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/65c9c0730cba9edcb69ee7b2_Frame%201342.webp',
    pricePerHour: 717,
    pricePerDay: 17208,
    rating: 4.9,
    reviews: 75,
    available: true,
    location: 'Kolkata, West Bengal',
    specs: {
      'Capacity': '4.8 m³',
      'Drive': '4WD',
      'Load Cell': 'Yes',
      'Output': 'Maximum capacity'
    },
    description: 'Top-tier mixer with load cell technology for precise batching and maximum output.'
  },

  // CRB Series Batching Plants
  {
    name: 'CRB 20 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6579b2e4ad19ca1bffe1f0ea_crb%2020.webp',
    pricePerHour: 250,
    pricePerDay: 6000,
    rating: 4.4,
    reviews: 45,
    available: true,
    location: 'Mumbai, Maharashtra',
    specs: {
      'Capacity': '20 m³/hr',
      'Mixer': 'Pan/Twin shaft mixer',
      'Design': 'Modular design'
    },
    description: 'Compact batching plant perfect for small to medium construction projects.'
  },
  {
    name: 'CRB 30 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6579b2e47cd848bd6a5463ee_crb%2030.webp',
    pricePerHour: 350,
    pricePerDay: 8400,
    rating: 4.5,
    reviews: 62,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Capacity': '30 m³/hr',
      'Control': 'PLC control',
      'Batching': 'Accurate batching'
    },
    description: 'Mid-range batching plant with PLC control for precise concrete production.'
  },
  {
    name: 'CRB 45 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6579b2e4aa5b11000867a104_crb%2045.webp',
    pricePerHour: 500,
    pricePerDay: 12000,
    rating: 4.7,
    reviews: 89,
    available: true,
    location: 'Bangalore, Karnataka',
    specs: {
      'Capacity': '45 m³/hr',
      'System': 'Aggregate hopper',
      'Type': 'Modular design'
    },
    description: 'High-capacity modular batching plant with advanced aggregate handling system.'
  },
  {
    name: 'CRB 60 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6579b2e4634f00d42410f70a_crb%2060.webp',
    pricePerHour: 600,
    pricePerDay: 14400,
    rating: 4.6,
    reviews: 78,
    available: true,
    location: 'Chennai, Tamil Nadu',
    specs: {
      'Capacity': '60 m³/hr',
      'Discharge': 'Faster discharge',
      'Efficiency': 'High efficiency'
    },
    description: 'Efficient batching plant with faster discharge rates for improved productivity.'
  },
  {
    name: 'CRB 75 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6579b0cbf427a00980f12b72_CRB%2090.webp',
    pricePerHour: 700,
    pricePerDay: 16800,
    rating: 4.7,
    reviews: 65,
    available: true,
    location: 'Pune, Maharashtra',
    specs: {
      'Capacity': '75 m³/hr',
      'Mixing': 'High efficiency mixing',
      'Build': 'Heavy-duty'
    },
    description: 'Heavy-duty batching plant designed for high-volume concrete production.'
  },
  {
    name: 'CRB 90 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6579b2e3e5bfdadb002ebc35_crb%2075.webp',
    pricePerHour: 800,
    pricePerDay: 19200,
    rating: 4.8,
    reviews: 52,
    available: true,
    location: 'Hyderabad, Telangana',
    specs: {
      'Capacity': '90 m³/hr',
      'Build': 'Heavy-duty construction',
      'Output': 'High output'
    },
    description: 'Heavy-duty construction batching plant for large-scale operations.'
  },
  {
    name: 'CRB 120 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6555c6aff8808bb4cd1c0d48_Frame%201351.webp',
    pricePerHour: 1000,
    pricePerDay: 24000,
    rating: 4.9,
    reviews: 38,
    available: true,
    location: 'Ahmedabad, Gujarat',
    specs: {
      'Capacity': '120 m³/hr',
      'Production': 'Large-scale production',
      'Efficiency': 'High capacity'
    },
    description: 'Large-scale production batching plant for major construction projects.'
  },

  // IRB Series Batching Plants
  {
    name: 'IRB 30 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 400,
    pricePerDay: 9600,
    rating: 4.5,
    reviews: 55,
    available: true,
    location: 'Mumbai, Maharashtra',
    specs: {
      'Capacity': '30 m³/hr',
      'Storage': 'Inline aggregate storage',
      'System': 'Conveyor system'
    },
    description: 'Energy-efficient inline bin batching plant with conveyor feeding system.'
  },
  {
    name: 'IRB 45 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 500,
    pricePerDay: 12000,
    rating: 4.6,
    reviews: 68,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Capacity': '45 m³/hr',
      'Efficiency': 'Lower energy consumption',
      'Consistency': 'High consistency concrete'
    },
    description: 'Energy-efficient batching plant delivering consistent high-quality concrete.'
  },
  {
    name: 'IRB 60 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 600,
    pricePerDay: 14400,
    rating: 4.7,
    reviews: 72,
    available: true,
    location: 'Bangalore, Karnataka',
    specs: {
      'Capacity': '60 m³/hr',
      'Consumption': 'Low energy consumption',
      'Quality': 'Consistent quality'
    },
    description: 'Optimized inline bin plant with low energy consumption and consistent output.'
  },

  // IBP Series Batching Plants
  {
    name: 'IBP 30 Batching Plant',
    category: 'Batching Plants',
    image: 'https://images.unsplash.com/photo-1621905251189-08b2593d8a19?w=400&h=300&fit=crop&crop=center',
    pricePerHour: 500,
    pricePerDay: 12000,
    rating: 4.6,
    reviews: 68,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Capacity': '45 m³/hr',
      'Efficiency': 'Lower energy consumption',
      'Consistency': 'High consistency concrete'
    },
    description: 'Energy-efficient batching plant delivering consistent high-quality concrete.'
  },
  {
    name: 'IRB 60 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 600,
    pricePerDay: 14400,
    rating: 4.7,
    reviews: 72,
    available: true,
    location: 'Bangalore, Karnataka',
    specs: {
      'Capacity': '60 m³/hr',
      'Consumption': 'Low energy consumption',
      'Quality': 'Consistent quality'
    },
    description: 'Optimized inline bin plant with low energy consumption and consistent output.'
  },

  // IBP Series Batching Plants
  {
    name: 'IBP 30 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 450,
    pricePerDay: 10800,
    rating: 4.6,
    reviews: 48,
    available: true,
    location: 'Chennai, Tamil Nadu',
    specs: {
      'Capacity': '30 m³/hr',
      'Feeding': 'Belt conveyor feeding',
      'Production': 'High production capacity'
    },
    description: 'Belt conveyor fed batching plant for efficient and high-capacity production.'
  },
  {
    name: 'IBP 60 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 700,
    pricePerDay: 16800,
    rating: 4.8,
    reviews: 61,
    available: true,
    location: 'Pune, Maharashtra',
    specs: {
      'Capacity': '60 m³/hr',
      'Feeding': 'Belt conveyor',
      'Monitoring': 'Real-time monitoring'
    },
    description: 'Advanced belt conveyor system with real-time SCADA monitoring.'
  },
  {
    name: 'IBP 120 Batching Plant',
    category: 'Batching Plants',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 1100,
    pricePerDay: 26400,
    rating: 4.9,
    reviews: 43,
    available: true,
    location: 'Hyderabad, Telangana',
    specs: {
      'Capacity': '120 m³/hr',
      'Conveyor': 'Belt conveyor system',
      'Automation': 'Full automation'
    },
    description: 'High-throughput batching plant with belt conveyor and full automation features.'
  },

  // AF Series Transit Mixers
  {
    name: 'AF 6XE Transit Mixer',
    category: 'Transit Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6556fa81e01d3ddaf42f4dc3_af8.webp',
    pricePerHour: 200,
    pricePerDay: 4800,
    rating: 4.4,
    reviews: 78,
    available: true,
    location: 'Mumbai, Maharashtra',
    specs: {
      'Capacity': '6 m³',
      'Drum Speed': '2300 rpm',
      'Tank': '450L water tank'
    },
    description: 'Compact transit mixer ideal for urban construction and smaller projects.'
  },
  {
    name: 'AF 7XE Transit Mixer',
    category: 'Transit Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6556fa81e01d3ddaf42f4dc3_af8.webp',
    pricePerHour: 250,
    pricePerDay: 6000,
    rating: 4.5,
    reviews: 92,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Capacity': '7 m³',
      'Drive': 'Fuel efficient PTO',
      'Efficiency': 'High fuel efficiency'
    },
    description: 'Fuel-efficient transit mixer with PTO drive system for cost-effective operations.'
  },
  {
    name: 'AF 9XP Transit Mixer',
    category: 'Transit Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6556fa81e01d3ddaf42f4dc3_af8.webp',
    pricePerHour: 300,
    pricePerDay: 7200,
    rating: 4.7,
    reviews: 120,
    available: true,
    location: 'Bangalore, Karnataka',
    specs: {
      'Capacity': '9 m³',
      'Drive': 'PTO Driven',
      'Safety': 'Safety Tank',
      'Discharge': 'Hydraulic'
    },
    description: 'Reliable transit mixer with PTO drive system and safety tank for consistent concrete delivery.'
  },
  {
    name: 'AF 10XP Transit Mixer',
    category: 'Transit Mixers',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6556fa81e01d3ddaf42f4dc3_af8.webp',
    pricePerHour: 350,
    pricePerDay: 8400,
    rating: 4.6,
    reviews: 85,
    available: true,
    location: 'Chennai, Tamil Nadu',
    specs: {
      'Capacity': '10 m³',
      'Output': 'High output',
      'Stability': 'Better stability'
    },
    description: 'High-capacity transit mixer designed for maximum output and stability.'
  },

  // ASP Series Concrete Pumps
  {
    name: 'ASP 3009 Concrete Pump',
    category: 'Concrete Pumps',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6554aa5bac385b6a9f75e5cd_Frame%201342.webp',
    pricePerHour: 150,
    pricePerDay: 3600,
    rating: 4.5,
    reviews: 67,
    available: true,
    location: 'Mumbai, Maharashtra',
    specs: {
      'Output': '30 m³/hr',
      'System': 'Efficient pumping system',
      'Technology': 'S-valve technology'
    },
    description: 'Efficient concrete pump with S-valve technology for reliable performance.'
  },
  {
    name: 'ASP 4009 Concrete Pump',
    category: 'Concrete Pumps',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6554aa5a8d9f9c69ef666b7b_Frame%201346.webp',
    pricePerHour: 180,
    pricePerDay: 4320,
    rating: 4.6,
    reviews: 74,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Output': '37 m³/hr',
      'Control': 'Remote control',
      'Lubrication': 'Auto lubrication'
    },
    description: 'Advanced concrete pump with remote control and automatic lubrication system.'
  },
  {
    name: 'ASP 5009 Concrete Pump',
    category: 'Concrete Pumps',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6554aa5afd141d716681d64a_Frame%201343.webp',
    pricePerHour: 200,
    pricePerDay: 4800,
    rating: 4.6,
    reviews: 95,
    available: true,
    location: 'Bangalore, Karnataka',
    specs: {
      'Output': '50 m³/hr',
      'Type': 'S-Valve',
      'Control': 'Remote Control',
      'Reach': '30m Horizontal'
    },
    description: 'High-performance concrete pump with remote control and S-valve technology for efficient concrete placement.'
  },
  {
    name: 'ASP 6011 E Concrete Pump',
    category: 'Concrete Pumps',
    image: 'https://cdn.prod.website-files.com/65006e6ed741800ddeb94c08/6554aa5a096d7c364f989e08_Frame%201347.webp',
    pricePerHour: 220,
    pricePerDay: 5280,
    rating: 4.7,
    reviews: 58,
    available: true,
    location: 'Chennai, Tamil Nadu',
    specs: {
      'Output': '55 m³/hr',
      'Efficiency': 'High efficiency',
      'Energy': 'Energy efficient'
    },
    description: 'Energy-efficient concrete pump delivering high output with low consumption.'
  },

  // AZX Series Boom Pumps
  {
    name: 'A25ZX Boom Pump',
    category: 'Boom Pumps',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 400,
    pricePerDay: 9600,
    rating: 4.8,
    reviews: 42,
    available: true,
    location: 'Mumbai, Maharashtra',
    specs: {
      'Reach': '24.15 m',
      'Boom': '4-arm Z-fold boom',
      'Control': 'Remote control'
    },
    description: '4-arm Z-fold boom pump with remote control for precise concrete placement.'
  },
  {
    name: 'A30ZX Boom Pump',
    category: 'Boom Pumps',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 450,
    pricePerDay: 10800,
    rating: 4.7,
    reviews: 38,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Reach': '29.15 m',
      'Boom': '4-arm Z-fold',
      'Pumping': 'High-pressure pumping'
    },
    description: 'Extended reach boom pump with high-pressure pumping capabilities.'
  },

  // SPBP Series Self-Propelled Boom Pumps
  {
    name: 'SPBP 15ZX Boom Pump',
    category: 'Boom Pumps',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 500,
    pricePerDay: 12000,
    rating: 4.6,
    reviews: 29,
    available: true,
    location: 'Bangalore, Karnataka',
    specs: {
      'Reach': '14.9 m',
      'Steering': '4-wheel steering',
      'Design': 'Compact design'
    },
    description: 'Self-propelled boom pump with 4-wheel steering and compact design for maneuverability.'
  },

  // AZX Series Boom Pumps
  {
    name: 'A25ZX Boom Pump',
    category: 'Boom Pumps',
    image: 'https://images.unsplash.com/photo-1621905251189-08b2593d8a19?w=400&h=300&fit=crop&crop=center',
    pricePerHour: 450,
    pricePerDay: 10800,
    rating: 4.7,
    reviews: 38,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Reach': '29.15 m',
      'Boom': '4-arm Z-fold',
      'Pumping': 'High-pressure pumping'
    },
    description: 'Extended reach boom pump with high-pressure pumping capabilities.'
  },

  // SPBP Series Self-Propelled Boom Pumps
  {
    name: 'SPBP 15ZX Boom Pump',
    category: 'Boom Pumps',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 500,
    pricePerDay: 12000,
    rating: 4.6,
    reviews: 29,
    available: true,
    location: 'Bangalore, Karnataka',
    specs: {
      'Reach': '14.9 m',
      'Steering': '4-wheel steering',
      'Design': 'Compact design'
    },
    description: 'Self-propelled boom pump with 4-wheel steering and compact design for maneuverability.'
  },

  // SPX Series Slip Form Paver
  {
    name: 'SPX 754 Slip Form Paver',
    category: 'Slip Form Pavers',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 800,
    pricePerDay: 19200,
    rating: 4.8,
    reviews: 21,
    available: true,
    location: 'Mumbai, Maharashtra',
    specs: {
      'Width': '3.5 – 7.5 m',
      'Drive': 'Hydraulic track drive',
      'Steering': 'Automatic steering'
    },
    description: 'Advanced slip form paver with hydraulic track drive and automatic steering system.'
  },
  {
    name: 'SPX 1204 Slip Form Paver',
    category: 'Slip Form Pavers',
    image: 'https://cpimg.tistatic.com/09705149/b/4/Mobile-Concrete-Batching-Plant.jpg',
    pricePerHour: 1000,
    pricePerDay: 24000,
    rating: 4.7,
    reviews: 15,
    available: true,
    location: 'Delhi, NCR',
    specs: {
      'Width': '5 – 12 m',
      'Drive': 'Hydraulic track drive',
      'Steering': 'Automatic steering'
    },
    description: 'High-capacity slip form paver for wider road construction projects.'
  }
];

// Function to seed Firestore with sample data
export const seedFirestore = async (addRemaining = false) => {
  try {
    console.log('Checking existing data in Firestore...');

    // First check what data already exists

    const existingMachines = await getMachines();
    const existingNames = new Set(existingMachines.map(m => m.name));

    console.log(`Found ${existingMachines.length} existing machines in Firestore`);

    if (existingMachines.length > 0 && !addRemaining) {
      console.log('❌ Skipping seed - data already exists.');
      console.log(`📊 Current: ${existingMachines.length} machines`);
      console.log(`🎯 Target: ${sampleMachines.length} machines`);
      console.log(`📈 Missing: ${sampleMachines.length - existingMachines.length} machines`);
      console.log('\n💡 Options:');
      console.log('1. Delete collection in Firebase Console, then seed fresh');
      console.log('2. Use addRemaining=true to add missing machines only');
      return {
        success: false,
        message: `Data exists (${existingMachines.length}/${sampleMachines.length}). Delete collection first or use add remaining.`
      };
    }

    let machinesToAdd = sampleMachines;
    if (addRemaining && existingMachines.length > 0) {
      // Filter out machines that already exist
      machinesToAdd = sampleMachines.filter(machine => !existingNames.has(machine.name));
      console.log(`🔄 Add remaining mode: ${machinesToAdd.length} machines to add`);
    }

    console.log(`${addRemaining ? 'Adding remaining' : 'Seeding'} Firestore with AJAX machine data...`);
    console.log(`📊 Target: ${machinesToAdd.length} machines to ${addRemaining ? 'add' : 'seed'}`);

    if (machinesToAdd.length === 0) {
      return {
        success: true,
        message: 'All machines already exist in Firestore - nothing to add!'
      };
    }

    let addedCount = 0;
    let failedCount = 0;
    const batchSize = 5; // Smaller batch size to avoid rate limits
    const batchDelay = 1000; // 1 second delay between batches

    // Process in smaller batches with delays to avoid Firestore rate limits
    for (let i = 0; i < machinesToAdd.length; i += batchSize) {
      const batch = machinesToAdd.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(machinesToAdd.length / batchSize);

      console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} machines)...`);

      for (const machine of batch) {
        try {
          const docRef = await addDoc(collection(db, 'machines'), {
            ...machine,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          console.log(`✅ Added: ${machine.name} (${machine.category}) - ID: ${docRef.id}`);
          addedCount++;
        } catch (error) {
          console.error(`❌ Failed to add ${machine.name}:`, error);
          failedCount++;
        }
      }

      // Add delay between batches (except for the last batch)
      if (i + batchSize < machinesToAdd.length) {
        console.log(`⏳ Waiting ${batchDelay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    }

    const totalMachines = existingMachines.length + addedCount;
    console.log(`✅ Firestore ${addRemaining ? 'addition' : 'seeding'} completed!`);
    console.log(`📊 Added: ${addedCount}, Failed: ${failedCount}, Existing: ${existingMachines.length}, Total: ${totalMachines}`);

    if (failedCount > 0) {
      return {
        success: addedCount > 0,
        message: `Partially successful: Added ${addedCount} machines, ${failedCount} failed. Total now: ${totalMachines}/${sampleMachines.length}`
      };
    } else {
      return {
        success: true,
        message: `${addRemaining ? 'Addition' : 'Seeding'} successful! Added ${addedCount} machines. Total now: ${totalMachines}/${sampleMachines.length}`
      };
    }
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    return { success: false, message: `Failed to seed data: ${error.message}` };
  }
};

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

// Function to update existing machine images with official AJAX images
export const updateMachineImages = async () => {
  try {
    console.log('Updating machine images with official AJAX images...');


    const existingMachines = await getMachines();

    if (existingMachines.length === 0) {
      console.log('No machines found in Firestore. Run seedFirestore first.');
      return { success: false, message: 'No machines to update' };
    }

    // Create a map of machine names to their official images
    const imageMap = new Map();
    sampleMachines.forEach(machine => {
      imageMap.set(machine.name, machine.image);
    });

    let updatedCount = 0;
    const batchSize = 5;
    const batchDelay = 1000;

    for (let i = 0; i < existingMachines.length; i += batchSize) {
      const batch = existingMachines.slice(i, i + batchSize);

      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(existingMachines.length / batchSize)} (${batch.length} machines)...`);

      for (const machine of batch) {
        const officialImage = imageMap.get(machine.name);
        if (officialImage && machine.image !== officialImage) {
          try {
            // Update the machine document with the new image

            const machineRef = doc(db, 'machines', machine.id);
            await updateDoc(machineRef, {
              image: officialImage,
              updatedAt: new Date()
            });

            console.log(`✅ Updated image for: ${machine.name}`);
            updatedCount++;
          } catch (error) {
            console.error(`❌ Failed to update ${machine.name}:`, error);
          }
        }
      }

      // Delay between batches
      if (i + batchSize < existingMachines.length) {
        console.log(`⏳ Waiting ${batchDelay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    }

    console.log(`✅ Image update completed! Updated ${updatedCount} machines.`);
    return {
      success: true,
      message: `Successfully updated ${updatedCount} machine images with official AJAX images.`
    };
  } catch (error) {
    console.error('❌ Error updating machine images:', error);
    return { success: false, message: `Failed to update images: ${error.message}` };
  }
};

// Export for manual seeding if needed
export { sampleMachines };