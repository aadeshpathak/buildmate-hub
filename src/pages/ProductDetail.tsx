import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Share, Star, MapPin, ShoppingCart, MessageCircle, AlertCircle, Calendar, Clock, Shield, CheckCircle, Home, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMachine } from "@/hooks/useMachine";
import { useIsMobile } from "@/hooks/use-mobile";

// Clean minimal animations
const smoothAnimations = {
  fadeIn: {
    opacity: 0,
    y: 20
  },
  fadeInVisible: {
    opacity: 1,
    y: 0
  },
  scaleHover: {
    scale: 1.02
  }
};

const smoothTransitions = {
  default: {
    type: "tween",
    duration: 0.3,
    ease: "easeOut"
  },
  slow: {
    type: "tween",
    duration: 0.5,
    ease: "easeOut"
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile Bottom Navigation Items
  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'bookings', label: 'Bookings', icon: ShoppingCart },
    { id: 'account', label: 'Account', icon: User }
  ];

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('buildmate_wishlist');
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      setIsWishlisted(wishlist.includes(id));
    }
  }, [id]);

  // Toggle wishlist
  const toggleWishlist = () => {
    const savedWishlist = localStorage.getItem('buildmate_wishlist');
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    if (isWishlisted) {
      wishlist = wishlist.filter(machineId => machineId !== id);
    } else {
      wishlist.push(id);
    }

    localStorage.setItem('buildmate_wishlist', JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  const { machine, loading, error } = useMachine(id);

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-background via-background to-card/20 ${isMobile ? 'overflow-x-hidden' : ''} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground">Loading equipment details...</p>
        </div>
      </div>
    );
  }

  if (error || !machine) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-background via-background to-card/20 ${isMobile ? 'overflow-x-hidden' : ''} flex items-center justify-center`}>
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Equipment Not Found</h2>
            <p className="text-slate-400 mb-6">The equipment you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
              Browse All Equipment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] relative overflow-hidden">
      {/* Subtle radial gradients for depth */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      {/* Clean Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl bg-white/3 border-b border-white/10 ${isMobile ? 'safe-area-inset-top' : ''}`}>
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-white`}>{machine.name}</h1>
                <p className="text-gray-500 text-sm">{machine.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-700/50 rounded-lg transition-colors">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-6 pb-32' : 'px-6 py-8'}`}>
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-12'}`}>
          {/* Product Image */}
          <motion.div
            initial={smoothAnimations.fadeIn}
            animate={smoothAnimations.fadeInVisible}
            transition={smoothTransitions.default}
            className="space-y-4"
          >
             <div className="relative">
               <div className={`rounded-2xl overflow-hidden bg-gray-100 ${isMobile ? 'aspect-[4/3]' : 'aspect-square'}`}>
                 <motion.img
                   layoutId={machine.id}
                   src={machine.image}
                   alt={machine.name}
                   className="w-full h-full object-cover"
                   transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                 />
               </div>
               {machine.available && (
                 <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                   Available
                 </div>
               )}
             </div>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={smoothAnimations.fadeIn}
            animate={smoothAnimations.fadeInVisible}
            transition={{ ...smoothTransitions.default, delay: 0.1 }}
            className="bg-white/3 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {machine.category}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-white leading-tight`}
              >
                {machine.name}
              </motion.h1>

              {/* Rating & Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-4 text-sm text-gray-400"
              >
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{machine.rating}</span>
                  <span>({machine.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{machine.location}</span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-gray-300 leading-relaxed font-normal"
              >
                {machine.description}
              </motion.p>
            </div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/3 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-normal">Daily Rental Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-semibold text-yellow-400">
                      ₹{machine.pricePerDay.toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm font-normal">per day</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-sm font-normal">✓ Available</p>
                  <p className="text-gray-400 text-xs font-normal">Instant booking</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={toggleWishlist}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                      isWishlisted
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>

                  <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    <Share className="w-5 h-5" />
                    Share
                  </button>
                </div>

                <button
                  className="w-full bg-yellow-400 text-black font-bold py-4 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!machine.available}
                >
                  {machine.available ? 'Book Equipment Now' : 'Currently Unavailable'}
                </button>

                <button className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-colors">
                  Contact Owner
                </button>
              </div>
            </motion.div>

            {/* Technical Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white/3 backdrop-blur-xl rounded-xl p-6 border border-white/10 space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">Technical Specifications</h3>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(machine.specs).slice(0, 6).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/50"
                  >
                    <span className="text-gray-300 font-normal">{key}</span>
                    <span className="text-gray-100 font-normal">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white/3 backdrop-blur-xl rounded-xl p-6 border border-white/10 space-y-3"
            >
              <h3 className="text-lg font-semibold text-white">Features</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free delivery within 24 hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>24/7 technical support included</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Full insurance coverage</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>AJAX certified equipment</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-4 left-4 right-4 backdrop-blur-xl bg-white/20 border border-white/20 px-4 py-3 rounded-full safe-area-inset-bottom z-50 shadow-2xl">
          <div className="flex items-center justify-around">
            {mobileNavItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => navigate('/dashboard')}
                className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
            >
              <Menu className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </nav>
      )}

      {/* Mobile More Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
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
              className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/3 rounded-t-2xl z-50 p-6 safe-area-inset-bottom border-t border-white/10"
            >
              <div className="w-12 h-1 bg-gray-500 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-white mb-4">More Options</h3>
              <div className="space-y-3">
                {[
                  { id: 'payments', label: 'Payments', icon: ShoppingCart },
                  { id: 'notifications', label: 'Notifications', icon: MessageCircle }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    sessionStorage.removeItem('adminAuth');
                    localStorage.removeItem('buildmate_wishlist');
                    localStorage.removeItem('buildmate_bookings');
                    navigate('/');
                  }}
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
  );
};

export default ProductDetail;