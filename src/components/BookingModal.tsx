import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, CheckCircle2, Truck, Wrench, CreditCard, Shield, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Machine } from "@/data/machines";

interface Props {
  machine: Machine | null;
  onClose: () => void;
}

const BookingModal = ({ machine, onClose }: Props) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    duration: 1,
    deliveryMethod: "pickup" as "pickup" | "delivery",
    deliveryAddress: "",
    additionalServices: [] as string[],
    paymentMethod: "card" as "card" | "bank" | "cash",
    termsAccepted: false
  });

  if (!machine) return null;

  const additionalServices = [
    { id: "operator", name: "Machine Operator", price: 1500, description: "Certified operator included" },
    { id: "maintenance", name: "Maintenance Package", price: 800, description: "Basic maintenance during rental" },
    { id: "insurance", name: "Extended Insurance", price: 500, description: "Additional coverage protection" },
    { id: "training", name: "Operator Training", price: 1000, description: "1-day training session" }
  ];

  const calculateTotal = () => {
    const baseTotal = machine.pricePerDay * bookingData.duration;
    const servicesTotal = bookingData.additionalServices.reduce((total, serviceId) => {
      const service = additionalServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    const deliveryFee = bookingData.deliveryMethod === "delivery" ? 2000 : 0;
    return baseTotal + servicesTotal + deliveryFee;
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4);
  };

  const handleConfirm = () => {
    setCurrentStep(4);
    setTimeout(() => {
      onClose();
    }, 4000);
  };

  const steps = [
    { number: 1, title: "Booking Details", icon: Calendar },
    { number: 2, title: "Delivery Options", icon: Truck },
    { number: 3, title: "Additional Services", icon: Wrench },
    { number: 4, title: "Payment & Confirm", icon: CreditCard }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10">
            <X className="h-6 w-6" />
          </button>

          {/* Progress Steps */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: currentStep >= step.number ? 1 : 0.8 }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold text-gradient">
              {steps.find(s => s.number === currentStep)?.title}
            </h2>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-280px)] sm:max-h-[calc(90vh-200px)]">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
                  <img src={machine.image} alt={machine.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-foreground">{machine.name}</h3>
                    <p className="text-sm text-muted-foreground">{machine.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                    <Input
                      type="date"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                      className="mt-2 bg-card/50 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Duration (Days)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({...bookingData, duration: Math.max(1, parseInt(e.target.value) || 1)})}
                      className="mt-2 bg-card/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="p-3 sm:p-4 glass-card rounded-2xl space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Daily Rate</span>
                    <span className="font-semibold">₹{machine.pricePerDay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{bookingData.duration} days</span>
                  </div>
                  <div className="border-t border-border/50 pt-2 sm:pt-3 flex justify-between">
                    <span className="font-bold text-foreground text-sm sm:text-base">Subtotal</span>
                    <span className="font-bold text-primary text-sm sm:text-base">₹{(machine.pricePerDay * bookingData.duration).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Delivery Method</h3>
                  <RadioGroup
                    value={bookingData.deliveryMethod}
                    onValueChange={(value) => setBookingData({...bookingData, deliveryMethod: value as "pickup" | "delivery"})}
                  >
                    <div className="flex items-center space-x-3 p-4 glass-card rounded-2xl">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-medium">Self Pickup</div>
                        <div className="text-sm text-muted-foreground">Pick up from {machine.location}</div>
                      </Label>
                      <div className="text-right">
                        <div className="font-semibold text-emerald-600">FREE</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 glass-card rounded-2xl">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="font-medium">Home Delivery</div>
                        <div className="text-sm text-muted-foreground">Delivered to your location</div>
                      </Label>
                      <div className="text-right">
                        <div className="font-semibold text-primary">₹2,000</div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {bookingData.deliveryMethod === "delivery" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <Label className="font-medium text-foreground">Delivery Address</Label>
                    <Input
                      placeholder="Enter complete delivery address"
                      value={bookingData.deliveryAddress}
                      onChange={(e) => setBookingData({...bookingData, deliveryAddress: e.target.value})}
                      className="bg-card/50 border-border/50"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Additional Services</h3>
                  <div className="space-y-3">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="flex items-center space-x-3 p-4 glass-card rounded-2xl">
                        <Checkbox
                          id={service.id}
                          checked={bookingData.additionalServices.includes(service.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBookingData({
                                ...bookingData,
                                additionalServices: [...bookingData.additionalServices, service.id]
                              });
                            } else {
                              setBookingData({
                                ...bookingData,
                                additionalServices: bookingData.additionalServices.filter(id => id !== service.id)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-muted-foreground">{service.description}</div>
                            </div>
                            <div className="font-semibold text-primary">₹{service.price.toLocaleString()}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="p-6 glass-card rounded-2xl space-y-4">
                  <h3 className="font-bold text-gradient text-lg">Booking Summary</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equipment ({bookingData.duration} days)</span>
                      <span>₹{(machine.pricePerDay * bookingData.duration).toLocaleString()}</span>
                    </div>

                    {bookingData.deliveryMethod === "delivery" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span>₹2,000</span>
                      </div>
                    )}

                    {bookingData.additionalServices.map(serviceId => {
                      const service = additionalServices.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between">
                          <span className="text-muted-foreground">{service.name}</span>
                          <span>₹{service.price.toLocaleString()}</span>
                        </div>
                      ) : null;
                    })}

                    <div className="border-t border-border/50 pt-3 flex justify-between font-bold">
                      <span className="text-foreground">Total Amount</span>
                      <span className="text-primary text-lg">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium text-foreground">Payment Method</Label>
                    <RadioGroup
                      value={bookingData.paymentMethod}
                      onValueChange={(value) => setBookingData({...bookingData, paymentMethod: value as "card" | "bank" | "cash"})}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-3 p-3 glass-card rounded-xl">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="w-4 h-4" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 glass-card rounded-xl">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="w-4 h-4" />
                          Bank Transfer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 glass-card rounded-xl">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="cursor-pointer">Cash on Delivery</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-3 p-4 glass-card rounded-xl">
                    <Checkbox
                      id="terms"
                      checked={bookingData.termsAccepted}
                      onCheckedChange={(checked) => setBookingData({...bookingData, termsAccepted: !!checked})}
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the <span className="text-primary underline">Terms & Conditions</span> and <span className="text-primary underline">Rental Agreement</span>
                    </Label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex w-full sm:w-auto">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex w-full sm:w-auto sm:flex-1 sm:justify-end">
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 flex items-center justify-center gap-2 w-full sm:w-auto"
                  disabled={currentStep === 1 && !bookingData.startDate}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 flex items-center justify-center gap-2 w-full sm:w-auto"
                  disabled={!bookingData.termsAccepted}
                >
                  Confirm Booking
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
