import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMachines } from '@/hooks/useMachines';
import { Machine } from '@/data/machines';
import {
  // Core Navigation
  Home, Package, ShoppingCart, ShoppingBag, MessageSquare, Settings, LogOut,
  Bell, Search, Filter, Plus, Edit, Trash2, Eye, Star, MapPin,
  TrendingUp, TrendingDown, Users, DollarSign, Truck, Calendar,
  CheckCircle, Clock, XCircle, AlertCircle, Menu, X,
  BarChart3, PieChart, Activity, Zap, Award, Target,
  ChevronDown, ChevronRight, ChevronLeft, MoreHorizontal, Download,
  RefreshCw, Save, User, Mail, Phone, Globe,
  Heart, Grid, List, ArrowRight, ArrowLeft,
  // Premium additions
  Crown, Gem, Sparkles, Flame, Rocket, Shield,
  Camera, Video, Mic, Volume2, VolumeX
} from 'lucide-react';



// Premium UI Components - Professional Color Palette
const GlassCard = ({ children, className = '', variant = 'default', glow = false, ...props }) => {
  const variants = {
    default: 'bg-slate-900/70 backdrop-blur-xl border border-slate-700/40 shadow-2xl shadow-black/20',
    premium: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-slate-600/50 shadow-2xl shadow-black/30',
    dark: 'bg-black/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl shadow-black/40',
    accent: 'bg-gradient-to-br from-yellow-400/10 to-yellow-500/15 backdrop-blur-xl border border-yellow-400/30 shadow-2xl shadow-yellow-500/20',
    neon: 'bg-gradient-to-br from-yellow-400/15 to-yellow-500/20 backdrop-blur-xl border border-yellow-400/40 shadow-2xl shadow-yellow-500/25',
    card: 'bg-slate-900/60 backdrop-blur-xl border border-slate-700/40 shadow-xl shadow-black/20',
    hero: 'bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 shadow-2xl shadow-black/30',
    light: 'bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-900/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className={`rounded-3xl overflow-hidden ${variants[variant]} ${glow ? 'shadow-cyan-500/25' : ''} transition-all duration-500 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const NeonButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  glow = false,
  ...props
}) => {
  const variants = {
    primary: `bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold
               hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500
               shadow-lg hover:shadow-xl hover:shadow-yellow-500/25
               border border-yellow-300/50`,
    secondary: 'bg-black/60 backdrop-blur-sm text-white border border-slate-600/50 hover:bg-black/80 hover:text-yellow-400',
    outline: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black',
    ghost: 'text-yellow-300 hover:text-yellow-400 hover:bg-yellow-400/10',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500',
    premium: 'bg-gradient-to-r from-black to-slate-900 text-yellow-400 font-bold shadow-lg hover:shadow-xl hover:shadow-black/25 border border-yellow-400/50'
  };

  const sizes = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center font-bold rounded-2xl ${variants[variant]} ${sizes[size]}
                  ${glow ? 'shadow-cyan-500/50' : ''} transition-all duration-300 focus:outline-none
                  focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-transparent ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

const HolographicBadge = ({ children, variant = 'default', className = '', icon }) => {
  const variants = {
    default: 'bg-gradient-to-r from-slate-800 to-slate-700 text-white',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/50',
    warning: 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-amber-500/50',
    error: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/50',
    premium: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black shadow-yellow-500/50 animate-pulse',
    info: 'bg-gradient-to-r from-slate-900 to-black text-yellow-400 shadow-black/50'
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${variants[variant]} ${className} shadow-lg`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.div>
  );
};

const CyberInput = ({ className = '', icon, placeholder, ...props }) => (
  <div className="relative group">
    <input
      className={`w-full px-6 py-4 bg-black/50 backdrop-blur-sm border-2 border-slate-600/40 rounded-2xl
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400/50
                  text-white placeholder:text-slate-400 transition-all duration-300
                  hover:border-slate-500/60 hover:bg-black/60 ${className}`}
      placeholder={placeholder}
      {...props}
    />
    {icon && (
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 group-hover:text-yellow-300 transition-colors">
        {icon}
      </div>
    )}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </div>
);

const StatCard = ({ title, value, change, changeType = 'positive', icon, subtitle, premium = false }) => (
  <GlassCard variant={premium ? 'premium' : 'card'} className="p-6 hover:shadow-2xl border-slate-700/40">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-slate-400 font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-yellow-400 mb-2">{value}</p>
        {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
        {change && (
          <div className={`flex items-center gap-1 mt-2 ${changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeType === 'positive' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-400/30">
        <div className="text-yellow-400">
          {icon}
        </div>
      </div>
    </div>
  </GlassCard>
);

// Navigation Items - Premium Color Palette
const navigationItems = [
  { id: 'home', label: 'Home', icon: Home, color: 'text-yellow-400', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' },
  { id: 'products', label: 'Products', icon: Package, color: 'text-yellow-400', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-yellow-400', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'text-yellow-400', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' },
];

// Real orders data - will be fetched from Firebase in future
const recentOrders: any[] = []; // Empty for now - no real orders yet

// Featured products - will be populated from Firebase data
const featuredProducts: any[] = []; // Will be populated dynamically

const categories = [
  { id: 'slcm', name: 'SLCM Mixers', icon: '🏗️', count: 8, description: 'Self-loading concrete mixers with load cell technology', color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50' },
  { id: 'batching', name: 'Batching Plants', icon: '🏭', count: 12, description: 'Complete batching solutions - CRB, IRB, IBP series', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50' },
  { id: 'transit', name: 'Transit Mixers', icon: '🚛', count: 4, description: 'Mobile concrete transport - AF series', color: 'from-purple-500 to-indigo-600', bgColor: 'bg-purple-50' },
  { id: 'pumps', name: 'Concrete Pumps', icon: '🏗️', count: 4, description: 'High-performance pumping - ASP series', color: 'from-red-500 to-pink-600', bgColor: 'bg-red-50' },
  { id: 'boom-pumps', name: 'Boom Pumps', icon: '🚀', count: 3, description: 'Advanced boom pumps - AZX & SPBP series', color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50' },
  { id: 'pavers', name: 'Slip Form Pavers', icon: '🛣️', count: 1, description: 'Precision paving equipment - SPX series', color: 'from-gray-500 to-slate-600', bgColor: 'bg-gray-50' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifications, setNotifications] = useState(3);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [firestoreDataCount, setFirestoreDataCount] = useState<number | null>(null);

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { machines, loading: machinesLoading, loadedCount, hasMore } = useMachines(searchQuery, selectedCategory);
  const [featuredMachines, setFeaturedMachines] = useState<any[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Sort machines to show SLCMs (Self-Loading Concrete Mixers) first, but only when showing all categories
  const sortedMachines = useMemo(() => {
    if (!machines.length) return machines;

    // Only apply SLCM sorting when showing all categories (not when filtering by category)
    if (selectedCategory === 'all') {
      return [...machines].sort((a, b) => {
        const isASlcm = a.category === 'SLCM Mixers';
        const isBSlcm = b.category === 'SLCM Mixers';

        if (isASlcm && !isBSlcm) return -1; // SLCM comes first
        if (!isASlcm && isBSlcm) return 1;  // SLCM comes first
        return 0; // Keep original order for same category
      });
    }

    // When filtering by category, return machines as-is (they're already filtered)
    return machines;
  }, [machines, selectedCategory]);

  // Fetch featured machines for home section - now using only real Firebase data
  useEffect(() => {
    const fetchFeaturedMachines = async () => {
      try {
        setFeaturedLoading(true);
        console.log('Fetching real machines from Firebase...');

        const { getMachines } = await import('@/services/machineService');
        const allMachines = await getMachines();

        if (allMachines.length > 0) {
          // Get featured machines from real Firebase data
          const featured = allMachines
            .filter(machine => machine.available)
            .slice(0, isMobile ? 6 : 12)
            .map(machine => ({
              id: machine.id,
              name: machine.name,
              category: machine.category,
              price: `₹${machine.pricePerDay.toLocaleString()}/day`,
              rating: machine.rating,
              available: machine.available,
              image: machine.image,
              specs: Object.values(machine.specs || {}).slice(0, 3),
              featured: true
            }));
          setFeaturedMachines(featured);
          console.log(`Loaded ${featured.length} featured machines from Firebase`);
        } else {
          // No fallback data - app requires real Firebase data
          console.warn('No machines available in Firebase');
          setFeaturedMachines([]);
        }
      } catch (error) {
        console.error('Error fetching machines from Firebase:', error);
        setFeaturedMachines([]);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedMachines();
  }, [isMobile]);

  // Check Firestore data status
  useEffect(() => {
    const checkFirestoreData = async () => {
      try {
        const { getMachinesCount } = await import('@/services/machineService');
        const count = await getMachinesCount();
        setFirestoreDataCount(count);
        console.log(`Firestore contains ${count} machine records`);
      } catch (error) {
        console.error('Error checking Firestore data:', error);
        setFirestoreDataCount(null);
      }
    };

    checkFirestoreData();
  }, []);

  // Machines are now filtered server-side by Firebase

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 relative ${isMobile ? 'overflow-x-hidden' : 'overflow-hidden'}`}>
      {/* Premium Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/3 via-yellow-400/2 to-yellow-600/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl animate-pulse opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/3 rounded-full blur-3xl animate-pulse delay-1000 opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-600/2 rounded-full blur-3xl animate-pulse delay-500 opacity-15"></div>
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <motion.header
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 bg-black/95 backdrop-blur-2xl border-b border-slate-800 px-4 py-4 safe-area-inset-top"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">BuildMate</h1>
                <p className="text-xs text-yellow-400">Premium Hub</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center text-yellow-400 relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>
        </motion.header>
      )}

      {/* Desktop Layout */}
      <div className="flex relative z-10">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            className={`fixed left-0 top-0 z-40 h-screen transition-all duration-500 ${
              sidebarCollapsed ? 'w-24' : 'w-80'
            } bg-black/95 backdrop-blur-2xl border-r border-slate-700 shadow-2xl`}
          >
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/25"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Crown className="w-6 h-6 text-black" />
                </motion.div>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                      BuildMate Pro
                    </h1>
                    <p className="text-sm text-slate-400">Premium Equipment Hub</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-3">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                      activeTab === item.id
                        ? `bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 ${item.color} border-2 ${item.borderColor} shadow-lg shadow-yellow-500/20`
                        : 'text-slate-400 hover:bg-slate-700/60 hover:text-yellow-400'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${
                      activeTab === item.id ? item.bgColor : 'bg-slate-700/50'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {activeTab === item.id && !sidebarCollapsed && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg shadow-yellow-500/30"
                        layoutId="activeIndicator"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-300" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">Admin User</p>
                    <p className="text-sm text-slate-500 truncate">admin@buildmate.com</p>
                  </div>
                )}
              </div>
              <NeonButton
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-red-400 border-red-400/50 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {!sidebarCollapsed && 'Logout'}
              </NeonButton>
            </div>

            {/* Collapse Toggle */}
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
              <NeonButton
                variant="secondary"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-full shadow-lg"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </NeonButton>
            </div>
          </motion.aside>
        )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-2xl border-t border-slate-800 px-2 py-3 safe-area-inset-bottom"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navigationItems.slice(0, 4).map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 min-w-0 flex-1 min-h-[60px] ${
                  activeTab === item.id
                    ? 'text-yellow-400 bg-yellow-400/10 scale-105'
                    : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800/50'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className={`w-6 h-6 mb-1 ${
                  activeTab === item.id ? 'scale-110' : ''
                }`} />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </motion.button>
            ))}
            <motion.button
              onClick={() => setMobileMenuOpen(true)}
              className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 min-w-0 flex-1 min-h-[60px] ${
                mobileMenuOpen
                  ? 'text-yellow-400 bg-yellow-400/10 scale-105'
                  : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800/50'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className={`w-6 h-6 mb-1 ${
                mobileMenuOpen ? 'scale-110' : ''
              }`} />
              <span className="text-xs font-medium">More</span>
            </motion.button>
          </div>
        </motion.nav>
      )}

      {/* Mobile Bottom Sheet Menu */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-t border-slate-800 rounded-t-3xl max-h-[85vh] overflow-hidden safe-area-inset-bottom"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-1 bg-slate-600 rounded-full mx-auto absolute left-1/2 transform -translate-x-1/2 top-3"></div>
                  <h2 className="text-xl font-bold text-white mt-4">More Options</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-3 max-h-full overflow-y-auto">
                {navigationItems.slice(4).map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 min-h-[60px] ${
                      activeTab === item.id
                        ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-yellow-400 active:bg-slate-700/50'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="font-medium text-base">{item.label}</span>
                    {activeTab === item.id && (
                      <div className="ml-auto w-3 h-3 bg-yellow-400 rounded-full"></div>
                    )}
                  </motion.button>
                ))}

                <div className="border-t border-slate-800 pt-6 mt-8">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-200 min-h-[60px] active:bg-red-500/5"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="font-medium text-base">Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-500 ${!isMobile ? (sidebarCollapsed ? 'ml-24' : 'ml-80') : 'pb-24 overflow-x-hidden'}`}>
              <div className={`${isMobile ? 'p-4 pb-28' : 'p-6'} relative z-10 max-w-full overflow-x-hidden`}>
            {/* Home/Dashboard Tab */}
            {activeTab === 'home' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Universal Search & Filter Bar */}
                <GlassCard variant="accent" className={`relative overflow-hidden border-yellow-400/30 ${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className="relative">
                    {/* Search Bar */}
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1 relative">
                        <CyberInput
                          placeholder="Search AJAX equipment by name, category, or specifications..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          icon={<Search className="w-5 h-5" />}
                          className="w-full"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Filters */}
                      <div className="flex gap-3">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className={`px-4 py-3 bg-black/50 border-2 border-slate-600/40 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 min-w-[180px] ${isMobile ? 'text-sm' : ''}`}
                        >
                          <option value="all" className="bg-slate-800">All Categories</option>
                          <option value="slcm" className="bg-slate-800">SLCM Mixers</option>
                          <option value="batching" className="bg-slate-800">Batching Plants</option>
                          <option value="transit" className="bg-slate-800">Transit Mixers</option>
                          <option value="pumps" className="bg-slate-800">Concrete Pumps</option>
                          <option value="boom-pumps" className="bg-slate-800">Boom Pumps</option>
                          <option value="pavers" className="bg-slate-800">Slip Form Pavers</option>
                        </select>

                        <NeonButton
                          variant="outline"
                          icon={<Filter className="w-4 h-4" />}
                          className={isMobile ? 'px-3' : ''}
                        >
                          {isMobile ? 'Filter' : 'Advanced Filters'}
                        </NeonButton>
                      </div>
                    </div>

                    {/* Search Results Summary */}
                    <div className={`mt-4 flex items-center justify-between ${isMobile ? 'text-sm' : ''}`}>
                      <div className="flex items-center space-x-4 text-slate-300">
                        <span>Found {sortedMachines.length} equipment{sortedMachines.length !== 1 ? 's' : ''}</span>
                        {searchQuery && (
                          <span className="text-yellow-400">
                            for "{searchQuery}"
                          </span>
                        )}
                        {selectedCategory !== 'all' && (
                          <span className="text-emerald-400">
                            in {selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="text-slate-400 hover:text-white text-sm underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Progressive Loading Machines Grid */}
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {sortedMachines.map((equipment, index) => (
                    <motion.div
                      key={`${equipment.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className={`bg-black/60 backdrop-blur-xl rounded-3xl border border-slate-700/30 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer ${isMobile ? 'max-w-full' : ''}`}
                      onClick={() => navigate(`/product/${equipment.id}`)}
                    >
                        <div className="relative">
                          <img
                            src={equipment.image}
                            alt={equipment.name}
                            className={`w-full object-cover ${isMobile ? 'h-40' : 'h-48'}`}
                          />
                          <div className={`absolute top-3 right-3 ${isMobile ? 'scale-90' : ''}`}>
                            <HolographicBadge variant={equipment.available ? 'success' : 'error'}>
                              {equipment.available ? 'Available' : 'Booked'}
                            </HolographicBadge>
                          </div>
                          {equipment.featured && (
                            <div className="absolute top-3 left-3">
                              <HolographicBadge variant="premium" className={`text-xs ${isMobile ? 'scale-90' : ''}`}>
                                <Crown className={`w-3 h-3 mr-1 ${isMobile ? 'w-2 h-2' : ''}`} />
                                Featured
                              </HolographicBadge>
                            </div>
                          )}
                          <div className={`absolute bottom-3 left-3 ${isMobile ? 'scale-90' : ''}`}>
                            <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-white text-sm font-medium">{equipment.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
                          <div className="flex items-center space-x-1 mb-2 overflow-x-auto scrollbar-hide">
                            {Object.values(equipment.specs || {}).slice(0, 3).map((spec, specIndex) => (
                              <span key={specIndex} className={`px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full flex-shrink-0 ${isMobile ? 'text-xs' : ''}`}>
                                {spec}
                              </span>
                            ))}
                          </div>
                          <h3 className={`font-bold text-white mb-1 ${isMobile ? 'text-base' : ''}`}>{equipment.name}</h3>
                          <p className={`text-sm text-slate-300 mb-3 ${isMobile ? 'text-xs' : ''}`}>{equipment.category}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-bold text-yellow-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>{equipment.price}</p>
                              <p className={`text-xs text-slate-400 ${isMobile ? 'text-xs' : ''}`}>per day</p>
                            </div>
                            <NeonButton size={isMobile ? "sm" : "sm"} disabled={!equipment.available} className={isMobile ? 'px-3 py-2 text-sm' : ''}>
                              {equipment.available ? 'Book Now' : 'Unavailable'}
                            </NeonButton>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                {/* Premium Quick Actions & Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quick Actions */}
                  <GlassCard variant="card" className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-xl font-bold text-white">Quick Actions</h3>
                    </div>
                    <div className="space-y-4">
                      <NeonButton className="w-full justify-start" icon={<Plus className="w-4 h-4" />}>
                        New Equipment Listing
                      </NeonButton>
                      <NeonButton variant="secondary" className="w-full justify-start" icon={<BarChart3 className="w-4 h-4" />}>
                        Analytics Dashboard
                      </NeonButton>
                      <NeonButton variant="secondary" className="w-full justify-start" icon={<MessageSquare className="w-4 h-4" />}>
                        Customer Support
                      </NeonButton>
                      <NeonButton variant="secondary" className="w-full justify-start" icon={<Download className="w-4 h-4" />}>
                        Export Reports
                      </NeonButton>
                      <NeonButton
                        variant="secondary"
                        className="w-full justify-start"
                        icon={<Plus className="w-4 h-4" />}
                        disabled={firestoreDataCount !== null && firestoreDataCount >= 60}
                        onClick={async () => {
                          if (firestoreDataCount === null) {
                            alert('Checking Firestore status... Please wait.');
                            return;
                          }

                          let action = 'seed'; // 'seed' or 'add'
                          let confirmMessage = '';

                          if (firestoreDataCount === 0) {
                            confirmMessage = 'Ready to seed complete AJAX catalog (60+ machines) to Firestore?';
                          } else if (firestoreDataCount < 60) {
                            confirmMessage = `Firestore has ${firestoreDataCount} machines. Add the remaining ${60 - firestoreDataCount} machines?`;
                            action = 'add';
                          } else {
                            confirmMessage = `Firestore already has ${firestoreDataCount} machines (complete catalog). Force reseed?`;
                            action = 'force';
                          }

                          const confirmed = confirm(confirmMessage + '\n\nClick OK to proceed.');

                          if (!confirmed) {
                            alert('Operation cancelled.');
                            return;
                          }

                          try {
                            console.log(`Starting Firestore ${action} process...`);
                            const { seedFirestore } = await import('@/services/seedData');

                            let result;
                            if (action === 'add') {
                              result = await seedFirestore(true); // addRemaining = true
                            } else {
                              result = await seedFirestore(false); // normal seed
                            }

                            if (result.success) {
                              alert(`✅ ${result.message}\n\nPage will reload to show the updated data.`);
                              window.location.reload();
                            } else {
                              alert(`ℹ️ ${result.message}`);
                            }
                          } catch (error) {
                            console.error('Seeding failed:', error);
                            alert(`❌ Failed to ${action} data.\n\nError: ${error.message}\n\nCheck console for details.`);
                          }
                        }}
                      >
                        {firestoreDataCount === null ? '🔄 Checking Firestore...' :
                         firestoreDataCount === 0 ? '🚀 Seed Complete AJAX Catalog (60+ machines)' :
                         firestoreDataCount < 60 ? `➕ Add ${60 - firestoreDataCount} Missing Machines` :
                         `✅ Complete: ${firestoreDataCount} machines saved`}
                      </NeonButton>
                    </div>
                  </GlassCard>

                   {/* Machine Inventory Status */}
                   <GlassCard variant="card" className="p-6">
                     <div className="flex items-center space-x-2 mb-6">
                       <Package className="w-6 h-6 text-yellow-400" />
                       <h3 className="text-xl font-bold text-white">Machine Inventory</h3>
                     </div>
                     <div className="space-y-4">
                       <div className="text-center">
                         <div className="w-16 h-16 bg-emerald-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                           <Package className="w-8 h-8 text-emerald-400" />
                         </div>
                         <p className="text-white font-semibold text-lg">50 Machines Ready</p>
                         <p className="text-slate-300 text-sm mt-1">All AJAX equipment available for rental</p>
                         <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                           <div className="bg-slate-700/30 rounded-xl p-3">
                             <p className="text-2xl font-bold text-emerald-400">50</p>
                             <p className="text-xs text-slate-400">Total Machines</p>
                           </div>
                           <div className="bg-slate-700/30 rounded-xl p-3">
                             <p className="text-2xl font-bold text-blue-400">6</p>
                             <p className="text-xs text-slate-400">Categories</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </GlassCard>

                    {/* Analytics */}
                    <GlassCard variant="card" className="p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <BarChart3 className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-xl font-bold text-white">Analytics</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-8 h-8 text-yellow-400" />
                          </div>
                          <p className="text-slate-300 text-sm">Analytics dashboard coming soon</p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                 </motion.div>
               )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-white mb-2`}>Premium Equipment Catalog</h1>
                      <p className={`text-slate-300 ${isMobile ? 'text-sm' : ''}`}>Complete AJAX construction equipment inventory</p>
                    </div>
                    {!isMobile && <NeonButton icon={<Plus className="w-4 h-4" />}>
                      Add Equipment
                    </NeonButton>}
                  </div>

                  {/* Search & Filters */}
                  <GlassCard variant="card" className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <CyberInput
                          placeholder="Search premium equipment by name, category, or model..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          icon={<Search className="w-5 h-5" />}
                        />
                      </div>
                      <div className="flex gap-3">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-4 py-3 bg-black/50 border-2 border-slate-600/40 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        >
                          <option value="all" className="bg-slate-800">All Categories</option>
                          <option value="slcm" className="bg-slate-800">SLCM (Self-Loading Concrete Mixers)</option>
                          <option value="batching" className="bg-slate-800">Batching Plants (CRB/IRB/IBP)</option>
                          <option value="transit" className="bg-slate-800">AF Transit Mixers</option>
                          <option value="pumps" className="bg-slate-800">ASP Concrete Pumps</option>
                        </select>
                        <NeonButton variant="outline" icon={<Filter className="w-4 h-4" />}>
                          Advanced Filters
                        </NeonButton>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-slate-300">
                       Showing {sortedMachines.length} premium equipment items
                    </div>
                  </GlassCard>

                  {/* Equipment Grid */}
                  {machinesLoading ? (
                    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                      {[...Array(isMobile ? 3 : 6)].map((_, i) => (
                        <GlassCard key={i} variant="card" className="p-6 animate-pulse">
                          <div className="h-48 bg-slate-700 rounded-2xl mb-4"></div>
                          <div className="space-y-3">
                            <div className="h-4 bg-slate-600 rounded" />
                            <div className="h-3 bg-slate-600 rounded w-2/3" />
                            <div className="flex justify-between items-center">
                              <div className="space-y-2">
                                <div className="h-5 bg-slate-600 rounded w-20" />
                                <div className="h-3 bg-slate-600 rounded w-16" />
                              </div>
                              <div className="h-8 bg-slate-600 rounded w-20" />
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                   ) : (
                     <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                        {sortedMachines.slice(0, isMobile ? 6 : sortedMachines.length).map((machine, index) => (
                        <motion.div
                          key={machine.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="bg-black/60 backdrop-blur-xl rounded-3xl border border-slate-700/30 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer"
                        >
                          <div className="relative">
                            <img
                              src={machine.image}
                              alt={machine.name}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-3 right-3">
                              <HolographicBadge variant={machine.available ? 'success' : 'error'}>
                                {machine.available ? 'Available' : 'Booked'}
                              </HolographicBadge>
                            </div>
                            <div className="absolute top-3 left-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black transition-colors"
                              >
                                <Heart className="w-4 h-4 text-slate-400 hover:text-red-400 transition-colors" />
                              </motion.button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center space-x-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(machine.rating) ? 'text-yellow-400 fill-current' : 'text-slate-500'}`}
                                />
                              ))}
                              <span className="text-sm text-slate-400 ml-1">({machine.rating})</span>
                            </div>
                            <h3 className="font-bold text-white mb-1">{machine.name}</h3>
                            <p className="text-sm text-slate-300 mb-3">{machine.category}</p>
                            <div className="flex items-center space-x-2 mb-4">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-500">{machine.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xl font-bold text-yellow-400">₹{machine.pricePerDay.toLocaleString()}</p>
                                <p className="text-xs text-slate-400">per day</p>
                              </div>
                              <div className="flex space-x-2">
                                <NeonButton variant="outline" size="sm" className="p-2">
                                  <Eye className="w-4 h-4" />
                                </NeonButton>
                                <NeonButton variant="outline" size="sm" className="p-2">
                                  <Edit className="w-4 h-4" />
                                </NeonButton>
                              </div>
                            </div>
                            <NeonButton
                              className="w-full mt-4"
                              disabled={!machine.available}
                            >
                              {machine.available ? 'Book Now' : 'Currently Unavailable'}
                            </NeonButton>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!machinesLoading && sortedMachines.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">No equipment found</h3>
                      <p className="text-slate-300">Try adjusting your search or filter criteria</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Analytics and Settings tabs */}
              {activeTab === 'analytics' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-white`}>Customer Messages</h1>
                  <p className="text-slate-300">Communicate with your customers</p>
                </div>
                <GlassCard variant="card" className="p-6">
                  <p className="text-slate-300">Messages interface coming soon...</p>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-white`}>Analytics Dashboard</h1>
                  <p className="text-slate-300">Performance insights and business metrics</p>
                </div>
                <GlassCard variant="card" className="p-6">
                  <p className="text-slate-300">Analytics interface coming soon...</p>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-white`}>Settings</h1>
                  <p className="text-slate-300">Manage your account and business preferences</p>
                </div>
                <GlassCard variant="card" className="p-6">
                  <p className="text-slate-300">Settings interface coming soon...</p>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

/* Mobile optimizations and utilities */
const mobileStyles = `
/* Scrollbar hide utility */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Mobile touch scrolling */
.mobile-optimized {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Safe area for mobile devices */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Prevent horizontal overflow */
@media (max-width: 768px) {
  * {
    max-width: 100vw;
    box-sizing: border-box;
  }

  .mobile-container {
    overflow-x: hidden;
    width: 100vw;
  }

  .mobile-card {
    min-width: 280px;
    max-width: 320px;
    flex-shrink: 0;
  }

  .mobile-text {
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    line-height: 1.4;
  }

  .mobile-heading {
    font-size: clamp(1.25rem, 4vw, 1.875rem);
    line-height: 1.2;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = mobileStyles;
  document.head.appendChild(styleSheet);
}

export default Dashboard;