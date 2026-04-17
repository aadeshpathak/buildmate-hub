import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share, Star, MapPin, ShoppingCart, MessageCircle, AlertCircle, Calendar, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMachine } from "@/hooks/useMachine";
import { useIsMobile } from "@/hooks/use-mobile";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-card/20 ${isMobile ? 'overflow-x-hidden' : ''}`}>
      {/* Header */}
      <motion.div
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 glass-card border-b border-border/50 ${isMobile ? 'safe-area-inset-top' : ''}`}
        style={isMobile ? { paddingTop: 'env(safe-area-inset-top)' } : {}}
      >
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/dashboard')}
                className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </motion.button>
              <div>
                <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gradient`}>{machine.name}</h1>
                <p className="text-muted-foreground text-sm">{machine.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  isWishlisted
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
              >
                <Share className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-6 pb-24' : 'px-6 py-8'}`}>
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-8' : 'lg:grid-cols-2 gap-12'}`}>
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative group">
              <motion.div
                className={`rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl ${isMobile ? 'aspect-[4/3]' : 'aspect-square'}`}
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={machine.image}
                  alt={machine.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-emerald-500/90 text-white border-0 px-4 py-2 text-sm font-semibold">
                    ✓ Available Now
                  </Badge>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Title & Rating */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                  {machine.category}
                </Badge>
                <Badge className={`border-0 ${machine.available ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                  {machine.available ? 'Available' : 'Booked'}
                </Badge>
              </div>

              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'} font-bold text-white mb-2 leading-tight`}>
                {machine.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(machine.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                    />
                  ))}
                  <span className="text-white font-semibold ml-2">{machine.rating}</span>
                </div>
                <span className="text-slate-400">({machine.reviews} reviews)</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {machine.location}
                </span>
              </div>

              <p className={`text-slate-300 leading-relaxed ${isMobile ? 'text-base' : 'text-lg'}`}>
                {machine.description}
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Overview</TabsTrigger>
                <TabsTrigger value="specs" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Specs</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Reviews</TabsTrigger>
                <TabsTrigger value="booking" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Booking</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Pricing & Quick Actions */}
                <div className={`bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl border border-white/10 ${isMobile ? 'p-4' : 'p-6'}`}>
                  {/* Price Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Daily Rental Rate</p>
                      <div className="flex items-baseline gap-2">
                        <p className={`font-bold text-yellow-400 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                          ₹{machine.pricePerDay.toLocaleString()}
                        </p>
                        <p className="text-slate-400 text-sm">per day</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-sm font-medium">⚡ Instant Booking</p>
                      <p className="text-slate-400 text-xs">Available 24/7</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-semibold transition-all duration-300 ${
                          isWishlisted
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 py-4 px-4 bg-slate-700 text-white rounded-2xl font-semibold hover:bg-slate-600 transition-colors"
                      >
                        <Share className="w-5 h-5" />
                        Share
                      </motion.button>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                        disabled={!machine.available}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {machine.available ? 'Book Equipment Now' : 'Currently Unavailable'}
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-4 rounded-2xl">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Contact Owner
                      </Button>
                    </motion.div>

                    <div className="text-center space-y-2 pt-4 border-t border-white/10">
                      <p className="text-slate-400 text-sm">
                        ⚡ Instant confirmation • 📞 24/7 Support • 🔒 Secure booking
                      </p>
                      <p className="text-slate-500 text-xs">
                        Free delivery within 24 hours • AJAX certified equipment
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-6 mt-6">
                <div className={`bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl border border-white/10 ${isMobile ? 'p-4' : 'p-6'}`}>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(machine.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 px-4 bg-slate-800/50 rounded-xl border border-white/5">
                        <span className="text-slate-400 font-medium">{key}</span>
                        <span className="text-white font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6 mt-6">
                <div className={`bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl border border-white/10 ${isMobile ? 'p-4' : 'p-6'}`}>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Customer Reviews
                  </h3>
                  <div className="space-y-4">
                    {/* Placeholder reviews - in a real app, these would come from Firebase */}
                    <div className="border-b border-white/10 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">RK</span>
                          </div>
                          <span className="text-white font-medium">Rajesh Kumar</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">Excellent machine, delivered on time and in perfect condition. Highly recommend for construction projects.</p>
                      <p className="text-slate-500 text-xs mt-2">2 weeks ago</p>
                    </div>
                    <div className="border-b border-white/10 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AS</span>
                          </div>
                          <span className="text-white font-medium">Anjali Sharma</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                          <Star className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">Good performance overall. The booking process was smooth and support was responsive.</p>
                      <p className="text-slate-500 text-xs mt-2">1 month ago</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="booking" className="space-y-6 mt-6">
                <div className={`bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl border border-white/10 ${isMobile ? 'p-4' : 'p-6'}`}>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    Book This Equipment
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-slate-400 text-sm font-medium">Start Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-slate-400 text-sm font-medium">End Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 text-sm font-medium">Project Type</label>
                      <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-emerald-400 focus:outline-none">
                        <option value="">Select project type</option>
                        <option value="construction">Construction</option>
                        <option value="mining">Mining</option>
                        <option value="demolition">Demolition</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 text-sm font-medium">Additional Requirements</label>
                      <textarea
                        placeholder="Any special requirements or instructions..."
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-emerald-400 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Daily Rate</span>
                        <span className="text-white font-semibold">₹{machine.pricePerDay.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Duration</span>
                        <span className="text-white font-semibold">7 days</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-emerald-400 font-bold">₹{(machine.pricePerDay * 7).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Free delivery within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>24/7 technical support included</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Full insurance coverage</span>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                        disabled={!machine.available}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {machine.available ? 'Confirm Booking' : 'Currently Unavailable'}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;