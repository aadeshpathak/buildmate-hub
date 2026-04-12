import { useEffect, useState, useMemo, useCallback, Component, ErrorInfo, ReactNode, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Package, CalendarCheck, Settings, LogOut,
  Users, Truck, Plus, Search, Filter, Star,
  MapPin, Phone, ChevronLeft, ChevronRight, Menu, X, ShoppingCart, Heart,
  Truck as TruckIcon, Wrench, Building, TrendingUp, MessageSquare,
  BarChart3, PieChart, LineChart
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart as RechartsLineChart, Line } from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PremiumSearchBar from "@/components/PremiumSearchBar";
import BookingModal from "@/components/BookingModal";
import { useMachines } from "@/hooks/useMachines";
import { type Machine } from "@/data/machines";

type Tab = "home" | "categories" | "analytics" | "messages" | "bookings" | "profile";

const sidebarItems: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "home", label: "Home", icon: <Home className="w-6 h-6" />, color: "text-blue-500" },
  { id: "categories", label: "Categories", icon: <Package className="w-6 h-6" />, color: "text-green-500" },
  { id: "analytics", label: "Analytics", icon: <TrendingUp className="w-6 h-6" />, color: "text-emerald-500" },
  { id: "messages", label: "Messages", icon: <MessageSquare className="w-6 h-6" />, color: "text-rose-500" },
  { id: "bookings", label: "My Bookings", icon: <CalendarCheck className="w-6 h-6" />, color: "text-purple-500" },
  { id: "profile", label: "Profile", icon: <Users className="w-6 h-6" />, color: "text-orange-500" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const navigate = useNavigate();



// Error Boundary Component
class DashboardErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-8 glass-card rounded-3xl">
            <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              The dashboard encountered an error. Please refresh the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const { machines: machineData, loading: machinesLoading } = useMachines();

  // Temporary: Add some test machines if none loaded
  const testMachines = [
    {
      id: 'test-1',
      name: 'Argo 2000 Self-Loading Concrete Mixer',
      category: 'SLCM',
      image: '/assets/argo-2000.webp',
      pricePerHour: 400,
      pricePerDay: 9600,
      rating: 4.9,
      reviews: 150,
      available: true,
      location: 'Mumbai, MH',
      specs: { 'Capacity': '2 m³', 'Swivel Drum': 'No', 'Load Cell': 'No' },
      description: 'Premium self-loading concrete mixer'
    },
    {
      id: 'test-2',
      name: 'Argo 2300 Self-Loading Concrete Mixer',
      category: 'SLCM',
      image: '/assets/argo-2300.avif',
      pricePerHour: 450,
      pricePerDay: 10800,
      rating: 4.8,
      reviews: 120,
      available: true,
      location: 'Delhi, DL',
      specs: { 'Capacity': '2.3 m³', 'Swivel Drum': 'Yes', 'Load Cell': 'No' },
      description: 'Advanced self-loading concrete mixer with swivel drum'
    }
  ];

  const displayMachines = Array.isArray(machineData) && machineData.length > 0 ? machineData : testMachines;

  // Generate dynamic filters based on machine data - memoized to prevent re-computation
  const dynamicFilters = useMemo(() => {
    const filters = ["All"];

    // Add category-based filters
    const categories = [...new Set(displayMachines.map(m => m.category))];
    if (categories.includes("SLCM")) filters.push("SLCM");
    if (categories.some(cat => cat.startsWith("CRB") || cat.startsWith("IRB") || cat.startsWith("IBP"))) filters.push("Batching Plants");
    if (categories.includes("AF")) filters.push("Transit Mixers");
    if (categories.includes("ASP")) filters.push("Concrete Pumps");

    // Add feature-based filters (mainly for SLCM)
    const slcmMachines = displayMachines.filter(m => m.category === "SLCM");
    const hasLoadCell = slcmMachines.some(m => m.specs["Load Cell Weighing"] === "Yes");
    const hasSwivelDrum = slcmMachines.some(m => m.specs["Swivel Drum"] === "Yes");
    const hasAcura = slcmMachines.some(m => m.specs["Acura Model"] === "Yes");

    if (hasLoadCell) filters.push("Load Cell");
    if (hasSwivelDrum) filters.push("Swivel Drum");

    return filters;
  }, [displayMachines]);

  // Filtered machines - moved outside conditional rendering to prevent hook violations
  const filteredMachines = useMemo(() => {
    try {
      if (!Array.isArray(displayMachines)) {
        console.warn('displayMachines is not an array:', displayMachines);
        return [];
      }

      return displayMachines.filter(m => {
        if (!m || typeof m !== 'object') return false;

        // Safe search matching
        const machineName = (m.name || '').toString().toLowerCase();
        const searchTerm = (search || '').toString().toLowerCase();
        const matchesSearch = machineName.includes(searchTerm);

        let matchesFilter = activeFilter === "All";

        if (!matchesFilter) {
          switch (activeFilter) {
            case "SLCM":
              matchesFilter = m.category === "SLCM";
              break;
            case "Batching Plants":
              matchesFilter = (m.category || '').startsWith("CRB") || (m.category || '').startsWith("IRB") || (m.category || '').startsWith("IBP");
              break;
            case "Transit Mixers":
              matchesFilter = m.category === "AF";
              break;
            case "Concrete Pumps":
              matchesFilter = m.category === "ASP";
              break;
            case "Load Cell":
              matchesFilter = (m.specs || {})["Load Cell Weighing"] === "Yes";
              break;
            case "Swivel Drum":
              matchesFilter = (m.specs || {})["Swivel Drum"] === "Yes";
              break;
            case "Acura Model":
              matchesFilter = (m.specs || {})["Acura Model"] === "Yes";
              break;
            default:
              matchesFilter = true;
          }
        }

        return matchesSearch && matchesFilter && (m.available !== false);
      });
    } catch (error) {
      console.error('Error filtering machines:', error);
      return [];
    }
  }, [displayMachines, search, activeFilter]);

  const AnalyticsTab = () => {
    const [selectedMachines, setSelectedMachines] = useState<Machine[]>([]);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [budgetAnalysis, setBudgetAnalysis] = useState({
      projectDuration: 30,
      dailyUsage: 8,
      fuelCostPerLiter: 100,
      laborCostPerDay: 2000
    });

    // Generate chart data for comparison
    const generateChartData = () => {
      return selectedMachines.map(machine => {
        const costs = calculateTotalCost(machine);
        return {
          name: machine.name.split(' ')[0] + ' ' + machine.name.split(' ')[1],
          equipment: costs.equipment,
          fuel: costs.fuel,
          labor: costs.labor,
          total: costs.total,
          rating: machine.rating,
          capacity: parseFloat(machine.specs.Capacity || "0")
        };
      });
    };

    const chartData = generateChartData();

    // Pie chart data for budget breakdown
    const generatePieData = (machine: Machine) => {
      const costs = calculateTotalCost(machine);
      return [
        { name: 'Equipment', value: costs.equipment, color: '#10b981' },
        { name: 'Fuel', value: costs.fuel, color: '#f59e0b' },
        { name: 'Labor', value: costs.labor, color: '#ef4444' }
      ];
    };

    const addToComparison = (machine: Machine) => {
      if (selectedMachines.length < 3 && !selectedMachines.find(m => m.id === machine.id)) {
        setSelectedMachines([...selectedMachines, machine]);
      }
    };

    const removeFromComparison = (machineId: string) => {
      setSelectedMachines(selectedMachines.filter(m => m.id !== machineId));
    };

    const calculateTotalCost = (machine: Machine) => {
      const dailyFuel = 50; // liters per day estimate
      const dailyLabor = budgetAnalysis.laborCostPerDay;
      const equipmentCost = machine.pricePerDay || 0;

      return {
        equipment: equipmentCost * budgetAnalysis.projectDuration,
        fuel: dailyFuel * budgetAnalysis.fuelCostPerLiter * budgetAnalysis.projectDuration,
        labor: dailyLabor * budgetAnalysis.projectDuration,
        total: (equipmentCost + dailyFuel * budgetAnalysis.fuelCostPerLiter + dailyLabor) * budgetAnalysis.projectDuration
      };
    };

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gradient">Premium Analytics</h1>
            <p className="text-muted-foreground mt-2">Compare machines and analyze project budgets</p>
          </div>
          <Button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`${
              comparisonMode
                ? 'bg-gradient-to-r from-primary to-accent'
                : 'bg-secondary'
            } hover:scale-105 transition-all duration-300`}
          >
            {comparisonMode ? 'Exit Comparison' : 'Compare Machines'}
          </Button>
        </motion.div>

        {/* Comparison Arena */}
        {comparisonMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-3xl p-6"
          >
            <h2 className="text-xl font-bold text-gradient mb-4">Comparison Arena</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {selectedMachines.map((machine, index) => (
                <motion.div
                  key={machine.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card/50 rounded-2xl p-4 border border-border/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-sm">{machine.name.split(' ')[0]} {machine.name.split(' ')[1]}</h3>
                      <p className="text-xs text-muted-foreground">{machine.specs.Capacity}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromComparison(machine.id)}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Rate:</span>
                      <span className="font-semibold text-primary">₹{machine.pricePerDay?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-semibold">{machine.rating}⭐</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {selectedMachines.length < 3 && (
                <div className="border-2 border-dashed border-border/50 rounded-2xl p-4 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Add machine to compare</p>
                </div>
              )}
            </div>

            {selectedMachines.length > 1 && (
              <>
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6">
                  <h3 className="font-bold text-gradient mb-4">Cost Comparison (30 Days)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-2 text-muted-foreground">Machine</th>
                          <th className="text-right py-2 text-muted-foreground">Equipment</th>
                          <th className="text-right py-2 text-muted-foreground">Fuel Est.</th>
                          <th className="text-right py-2 text-muted-foreground">Labor</th>
                          <th className="text-right py-2 text-muted-foreground font-bold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMachines.map(machine => {
                          const costs = calculateTotalCost(machine);
                          return (
                            <tr key={machine.id} className="border-b border-border/30">
                              <td className="py-3 font-medium">{machine.name.split(' ')[0]} {machine.name.split(' ')[1]}</td>
                              <td className="text-right py-3">₹{costs.equipment.toLocaleString()}</td>
                              <td className="text-right py-3">₹{costs.fuel.toLocaleString()}</td>
                              <td className="text-right py-3">₹{costs.labor.toLocaleString()}</td>
                              <td className="text-right py-3 font-bold text-primary">₹{costs.total.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cost Breakdown Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-6"
                  >
                    <h3 className="font-bold text-gradient mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Cost Breakdown Comparison
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                        />
                        <Bar dataKey="equipment" fill="hsl(var(--primary))" name="Equipment" />
                        <Bar dataKey="fuel" fill="hsl(var(--accent))" name="Fuel" />
                        <Bar dataKey="labor" fill="hsl(var(--destructive))" name="Labor" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-3xl p-6"
                  >
                    <h3 className="font-bold text-gradient mb-4 flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Budget Distribution
                    </h3>
                    {selectedMachines.length > 0 && (
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={generatePieData(selectedMachines[0])}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {generatePieData(selectedMachines[0]).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                  </motion.div>
                </div>

                {/* Performance Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-3xl p-6"
                >
                  <h3 className="font-bold text-gradient mb-4 flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Performance Metrics
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="rating" orientation="left" stroke="hsl(var(--primary))" />
                      <YAxis yAxisId="capacity" orientation="right" stroke="hsl(var(--accent))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line yAxisId="rating" type="monotone" dataKey="rating" stroke="hsl(var(--primary))" strokeWidth={3} name="Rating" />
                      <Line yAxisId="capacity" type="monotone" dataKey="capacity" stroke="hsl(var(--accent))" strokeWidth={3} name="Capacity (m³)" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* Budget Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold text-gradient mb-6">Project Budget Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Project Duration (Days)</label>
              <Input
                type="number"
                value={budgetAnalysis.projectDuration}
                onChange={(e) => setBudgetAnalysis({...budgetAnalysis, projectDuration: Number(e.target.value)})}
                className="bg-card/50 border-border/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Daily Usage (Hours)</label>
              <Input
                type="number"
                value={budgetAnalysis.dailyUsage}
                onChange={(e) => setBudgetAnalysis({...budgetAnalysis, dailyUsage: Number(e.target.value)})}
                className="bg-card/50 border-border/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Fuel Cost (₹/L)</label>
              <Input
                type="number"
                value={budgetAnalysis.fuelCostPerLiter}
                onChange={(e) => setBudgetAnalysis({...budgetAnalysis, fuelCostPerLiter: Number(e.target.value)})}
                className="bg-card/50 border-border/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Labor Cost (₹/Day)</label>
              <Input
                type="number"
                value={budgetAnalysis.laborCostPerDay}
                onChange={(e) => setBudgetAnalysis({...budgetAnalysis, laborCostPerDay: Number(e.target.value)})}
                className="bg-card/50 border-border/50"
              />
            </div>
          </div>
        </motion.div>

        {/* Machine Selection for Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gradient mb-6">Select Machines for Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMachines.slice(0, 6).map((machine, index) => (
              <motion.div
                key={machine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer ${
                  selectedMachines.find(m => m.id === machine.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => comparisonMode && addToComparison(machine)}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={machine.image}
                    alt={machine.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground">
                      {machine.specs.Capacity}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-2 text-sm">{machine.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gradient">₹{machine.pricePerDay?.toLocaleString()}</div>
                    {comparisonMode && (
                      <Button
                        size="sm"
                        variant={selectedMachines.find(m => m.id === machine.id) ? "secondary" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          const isSelected = selectedMachines.some(m => m.id === machine.id);
                          if (isSelected) {
                            removeFromComparison(machine.id);
                          } else {
                            addToComparison(machine);
                          }
                        }}
                        className="click-3d text-xs"
                      >
                        {selectedMachines.find(m => m.id === machine.id) ? 'Remove' : 'Compare'}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const MessagesTab = () => {
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");

    const conversations = [
      {
        id: "conv-1",
        name: "Rajesh Kumar",
        avatar: "R",
        lastMessage: "Thank you for the quick delivery!",
        time: "2 min ago",
        unread: 2,
        online: true
      },
      {
        id: "conv-2",
        name: "Priya Construction Ltd",
        avatar: "P",
        lastMessage: "When will the ARGO 2800 be available?",
        time: "1 hour ago",
        unread: 0,
        online: false
      },
      {
        id: "conv-3",
        name: "Mumbai Builders",
        avatar: "M",
        lastMessage: "Need quote for 30-day rental",
        time: "3 hours ago",
        unread: 1,
        online: true
      }
    ];

    const messages = [
      { id: "1", sender: "customer", text: "Hi, I need to rent an ARGO 2000 for my construction project.", time: "10:30 AM" },
      { id: "2", sender: "admin", text: "Hello! I'd be happy to help you with that. The ARGO 2000 is currently available. When would you like to start the rental?", time: "10:32 AM" },
      { id: "3", sender: "customer", text: "Next Monday would be perfect. How long can I rent it for?", time: "10:35 AM" },
      { id: "4", sender: "admin", text: "You can rent it for any duration from 1 day to several months. For your project, I'd recommend at least 2 weeks. The daily rate is ₹9,600.", time: "10:36 AM" },
      { id: "5", sender: "customer", text: "That sounds good. Can you send me the booking details?", time: "10:38 AM" },
      { id: "6", sender: "admin", text: "Absolutely! I'll send you a detailed quote with all the terms and conditions. Is there anything specific about the equipment you'd like to know?", time: "10:40 AM" }
    ];

    const sendMessage = () => {
      if (newMessage.trim()) {
        // In a real app, this would send to backend
        console.log("Sending message:", newMessage);
        setNewMessage("");
      }
    };

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gradient mb-2">Premium Messaging</h1>
          <p className="text-muted-foreground">Communicate with your customers seamlessly</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-3xl p-6"
          >
            <h2 className="text-lg font-bold text-gradient mb-4">Conversations</h2>
            <div className="space-y-3">
              {conversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedConversation === conv.id
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30'
                      : 'hover:bg-card/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground font-bold">
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground truncate">{conv.name}</h3>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground font-bold">{conv.unread}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass-card rounded-3xl p-6 flex flex-col h-full"
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground font-bold">
                    R
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Rajesh Kumar</h3>
                    <p className="text-sm text-muted-foreground">Online • Construction Contractor</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-4 rounded-2xl ${
                        message.sender === 'admin'
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'bg-card/50 border border-border/50'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 bg-card/50 border-border/50 rounded-2xl"
                  />
                  <Button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-6 rounded-2xl"
                  >
                    Send
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Select a Conversation</h3>
                  <p className="text-muted-foreground">Choose a customer to start messaging</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  };

  const HomeTab = () => (
    <div className="space-y-8">
      {/* Premium Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 relative overflow-hidden hover-3d"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 animate-pulse-3d" />
        {/* Floating 3D elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl animate-float-3d opacity-60" />
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl animate-float-3d opacity-40" style={{ animationDelay: '1s' }} />
        <div className="relative">
          <h1 className="text-4xl font-bold text-gradient mb-4 animate-float-3d">Welcome to BuildMate</h1>
          <p className="text-muted-foreground text-lg mb-6">Rent premium construction equipment instantly</p>
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-3 rounded-xl shadow-lg shadow-primary/25 transform hover:scale-105 transition-all duration-300 hover-3d click-3d">
            Explore Premium Machines
          </Button>
        </div>
      </motion.div>

      {/* Premium Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PremiumSearchBar
          initialSearch={search}
          onSearchSubmit={(value) => setSearch(value)}
          activeFilter={activeFilter || 'All'}
          onFilterChange={(filter) => setActiveFilter(filter || 'All')}
          filters={dynamicFilters || []}
          isMobile={isMobile}
        />
      </motion.div>

      {/* Premium Featured Machines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient">Premium Machines</h2>
          <Button variant="ghost" className="text-primary hover:text-accent transition-colors">
            Premium Collection
          </Button>
        </div>

        {machinesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-muted/20" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted/20 rounded" />
                  <div className="h-3 bg-muted/20 rounded w-2/3" />
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted/20 rounded w-20" />
                      <div className="h-3 bg-muted/20 rounded w-16" />
                    </div>
                    <div className="h-8 bg-muted/20 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredMachines.map((machine) => (
              <motion.div
                key={machine?.id || 'unknown'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover-3d click-3d cursor-pointer group transform transition-transform duration-300 hover:scale-[1.02]"
                onClick={() => machine && setSelectedMachine(machine)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={machine?.image || '/src/assets/machine-mixer.jpg'}
                    alt={machine?.name || 'Machine'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/src/assets/machine-mixer.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-emerald-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                      Premium Available
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-sm font-medium">{machine.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{machine?.name || 'Unknown Machine'}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{machine?.location || 'Location N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-gradient">
                        ₹{typeof machine?.pricePerDay === 'number' ? machine.pricePerDay.toLocaleString() : '0'}
                      </div>
                      <div className="text-xs text-muted-foreground">per day</div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/25 transform hover:scale-105 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMachine(machine);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );

  const CategoriesTab = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient">Premium Categories</h1>
          <p className="text-muted-foreground mt-2">Explore our specialized equipment collections</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/25">
          View All
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { id: "slcm", name: "Self-Loading Concrete Mixers", icon: "🏗️", count: 18, description: "ARGO series with capacities from 1-4.8 cu.m", color: "from-primary to-accent" },
          { id: "crb", name: "CRB Batching Plants", icon: "🏭", count: 7, description: "Modular batching plants 20-120 cu.m/hr", color: "from-emerald-500 to-teal-600" },
          { id: "irb", name: "IRB Batching Plants", icon: "🏭", count: 6, description: "Inline bin batching plants 30-120 cu.m/hr", color: "from-blue-500 to-purple-600" },
          { id: "ibp", name: "IBP Batching Plants", icon: "🏭", count: 9, description: "Belt conveyor batching plants 30-240 cu.m/hr", color: "from-amber-500 to-orange-600" },
          { id: "af", name: "Transit Mixers", icon: "🚛", count: 7, description: "AF series 6-11 cu.m PTO driven mixers", color: "from-rose-500 to-pink-600" },
          { id: "asp", name: "Concrete Pumps", icon: "🏗️", count: 7, description: "ASP series 30-97 cu.m/hr output", color: "from-cyan-500 to-blue-600" },
        ].map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group overflow-hidden relative"
            onClick={() => {
              // Navigate to home tab and set filter
              setActiveTab("home");
              if (category.id === "slcm") setActiveFilter("SLCM");
              else if (category.id.startsWith("crb") || category.id.startsWith("irb") || category.id.startsWith("ibp")) setActiveFilter("Batching Plants");
              else if (category.id === "af") setActiveFilter("Transit Mixers");
              else if (category.id === "asp") setActiveFilter("Concrete Pumps");
              else setActiveFilter("All");
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 text-center">
              <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${category.color} rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20 transform group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-4xl filter drop-shadow-lg">{category.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-gradient transition-colors">{category.name}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{category.description}</p>
              <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 px-4 py-2 shadow-sm">
                {category.count} premium machines
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </motion.div>
        ))}
      </div>
    </div>
  );

  const BookingsTab = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient">My Premium Bookings</h1>
          <p className="text-muted-foreground mt-2">Manage your equipment reservations</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/25 transform hover:scale-105 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" />
          New Booking
        </Button>
      </motion.div>

      <div className="space-y-6">
        {[
          {
            id: "booking-1",
            machine: "ARGO 2000 Self-Loading Concrete Mixer",
            duration: "3 days",
            date: "April 5, 2026",
            status: "Confirmed",
            statusColor: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
            image: "/assets/argo-2000.webp"
          },
          {
            id: "booking-2",
            machine: "ARGO 3500 Self-Loading Concrete Mixer",
            duration: "5 days",
            date: "April 12, 2026",
            status: "Pending",
            statusColor: "bg-amber-500/20 text-amber-700 border-amber-500/30",
            image: "/assets/argo-3500.webp"
          }
        ].map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                {/* Header with status badge */}
                <div className="flex items-start justify-between">
                  <Badge
                    className={`${booking.statusColor} border text-xs font-semibold px-3 py-1 self-start`}
                    style={{ borderRadius: '12px' }}
                  >
                    {booking.status}
                  </Badge>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground font-medium">Booking #{booking.id.split('-')[1]}</span>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white/50">
                    <img
                      src={booking.image}
                      alt={booking.machine}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground mb-2 text-base leading-tight line-clamp-2">{booking.machine}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarCheck className="w-4 h-4 text-primary" />
                        <span className="font-medium">{booking.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">{booking.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2 border-t border-border/30">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border/60 hover:bg-primary/5 hover:border-primary/30 text-sm font-medium rounded-xl h-10"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-destructive/60 text-destructive hover:bg-destructive/5 hover:border-destructive/30 text-sm font-medium rounded-xl h-10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
        ))}

        {(!Array.isArray([]) || [].length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <CalendarCheck className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-6">Start your first premium equipment booking</p>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
              Browse Equipment
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Premium Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-8"
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
            A
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient">Premium Admin</h2>
            <p className="text-muted-foreground">admin@buildmate.com</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30">
                Premium Member
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                Verified
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card/50 rounded-2xl p-6 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-gradient">24</p>
              </div>
            </div>
          </div>

          <div className="bg-card/50 rounded-2xl p-6 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipment Used</p>
                <p className="text-2xl font-bold text-gradient">18</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start h-14 border-border/50 hover:bg-card/50 rounded-2xl">
            <Settings className="w-5 h-5 mr-4" />
            Account Settings
          </Button>
          <Button variant="outline" className="w-full justify-start h-14 border-border/50 hover:bg-card/50 rounded-2xl">
            <MessageSquare className="w-5 h-5 mr-4" />
            Support & Help
          </Button>
          <Button variant="outline" className="w-full justify-start h-14 border-border/50 hover:bg-card/50 rounded-2xl">
            <Heart className="w-5 h-5 mr-4" />
            Favorites
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-14 border-destructive/50 text-destructive hover:bg-destructive/10 rounded-2xl"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-4" />
            Logout
          </Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <DashboardErrorBoundary>
      <div className={`min-h-screen bg-gradient-to-br from-background via-background to-card/20 ${isMobile ? 'pt-20 pb-24' : ''}`}>
      {/* Premium Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-full w-80 glass-card z-40 border-r border-border/50">
          <div className="p-8 border-b border-border/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                <TruckIcon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">BuildMate</h1>
                <p className="text-sm text-muted-foreground">Premium Equipment</p>
              </div>
            </div>
          </div>

          <nav className="p-6 space-y-3">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden hover-3d click-3d transform hover:scale-105 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                    : 'text-muted-foreground hover:bg-card/50 hover:text-foreground hover:shadow-md'
                }`}
              >
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse" />
                )}
                <span className={`w-6 h-6 relative z-10 ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.icon}
                </span>
                <span className="font-semibold relative z-10">{item.label}</span>
                {activeTab === item.id && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      )}

      {/* Premium Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 glass-card border-b border-border/50 z-40 flex items-center justify-center px-6 py-3">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gradient">BuildMate</h1>
            <p className="text-xs text-muted-foreground">Premium Equipment Rental</p>
          </div>
        </div>
      )}

      {/* Premium Main Content */}
      <div className={`${!isMobile ? 'ml-80' : 'mt-20'} pb-24`}>
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {activeTab === "home" && <HomeTab />}
              {activeTab === "categories" && <CategoriesTab />}
              {activeTab === "analytics" && <AnalyticsTab />}
              {activeTab === "messages" && <MessagesTab />}
              {activeTab === "bookings" && <BookingsTab />}
              {activeTab === "profile" && <ProfileTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Premium Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 h-20 glass-card border-t border-border/50 z-40 flex items-center justify-around px-2 py-2">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 relative ${
                activeTab === item.id
                  ? 'bg-gradient-to-br from-primary/20 to-accent/20 text-primary shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:bg-card/30 hover:text-foreground'
              }`}
            >
              {activeTab === item.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl animate-pulse" />
              )}
              <span className={`w-6 h-6 relative z-10 ${activeTab === item.id ? 'text-primary' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs font-semibold relative z-10">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Premium Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 glass-card border-r border-border/50"
            >
              <div className="p-8 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                    <TruckIcon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gradient">BuildMate</h1>
                    <p className="text-sm text-muted-foreground">Premium Equipment</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-xl hover:bg-primary/10"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <nav className="p-6 space-y-3">
                {sidebarItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                        : 'text-muted-foreground hover:bg-card/50 hover:text-foreground hover:shadow-md'
                    }`}
                  >
                    {activeTab === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse" />
                    )}
                    <span className={`w-6 h-6 relative z-10 ${activeTab === item.id ? 'text-primary' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="font-semibold relative z-10">{item.label}</span>
                    {activeTab === item.id && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Booking Modal */}
      <BookingModal machine={selectedMachine} onClose={() => setSelectedMachine(null)} />
      </div>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;