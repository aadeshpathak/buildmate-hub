import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Share, Star, MapPin, ShoppingCart, MessageCircle, AlertCircle, Calendar, Clock, Shield, CheckCircle, Home, User, Menu, LogOut, CreditCard, Bell, Phone, Link, Copy, Globe, Mail, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMachine } from "@/hooks/useMachine";
import { useIsMobile } from "@/hooks/use-mobile";
import PageTransition from "@/components/PageTransition";
import BookingModal from "@/components/BookingModal";
import { toast } from "sonner";

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
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [inCart, setInCart] = useState(false);

  const hasPreviousBooking = useMemo(() => {
    try {
      const saved = localStorage.getItem('buildmate_bookings');
      if (!saved || !id) return false;
      const bookings = JSON.parse(saved);
      return bookings.some((b: any) => b.machineId === id);
    } catch {
      return false;
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

  // Handle booking
  const handleBooking = () => {
    if (!machine || !machine.available) return;
    setBookingModalOpen(true);
  };

  // Handle share
  const handleShare = () => {
    setShareModalOpen(true);
  };

  // Handle contact owner
  const handleContactOwner = () => {
    setContactModalOpen(true);
  };

  const { machine, loading, error } = useMachine(id);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('buildmate_cart');
      if (saved && id) {
        const cart = JSON.parse(saved);
        setInCart(cart.some((item: any) => item.machineId === id));
      }
    } catch {}
  }, [id]);

  const addToCart = useCallback(() => {
    if (!machine) return;
    const saved = localStorage.getItem('buildmate_cart');
    let cart = saved ? JSON.parse(saved) : [];
    const existing = cart.findIndex((item: any) => item.machineId === machine.id);
    if (existing >= 0) {
      cart.splice(existing, 1);
      localStorage.setItem('buildmate_cart', JSON.stringify(cart));
      setInCart(false);
      toast.success('Removed from cart');
    } else {
      cart.push({
        machineId: machine.id,
        machineName: machine.name,
        machineImage: machine.image,
        pricePerDay: machine.pricePerDay,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('buildmate_cart', JSON.stringify(cart));
      setInCart(true);
      toast.success('Added to cart');
    }
  }, [machine]);

  if (loading) {
    return (
      <PageTransition>
        <div className={`min-h-screen bg-gradient-to-br from-background via-background to-card/20 ${isMobile ? 'overflow-x-hidden' : ''}`}>
          {/* Header skeleton */}
          <header className={`sticky top-0 z-40 backdrop-blur-xl bg-white/3 border-b border-white/10 ${isMobile ? 'safe-area-inset-top' : ''}`}>
            <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-4'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/20 animate-pulse">
                    <div className="h-5 w-5 bg-muted-foreground/30 rounded"></div>
                  </div>
                  <div>
                    <div className="h-6 w-32 bg-muted/40 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-24 bg-muted/30 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted/20 animate-pulse">
                    <div className="h-5 w-5 bg-muted-foreground/30 rounded"></div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/20 animate-pulse">
                    <div className="h-5 w-5 bg-muted-foreground/30 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-6 pb-32' : 'px-6 py-8'}`}>
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-12'}`}>
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className={`rounded-2xl overflow-hidden bg-muted/20 ${isMobile ? 'aspect-[4/3]' : 'aspect-square'} animate-pulse`} />
              </div>

              {/* Content skeleton */}
              <div className="bg-white/3 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6">
                {/* Category badge */}
                <div className="h-8 w-24 bg-muted/30 rounded-full animate-pulse"></div>

                {/* Title */}
                <div className="space-y-2">
                  <div className="h-8 w-3/4 bg-muted/40 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-muted/30 rounded animate-pulse"></div>
                </div>

                {/* Rating and location */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 bg-muted/40 rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-muted/30 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-muted/30 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 bg-muted/40 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-muted/30 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted/20 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-muted/20 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-muted/20 rounded animate-pulse"></div>
                </div>

                {/* Pricing section */}
                <div className="bg-white/3 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="h-4 w-24 bg-muted/30 rounded animate-pulse mb-2"></div>
                      <div className="flex items-baseline gap-2">
                        <div className="h-8 w-32 bg-primary/20 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-muted/30 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-20 bg-green-500/20 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-24 bg-muted/30 rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 bg-muted/20 rounded-lg animate-pulse"></div>
                      <div className="h-12 bg-muted/20 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="h-14 bg-primary/20 rounded-lg animate-pulse"></div>
                    <div className="h-12 bg-muted/20 rounded-lg animate-pulse"></div>
                  </div>
                </div>

                {/* Specs section */}
                <div className="bg-white/3 backdrop-blur-xl rounded-xl p-6 border border-white/10 space-y-4">
                  <div className="h-6 w-40 bg-muted/40 rounded animate-pulse"></div>
                  <div className="grid grid-cols-1 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded-lg animate-pulse">
                        <div className="h-4 w-20 bg-muted/30 rounded"></div>
                        <div className="h-4 w-16 bg-muted/40 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features section */}
                <div className="bg-white/3 backdrop-blur-xl rounded-xl p-6 border border-white/10 space-y-3">
                  <div className="h-6 w-24 bg-muted/40 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-4 w-4 bg-green-400/30 rounded"></div>
                        <div className="h-4 w-48 bg-muted/20 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
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
            <Button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700">
              Browse All Equipment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTransition>
        <div className="min-h-screen bg-[#0B0C10] relative overflow-hidden">
      {/* Subtle radial gradients for depth */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      {/* Clean Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl bg-white/3 border-b border-white/10 ${isMobile ? 'safe-area-inset-top' : ''}`}>
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard?tab=home')}
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
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:bg-gray-700/50 rounded-lg transition-colors">
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
              <div className="space-y-2 sm:space-y-3">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={toggleWishlist}
                    className={`flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                      isWishlisted
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(); }}
                    className={`flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm border transition-colors ${
                      inCart
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <ShoppingBag className={`w-4 h-4 sm:w-5 sm:h-5 ${inCart ? 'text-red-500' : ''}`} />
                    <span className="hidden xs:inline">{inCart ? 'Remove' : 'Add to Cart'}</span>
                    <span className="inline xs:hidden">{inCart ? 'Remove' : 'Cart'}</span>
                  </button>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!machine.available}
                  className="w-full bg-yellow-400 text-black font-bold py-3 sm:py-4 rounded-lg text-sm sm:text-base hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {machine.available ? (
                    hasPreviousBooking ? 'Book Equipment Again' : 'Book Equipment Now'
                  ) : 'Currently Unavailable'}
                </button>

                <button
                  onClick={handleContactOwner}
                  className="w-full border border-gray-600 text-gray-300 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
      </div>
    </PageTransition>
      {isMobile && (
        <nav className="fixed bottom-4 left-4 right-4 backdrop-blur-xl bg-gray-900/95 border border-yellow-400/20 px-6 py-3 rounded-full safe-area-inset-bottom z-50 shadow-2xl shadow-yellow-400/10">
          <div className="flex items-center justify-around">
            <button
              onClick={() => navigate('/dashboard?tab=home')}
              className="flex flex-col items-center px-2 py-2 rounded-lg transition-colors text-gray-300 hover:text-gray-100"
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => navigate('/dashboard?tab=wishlist')}
              className="flex flex-col items-center px-2 py-2 rounded-lg transition-colors text-gray-300 hover:text-gray-100"
            >
              <Heart className={`w-5 h-5 mb-1 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs font-medium">Wishlist</span>
            </button>
            <button
              onClick={() => navigate('/dashboard?tab=bookings')}
              className="flex flex-col items-center px-2 py-2 rounded-lg transition-colors text-gray-300 hover:text-gray-100"
            >
              <ShoppingCart className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Bookings</span>
            </button>
            <button
              onClick={() => navigate('/dashboard?tab=account')}
              className="flex flex-col items-center px-2 py-2 rounded-lg transition-colors text-gray-300 hover:text-gray-100"
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Account</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center px-2 py-2 rounded-lg transition-colors text-gray-300 hover:text-gray-100"
            >
              <Menu className="w-5 h-5 mb-1" />
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
              className="fixed bottom-4 left-4 right-4 backdrop-blur-xl bg-gray-900/95 rounded-2xl z-50 p-6 safe-area-inset-bottom border border-yellow-400/20"
            >
              <div className="w-12 h-1 bg-gray-500 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-white mb-4">More Options</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigate('/dashboard?tab=payments');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Payments</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/dashboard?tab=notifications');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('adminAuth');
                    localStorage.removeItem('buildmate_wishlist');
                    localStorage.removeItem('buildmate_bookings');
                    navigate('/');
                    setMobileMenuOpen(false);
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

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModalOpen && machine && (
          <BookingModal
            machine={machine}
            onClose={() => setBookingModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShareModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900/95 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 w-full max-w-sm pointer-events-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Share</h3>
                  <button
                    onClick={() => setShareModalOpen(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied!');
                        setShareModalOpen(false);
                      } catch {
                        toast.error('Could not copy link');
                      }
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                      <Copy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="font-medium">Copy Link</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${machine?.name} on BuildMate - ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShareModalOpen(false)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="font-medium">WhatsApp</span>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShareModalOpen(false)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="font-medium">Facebook</span>
                  </a>

                  <a
                    href={`https://discord.com/share?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShareModalOpen(false)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="font-medium">Discord</span>
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(`BuildMate - ${machine?.name}`)}&body=${encodeURIComponent(`Check out ${machine?.name} on BuildMate: ${window.location.href}`)}`}
                    onClick={() => setShareModalOpen(false)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="font-medium">Gmail</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contact Owner Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-transparent z-50"
              onClick={() => setContactModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900/95 border border-yellow-400/20 rounded-2xl p-6 w-full max-w-md pointer-events-auto shadow-2xl mx-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Contact Owner</h3>
                  <button
                    onClick={() => setContactModalOpen(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">Praveen Mani Tripathi</p>
                        <p className="text-sm text-gray-400">Sales Manager</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <a
                        href="tel:8887956464"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-400/10 text-yellow-400 rounded-lg font-medium hover:bg-yellow-400/20 transition-colors text-sm flex-1"
                      >
                        <Phone className="w-4 h-4" />
                        +91 88879 56464
                      </a>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('8887956464');
                            toast.success('Number copied!');
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors flex-1 sm:flex-none"
                        >
                          <Copy className="w-4 h-4" />
                          <span className="sm:hidden">Copy</span>
                        </button>
                        <a
                          href={`https://wa.me/918887956464?text=${encodeURIComponent(`Hi, I'm interested in renting ${machine?.name} from BuildMate.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex-1 sm:flex-none"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="sm:hidden">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">Amit Shukla</p>
                        <p className="text-sm text-gray-400">Technical Manager</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <a
                        href="tel:8855995591"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-400/10 text-yellow-400 rounded-lg font-medium hover:bg-yellow-400/20 transition-colors text-sm flex-1"
                      >
                        <Phone className="w-4 h-4" />
                        +91 88559 95591
                      </a>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('8855995591');
                            toast.success('Number copied!');
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors flex-1 sm:flex-none"
                        >
                          <Copy className="w-4 h-4" />
                          <span className="sm:hidden">Copy</span>
                        </button>
                        <a
                          href={`https://wa.me/918855995591?text=${encodeURIComponent(`Hi, I'm interested in renting ${machine?.name} from BuildMate.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex-1 sm:flex-none"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="sm:hidden">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center pt-2">
                    Available Monday to Saturday, 9 AM to 6 PM IST
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetail;