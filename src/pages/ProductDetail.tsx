import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, MapPin, Phone, MessageCircle, Calendar, Clock,
  CheckCircle, Heart, Share, Download, ChevronLeft, ChevronRight,
  Zap, Shield, Users, Award, Truck, Wrench, Settings, Gauge,
  Thermometer, Fuel, Battery, Activity, Target, Eye, ShoppingCart,
  Plus, Minus, Send, Camera, Video, Mic, Image, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMachines } from "@/hooks/useMachines";
import { type Machine } from "@/data/machines";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'booking'>('overview');

  const { machines: machineData, loading } = useMachines();
  const machine = machineData.find(m => m.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-gradient mb-4">Loading Equipment Details</h1>
          <p className="text-muted-foreground">Please wait while we fetch the premium equipment information...</p>
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-3xl flex items-center justify-center mb-6 mx-auto">
            <Target className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-4">Premium Equipment Not Found</h1>
          <p className="text-muted-foreground mb-8">The premium equipment you're looking for doesn't exist or may have been removed.</p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-3 rounded-2xl shadow-lg shadow-primary/25"
          >
            Back to Premium Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const images = [
    machine.image,
    // Add more placeholder images if needed
    machine.image,
    machine.image,
    machine.image
  ];

  const specs = Object.entries(machine.specs);
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "Warranty Included", desc: "Comprehensive coverage" },
    { icon: <Users className="w-5 h-5" />, title: "Expert Operators", desc: "Certified professionals" },
    { icon: <Truck className="w-5 h-5" />, title: "Fast Delivery", desc: "Same-day delivery available" },
    { icon: <Award className="w-5 h-5" />, title: "Premium Quality", desc: "AJAX certified equipment" }
  ];

  const reviews = [
    { id: 1, name: "Rajesh Kumar", rating: 5, comment: "Excellent equipment, very well maintained. Highly recommended!", date: "2026-03-15", avatar: "RK" },
    { id: 2, name: "Priya Sharma", rating: 5, comment: "Great service and professional operators. Will definitely rent again.", date: "2026-03-10", avatar: "PS" },
    { id: 3, name: "Amit Patel", rating: 4, comment: "Good quality equipment. Minor delays in delivery but overall satisfied.", date: "2026-03-05", avatar: "AP" }
  ];

  const totalPrice = machine.pricePerDay * rentalDays;
  const discount = rentalDays >= 7 ? totalPrice * 0.1 : 0;
  const finalPrice = totalPrice - discount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      {/* Premium Header */}
      <motion.div
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
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
                <h1 className="text-xl font-bold text-gradient">{machine.name.split(' ')[0]}...</h1>
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
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={machine.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-emerald-500/90 text-white border-0 px-4 py-2 text-sm font-semibold">
                    ✓ Available Now
                  </Badge>
                </div>

                {/* Navigation */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === selectedImage ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
                      className="p-3 bg-black/50 backdrop-blur-sm rounded-2xl text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                      className="p-3 bg-black/50 backdrop-blur-sm rounded-2xl text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    index === selectedImage
                      ? 'border-emerald-400 shadow-lg shadow-emerald-400/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`${machine.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1">
                  {machine.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-muted-foreground text-sm">{machine.rating}</span>
                  <span className="text-muted-foreground/70 text-sm">({machine.reviews} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gradient mb-4 leading-tight">
                {machine.name}
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {machine.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-black text-white mb-1">₹{machine.pricePerDay.toLocaleString()}</div>
                  <div className="text-white/60 text-sm">per day</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-emerald-400">₹{machine.pricePerHour.toLocaleString()}</div>
                  <div className="text-white/60 text-sm">per hour</div>
                </div>
              </div>

              {/* Rental Duration */}
              <div className="mb-6">
                <label className="block text-white/80 font-medium mb-3">Rental Duration</label>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                    className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>

                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-white">{rentalDays}</div>
                    <div className="text-white/60 text-sm">days</div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRentalDays(rentalDays + 1)}
                    className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pt-6 border-t border-white/10">
                <div className="flex justify-between text-white/80">
                  <span>Daily Rate × {rentalDays} days</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Weekly Discount (10%)</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/20">
                  <span>Total Amount</span>
                  <span>₹{finalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Book Equipment
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-4 rounded-2xl">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contact Owner
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Why Choose This Equipment?</h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-3`}>
                      {feature.icon}
                    </div>
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-white/60 text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          {/* Tab Navigation */}
          <div className="flex gap-1 bg-white/5 rounded-2xl p-1 backdrop-blur-xl border border-white/10 mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
              { id: 'specs', label: 'Specifications', icon: <Settings className="w-4 h-4" /> },
              { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
              { id: 'booking', label: 'Booking Info', icon: <Calendar className="w-4 h-4" /> }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Equipment Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Key Features</h4>
                    <ul className="space-y-3">
                      {specs.slice(0, 4).map(([key, value]) => (
                        <li key={key} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-white/80"><strong className="text-white">{key}:</strong> {value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Location & Availability</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                        <span className="text-white/80">{machine.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        <span className="text-white/80">Available 24/7</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-emerald-400" />
                        <span className="text-white/80">Free delivery within 50km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {specs.map(([key, value]) => (
                    <div key={key} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-white font-semibold">{key}</h4>
                      </div>
                      <p className="text-white/80 text-lg font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Customer Reviews</h3>
                    <p className="text-white/60">{reviews.length} reviews • {machine.rating} average rating</p>
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2">
                    Write Review
                  </Button>
                </div>

                <div className="grid gap-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">{review.name}</h4>
                            <span className="text-white/60 text-sm">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                              />
                            ))}
                          </div>
                          <p className="text-white/80 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'booking' && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Booking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Rental Terms</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-white/80">Minimum 1 day rental</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-white/80">10% discount for 7+ days</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-white/80">Free delivery within 50km</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-white/80">24/7 customer support</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Safety & Insurance</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-emerald-400" />
                          <span className="text-white/80">Comprehensive insurance included</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-emerald-400" />
                          <span className="text-white/80">Regular maintenance & inspection</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-emerald-400" />
                          <span className="text-white/80">Certified operators only</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <Phone className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Phone</p>
                            <p className="text-white">+91 98765 43210</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">WhatsApp</p>
                            <p className="text-white">+91 98765 43210</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Location</p>
                            <p className="text-white">{machine.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;