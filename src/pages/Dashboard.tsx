import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMachines } from '@/hooks/useMachines';
import { Machine } from '@/data/machines';
import { Loader2 } from 'lucide-react';

interface Booking {
  id: string;
  machineId: string;
  machineName?: string;
  machineImage?: string;
  days?: number;
  duration?: string;
  total?: number;
  status: string;
  createdAt: string;
  selectedDates?: string[];
}
import {
  // Core Navigation
  Home, Heart, ShoppingCart, User, Bell, MessageSquare, LogOut, CreditCard,
  Search, Filter, Plus, Star, MapPin, Menu, X, ChevronRight,
  Truck, Calendar, CheckCircle, Clock, AlertCircle, MoreHorizontal,
  // Premium additions
  Crown, Sparkles, Flame
} from 'lucide-react';


// Navigation Items - Consumer Dashboard
const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'bookings', label: 'My Bookings', icon: ShoppingCart },
  { id: 'account', label: 'My Account', icon: User },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell }
];

// Mobile Bottom Navigation Items
const mobileNavItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'bookings', label: 'Bookings', icon: ShoppingCart },
  { id: 'account', label: 'Account', icon: User },
  { id: 'more', label: 'More', icon: Menu }
];

// Machine Card Component
const MachineCard = ({ machine, isWishlisted, onToggleWishlist, onViewDetails, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.6,
      delay: index * 0.05,
      ease: "easeOut"
    }}
    whileHover={{
      y: -4,
      transition: { duration: 0.2, ease: "easeOut" }
    }}
    className="bg-white/3 backdrop-blur-xl rounded-xl shadow-sm border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 will-change-transform"
  >
    <div className="relative">
      <motion.img
        layoutId={machine.id}
        src={machine.image}
        alt={machine.name}
        className="w-full h-48 object-cover"
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      />
      <button
        onClick={() => onToggleWishlist(machine.id)}
        className="absolute top-3 right-3 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-600"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
      </button>
      {machine.available && (
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Available
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-white mb-1">{machine.name}</h3>
      <p className="text-sm text-gray-400 mb-2">{machine.category}</p>
      <div className="flex items-center mb-3">
        <div className="flex items-center">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400 ml-1">{machine.rating}</span>
        </div>
        <span className="text-sm text-gray-400 ml-2">({machine.reviews} reviews)</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-white">₹{machine.pricePerDay.toLocaleString()}</p>
          <p className="text-sm text-gray-400">per day</p>
        </div>
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  </motion.div>
);

// Card Component (replacing GlassCard)
const Card = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    accent: 'bg-yellow-50 border border-yellow-200',
    card: 'bg-white border border-gray-200'
  };

  return (
    <div className={`rounded-xl shadow-sm ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Category Section Component
const CategorySection = ({ title, machines, wishlist, onToggleWishlist, onViewDetails, onViewAll }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <button
        onClick={onViewAll}
        className="text-yellow-400 font-medium text-sm hover:text-yellow-300 transition-colors"
      >
        View All
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {machines.map((machine, index) => (
        <motion.div
          key={machine.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.05,
            ease: "easeOut"
          }}
          whileHover={{
            y: -4,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          className="bg-white/3 backdrop-blur-xl rounded-lg shadow-sm border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 will-change-transform"
        >
          <div className="relative">
            <img
              src={machine.image}
              alt={machine.name}
              className="w-full h-32 object-cover"
            />
            <button
              onClick={() => onToggleWishlist(machine.id)}
              className="absolute top-2 right-2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-600"
            >
              <Heart className={`w-3 h-3 ${wishlist.includes(machine.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          <div className="p-3">
            <h4 className="font-medium text-white text-sm mb-1 truncate">{machine.name}</h4>
            <p className="text-xs text-gray-400 mb-2">₹{machine.pricePerDay.toLocaleString()}/day</p>
            <button
              onClick={() => onViewDetails(machine.id)}
              className="w-full py-2 bg-yellow-400 text-black text-xs font-medium rounded hover:bg-yellow-500 transition-colors"
            >
              Book Now
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Booking Card Component
const BookingCard = ({ booking, onCancel, onDelete }) => (
  <div className="bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-700">
    <div className="flex items-start gap-3 mb-3">
      {booking.machineImage && (
        <img src={booking.machineImage} alt={booking.machineName} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{booking.machineName || `Booking #${booking.id}`}</h3>
        <p className="text-sm text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
        'bg-yellow-500/20 text-yellow-400'
      }`}>
        {booking.status}
      </div>
    </div>
    <div className="space-y-2 text-sm text-gray-300">
      <p><span className="font-medium text-white">Duration:</span> {booking.duration || `${booking.days || 1} days`}</p>
      <p><span className="font-medium text-white">Total:</span> ₹{(booking.total || 0).toLocaleString()}</p>
      {booking.selectedDates && booking.selectedDates.length > 0 && (
        <p><span className="font-medium text-white">Dates:</span> {new Date(booking.selectedDates[0]).toLocaleDateString()}{booking.selectedDates.length > 1 ? ` — ${new Date(booking.selectedDates[booking.selectedDates.length - 1]).toLocaleDateString()}` : ''}</p>
      )}
    </div>
    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-700">
      {booking.status !== 'cancelled' && (
        <button
          onClick={() => onCancel(booking.id)}
          className="py-1.5 px-3 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors"
        >
          Cancel
        </button>
      )}
      <button
        onClick={() => onDelete(booking.id)}
        className="py-1.5 px-3 rounded-lg border border-gray-600 text-gray-400 text-xs font-medium hover:bg-gray-700/50 hover:text-gray-200 transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(6); // Start with 6 machines
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [viewAllCategory, setViewAllCategory] = useState<string | null>(null);
  const [viewAllLimit, setViewAllLimit] = useState(5);
  const [viewAllMachines, setViewAllMachines] = useState<Machine[]>([]);
  // Start with 5 machines in view all

    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const location = useLocation();
    const scrollRestoredRef = useRef(false);

  const handleViewDetails = (machineId: string) => {
    try {
      sessionStorage.setItem(`scrollPos_${window.location.pathname}`, window.scrollY.toString());
    } catch (e) {
      // Ignore storage errors
    }
    navigate(`/product/${machineId}`);
  };
  // Always load all machines for dashboard category sections
  const { machines, loading: machinesLoading, loadedCount, hasMore } = useMachines(searchQuery, selectedCategory);

  // Handle category filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when filtering by category
    setDisplayLimit(6); // Reset display limit when changing categories
    setViewAllCategory(null); // Exit view all mode
    setViewAllLimit(5); // Reset view all limit
  };

  // Handle view all for a category
  const handleViewAll = (category: string) => {
    setViewAllCategory(category);
    setViewAllLimit(5);
  };

  // Cancel a booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => {
      const updated = prev.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      localStorage.setItem('buildmate_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  // Delete a booking
  const handleDeleteBooking = (bookingId: string) => {
    setBookings(prev => {
      const updated = prev.filter(b => b.id !== bookingId);
      localStorage.setItem('buildmate_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  // Load more machines in view all mode
  const loadMoreInViewAll = () => {
    setViewAllLimit(prev => prev + 5);
  };

  // Hide all and return to category view
  const hideAll = () => {
    setViewAllCategory(null);
    setViewAllLimit(5);
  };

  // Handle search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('all'); // Clear category filter when searching
    setDisplayLimit(6); // Reset display limit when searching
  };

  // Reset filter loading when machines finish loading
  useEffect(() => {
    if (!machinesLoading) {
      setIsFilterLoading(false);
    }
  }, [machinesLoading]);

  // Scroll to top when viewAllCategory changes
  useEffect(() => {
    if (viewAllCategory) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [viewAllCategory]);

  // Load wishlist and bookings from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('buildmate_wishlist');
    const savedBookings = localStorage.getItem('buildmate_bookings');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist) as string[]);
    if (savedBookings) setBookings(JSON.parse(savedBookings) as Booking[]);
  }, []);

  // Set defer flag to prevent global ScrollManager from interfering
  useLayoutEffect(() => {
    const deferKey = `scrollDefer_${location.pathname}`;
    try {
      sessionStorage.setItem(deferKey, 'true');
    } catch (e) {
      // ignore
    }
    return () => {
      try {
        sessionStorage.removeItem(deferKey);
      } catch (e) {
        // ignore
      }
    };
  }, [location.pathname]);

  // Restore scroll position after machines load (when returning from product detail)
  useLayoutEffect(() => {
    if (!machinesLoading && !scrollRestoredRef.current) {
      try {
        const key = `scrollPos_${location.pathname}`;
        const saved = sessionStorage.getItem(key);
        if (saved) {
          const scrollY = parseInt(saved, 10);
          if (!isNaN(scrollY)) {
            window.scrollTo({ top: scrollY, behavior: 'instant' });
          }
          sessionStorage.removeItem(key);
        }
      } catch (e) {
        // ignore storage errors
      }
      scrollRestoredRef.current = true;
    }
  }, [machinesLoading, location.pathname]);

  // Read initial tab from URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && navigationItems.some(n => n.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Save wishlist and bookings to localStorage
  useEffect(() => {
    localStorage.setItem('buildmate_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('buildmate_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Group machines by category for category sections
  const machinesByCategory = useMemo(() => {
    const grouped: { [key: string]: Machine[] } = {};
    machines.forEach(machine => {
      const cat = machine.category?.trim() || 'Unknown';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(machine);
    });
    return grouped;
  }, [machines]);

  // Update viewAllMachines when machines or viewAllCategory change
  useEffect(() => {
    if (viewAllCategory) {
      // Filter machines directly by category (case-insensitive and trimmed)
      const machinesForCategory = machines.filter(machine =>
        machine.category && machine.category.trim().toLowerCase() === viewAllCategory.trim().toLowerCase()
      );
      setViewAllMachines(machinesForCategory);
    } else {
      setViewAllMachines([]);
    }
  }, [machines, viewAllCategory]);

  // Filter machines based on display limit (since we always load all machines now)
  const displayedMachines = useMemo(() => {
    let filtered = machines;

    if (searchQuery) {
      filtered = filtered.filter(machine =>
        machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(machine =>
        machine.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return filtered.slice(0, displayLimit);
  }, [machines, searchQuery, selectedCategory, displayLimit]);



  // Check if all machines are loaded in view all
  const isAllLoadedInViewAll = viewAllLimit >= viewAllMachines.length;

  // Count of machines after current filters (for Load More button logic)
  const filteredMachineCount = useMemo(() => {
    if (searchQuery) {
      return machines.filter(machine =>
        machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).length;
    }
    if (selectedCategory !== 'all') {
      return machines.filter(machine =>
        machine.category.toLowerCase() === selectedCategory.toLowerCase()
      ).length;
    }
    return machines.length;
  }, [machines, searchQuery, selectedCategory]);

  // Get available categories
  const categories = Object.keys(machinesByCategory);

  // Toggle wishlist
  const toggleWishlist = (machineId: string) => {
    setWishlist(prev =>
      prev.includes(machineId)
        ? prev.filter(id => id !== machineId)
        : [...prev, machineId]
    );
  };

  // Add booking (for future Firestore sync)
  const addBooking = (machineId: string, bookingData: Partial<Booking>) => {
    const newBooking = {
      id: Date.now().toString(),
      machineId,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    localStorage.removeItem('buildmate_wishlist');
    localStorage.removeItem('buildmate_bookings');
    navigate('/');
  };

  // Load more machines
  const loadMore = () => {
    setDisplayLimit(prev => prev + 6);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed left-4 top-8 w-16 rounded-2xl bg-gray-900/90 backdrop-blur-xl border border-white/10 z-50 overflow-y-auto campfire-animation">
          {/* Logo */}
          <div className="p-3 border-b border-gray-700 flex justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-black" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex justify-center items-center px-2 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                  title={item.label}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-yellow-400' : 'text-gray-400'}`} />
                </button>
              ))}
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex justify-center items-center px-2 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      )}

      <div className="min-h-screen bg-[#0B0C10] relative overflow-hidden">
      {/* Subtle radial gradients for depth */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/3 border-b border-white/10 px-4 py-4 safe-area-inset-top">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">BuildMate</h1>
                <p className="text-xs font-normal text-gray-400">Equipment Rental</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('notifications')}
              className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-600"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

        {/* Main Content */}
        <main className={`${isMobile ? 'pb-20' : 'ml-24'} min-h-screen bg-[#0B0C10]`}>

          {/* Content Area */}
          <div className="p-4 md:p-6">
            {/* Home Page */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="sticky top-0 z-30 bg-[#0B0C10]/80 backdrop-blur-xl pb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search equipment..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filter */}
                <style>
                  {`
                    .filter-scroll::-webkit-scrollbar { display: none; }
                    @keyframes campfire {
                      0%, 100% {
                        box-shadow: 0 4px 6px -2px rgba(255, 215, 0, 0.1), 0 2px 4px -1px rgba(255, 255, 0, 0.05);
                      }
                      25% {
                        box-shadow: 0 10px 20px -5px rgba(255, 215, 0, 0.15), 0 5px 10px -3px rgba(255, 255, 0, 0.1);
                      }
                      50% {
                        box-shadow: 0 25px 50px -12px rgba(255, 215, 0, 0.25), 0 15px 30px -8px rgba(255, 255, 0, 0.2);
                      }
                      75% {
                        box-shadow: 0 15px 30px -8px rgba(255, 215, 0, 0.2), 0 8px 15px -4px rgba(255, 255, 0, 0.15);
                      }
                    }
                    .campfire-animation {
                      animation: campfire 8s ease-in-out infinite;
                    }
                  `}
                </style>
                <div className="flex space-x-2 overflow-x-auto pb-2 filter-scroll">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedCategory === 'all' && !searchQuery
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,204,0,0.3)]'
                          : 'bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {machinesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                    <span className="ml-3 text-gray-300">Loading...</span>
                  </div>
                ) : (
                  <div>
                    {(() => {
                      if (searchQuery) {
                        // Search Results
                        return (
                          <div>
                            <h2 className="text-xl font-semibold text-white mb-4">
                              Search Results for "{searchQuery}"
                            </h2>
                            {displayedMachines.length === 0 ? (
                              <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                                <p className="text-gray-400">Try adjusting your search terms</p>
                              </div>
                            ) : (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {displayedMachines.map((machine, index) => (
                                    <MachineCard
                                      key={machine.id}
                                      machine={machine}
                                      index={index}
                                      isWishlisted={wishlist.includes(machine.id)}
                                      onToggleWishlist={toggleWishlist}
                                      onViewDetails={() => handleViewDetails(machine.id)}
                                    />
                                  ))}
                                </div>
                                {displayedMachines.length < filteredMachineCount && (
                                  <div className="text-center mt-6">
                                    <button
                                      onClick={loadMore}
                                      className="px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                                    >
                                      Load More
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      } else if (viewAllCategory) {
                        // View All for a specific category
                        const cat = viewAllCategory;
                        return (
                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <button
                                  onClick={hideAll}
                                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors mb-2"
                                >
                                  &larr; Back to Categories
                                </button>
                                <h2 className="text-2xl font-semibold text-white">{cat}</h2>
                                <p className="text-sm text-gray-400 mt-1">{viewAllMachines.length} items</p>
                              </div>
                            </div>
                            {viewAllMachines.length === 0 ? (
                              <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Filter className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-2">No equipment found</h3>
                                <p className="text-gray-400">Try selecting a different category</p>
                              </div>
                            ) : (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {viewAllMachines.slice(0, viewAllLimit).map((machine, index) => (
                                    <MachineCard
                                      key={machine.id}
                                      machine={machine}
                                      index={index}
                                      isWishlisted={wishlist.includes(machine.id)}
                                      onToggleWishlist={toggleWishlist}
                                      onViewDetails={() => handleViewDetails(machine.id)}
                                    />
                                  ))}
                                </div>
                                {!isAllLoadedInViewAll && (
                                  <div className="text-center mt-6">
                                    <button
                                      onClick={loadMoreInViewAll}
                                      className="flex items-center space-x-2 px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors mx-auto"
                                    >
                                      <Plus className="w-5 h-5" />
                                      <span>Load More Equipment</span>
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      } else {
                        // Category Sections (filtered by selectedCategory)
                        let categorySections;
                        if (selectedCategory === 'all') {
                          categorySections = categories.map((category) => (
                            <CategorySection
                              key={category}
                              title={category}
                              machines={machinesByCategory[category]?.slice(0, 6) || []}
                              wishlist={wishlist}
                              onToggleWishlist={toggleWishlist}
                              onViewDetails={(id) => handleViewDetails(id)}
                              onViewAll={() => handleViewAll(category)}
                            />
                          ));
                        } else {
                          categorySections = categories.includes(selectedCategory) ? (
                            <CategorySection
                              key={selectedCategory}
                              title={selectedCategory}
                              machines={machinesByCategory[selectedCategory]?.slice(0, 6) || []}
                              wishlist={wishlist}
                              onToggleWishlist={toggleWishlist}
                              onViewDetails={(id) => handleViewDetails(id)}
                              onViewAll={() => handleViewAll(selectedCategory)}
                            />
                          ) : null;
                        }

                        return (
                          <div className="space-y-8">
                            {categorySections}
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Page */}
            {activeTab === 'wishlist' && (
              <div>
                <h1 className="text-2xl font-semibold text-white mb-6">My Wishlist</h1>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No items in wishlist</h3>
                    <p className="text-gray-400">Start adding equipment to your wishlist!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {machines
                      .filter(machine => wishlist.includes(machine.id))
                      .map((machine, index) => (
                        <MachineCard
                          key={machine.id}
                          machine={machine}
                          index={index}
                          isWishlisted={true}
                          onToggleWishlist={toggleWishlist}
                          onViewDetails={() => handleViewDetails(machine.id)}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Page */}
            {activeTab === 'bookings' && (
              <div>
                <h1 className="text-2xl font-semibold text-white mb-6">My Bookings</h1>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No bookings yet</h3>
                    <p className="text-gray-400">Your rental bookings will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} onCancel={handleCancelBooking} onDelete={handleDeleteBooking} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Account Page */}
            {activeTab === 'account' && (
              <div>
                <h1 className="text-2xl font-semibold text-white mb-6">My Account</h1>
                <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                  <div className="text-center py-8">
                    <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Account Features</h3>
                    <p className="text-gray-400">Coming soon...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Page */}
            {activeTab === 'payments' && (
              <div>
                <h1 className="text-2xl font-semibold text-white mb-6">Payment History</h1>
                <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                  <div className="text-center py-8">
                    <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Payment History</h3>
                    <p className="text-gray-400">Coming soon...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Page */}
            {activeTab === 'notifications' && (
              <div>
                <h1 className="text-2xl font-semibold text-white mb-6">Notifications</h1>
                <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                  <div className="text-center py-8">
                    <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Notifications</h3>
                    <p className="text-gray-400">Coming soon...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <nav className="fixed bottom-4 left-4 right-4 backdrop-blur-xl bg-gray-900/95 border border-yellow-400/20 px-6 py-3 rounded-full safe-area-inset-bottom z-50 shadow-2xl shadow-yellow-400/10">
            <div className="flex items-center justify-around">
              {mobileNavItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center px-2 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'text-yellow-400 bg-yellow-500/20'
                      : 'text-gray-300 hover:text-gray-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mb-1 ${activeTab === item.id ? 'text-yellow-400' : 'text-gray-300'}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`flex flex-col items-center px-2 py-2 rounded-lg transition-colors ${
                  mobileMenuOpen
                    ? 'text-yellow-400 bg-yellow-500/20'
                    : 'text-gray-300 hover:text-gray-100'
                }`}
              >
                <Menu className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">More</span>
              </button>
            </div>
          </nav>
        )}

        {/* Mobile More Menu */}
        <AnimatePresence>
          {isMobile && mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-4 left-4 right-4 backdrop-blur-xl bg-white/3 rounded-2xl z-50 p-6 safe-area-inset-bottom border border-white/10"
              >
                <div className="w-12 h-1 bg-gray-500 rounded-full mx-auto mb-6" />
                <h3 className="text-lg font-semibold text-white mb-4">More Options</h3>
                <div className="space-y-3">
                  {navigationItems.slice(4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                        activeTab === item.id
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-yellow-400' : 'text-gray-400'}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Dashboard;