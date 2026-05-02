import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMachines } from '@/hooks/useMachines';
import { Machine } from '@/data/machines';
import { Loader2 } from 'lucide-react';

interface Booking {
  id: string;
  machineId: string;
  duration?: string;
  total?: number;
  status: string;
  createdAt: string;
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
const BookingCard = ({ booking }) => (
  <div className="bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-700">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="font-semibold text-white">Booking #{booking.id}</h3>
        <p className="text-sm text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {booking.status}
      </div>
    </div>
    <div className="space-y-2 text-sm text-gray-300">
      <p><span className="font-medium text-white">Duration:</span> {booking.duration || '7 days'}</p>
      <p><span className="font-medium text-white">Total:</span> ₹{(booking.total || 0).toLocaleString()}</p>
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
  // Always load all machines for dashboard category sections
  const { machines, loading: machinesLoading, loadedCount, hasMore } = useMachines('', 'all');

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
    }
  }, [machines, viewAllCategory]);

  // Filter machines based on display limit (since we always load all machines now)
  const displayedMachines = useMemo(() => {
    return machines.slice(0, displayLimit);
  }, [machines, displayLimit]);



  // Check if all machines are loaded in view all
  const isAllLoadedInViewAll = viewAllLimit >= viewAllMachines.length;

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
      <div className="absolute inset-0 opacity-5">
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
            <button className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-600">
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

              {/* Search Results or Filtered Results or Explore Sections */}
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
                                {displayedMachines.slice(0, viewAllLimit).map((machine, index) => (
                                  <MachineCard
                                    key={machine.id}
                                    machine={machine}
                                    index={index}
                                    isWishlisted={wishlist.includes(machine.id)}
                                    onToggleWishlist={toggleWishlist}
                                    onViewDetails={() => navigate(`/product/${machine.id}`)}
                                  />
                                ))}
                              </div>
                              {displayedMachines.length < machines.length && (
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
                      // View All Mode
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => setViewAllCategory(null)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                <ChevronRight className="w-5 h-5 rotate-180" />
                                <span>Back</span>
                              </button>
                              <h2 className="text-xl font-bold text-white">{viewAllCategory} Equipment</h2>
                            </div>
                            {viewAllLimit > 5 && (
                              <button
                                onClick={() => setViewAllLimit(5)}
                                className="text-gray-400 hover:text-gray-200 text-sm underline transition-colors"
                              >
                                Show Less
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    } else {
                      // Category Sections (filtered by selectedCategory)
                      let categorySections;
                      if (selectedCategory === 'all') {
                        // Show all categories
                        categorySections = categories.slice(0, 6).map((category) => (
                          <CategorySection
                            key={category}
                            title={category}
                            machines={machinesByCategory[category]?.slice(0, 6) || []}
                            wishlist={wishlist}
                            onToggleWishlist={toggleWishlist}
                            onViewDetails={(id) => navigate(`/product/${id}`)}
                            onViewAll={() => handleViewAll(category)}
                          />
                        ));
                      } else {
                        // Show only selected category
                        categorySections = categories.includes(selectedCategory) ? (
                          <CategorySection
                            key={selectedCategory}
                            title={selectedCategory}
                            machines={machinesByCategory[selectedCategory]?.slice(0, 6) || []}
                            wishlist={wishlist}
                            onToggleWishlist={toggleWishlist}
                            onViewDetails={(id) => navigate(`/product/${id}`)}
                            onViewAll={() => handleViewAll(selectedCategory)}
                          />
                        ) : null;
                      }

                      return (
                        <div className="space-y-8">
                          {/* Category Sections */}
                          {categorySections}
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
              {viewAllMachines.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
                      <p className="text-gray-500">Try selecting a different category</p>
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
                            onViewDetails={() => navigate(`/product/${machine.id}`)}
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
                        onViewDetails={() => navigate(`/product/${machine.id}`)}
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
                    <BookingCard key={booking.id} booking={booking} />
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
        <nav className="fixed bottom-4 left-4 right-4 backdrop-blur-xl bg-white/20 border border-white/20 px-6 py-3 rounded-full safe-area-inset-bottom z-50 shadow-2xl">
          <div className="flex items-center justify-around">
              {mobileNavItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center px-2 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'text-yellow-400 bg-yellow-500/20'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mb-1 ${activeTab === item.id ? 'text-yellow-400' : 'text-gray-400'}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`flex flex-col items-center px-2 py-2 rounded-lg transition-colors ${
                  mobileMenuOpen
                    ? 'text-yellow-400 bg-yellow-500/20'
                    : 'text-gray-400 hover:text-gray-200'
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