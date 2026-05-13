import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Truck, Wrench, CreditCard, Shield, ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import type { Machine } from "@/data/machines";

interface Props {
  machine: Machine | null;
  onClose: () => void;
}

const BookingModal = ({ machine, onClose }: Props) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    deliveryMethod: "pickup" as "pickup" | "delivery",
    deliveryAddress: "",
    additionalServices: [] as string[],
    paymentMethod: "card" as "card" | "bank" | "cash",
    termsAccepted: false
  });

  if (!machine) return null;

  const duration = Math.max(1, selectedDates.length);

  const additionalServices = [
    { id: "operator", name: "Machine Operator", price: 1500, description: "Certified operator included" },
    { id: "maintenance", name: "Maintenance Package", price: 800, description: "Basic maintenance during rental" },
    { id: "insurance", name: "Extended Insurance", price: 500, description: "Additional coverage protection" },
    { id: "training", name: "Operator Training", price: 1000, description: "1-day training session" }
  ];

  const calculateTotal = () => {
    const baseTotal = machine.pricePerDay * duration;
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

  const saveBooking = () => {
    const saved = localStorage.getItem('buildmate_bookings');
    const bookings = saved ? JSON.parse(saved) : [];

    const newBooking = {
      id: Date.now().toString(),
      machineId: machine.id,
      days: duration,
      total: calculateTotal(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      duration: `${duration} days`,
      selectedDates: selectedDates.map(d => format(d, 'yyyy-MM-dd'))
    };

    bookings.push(newBooking);
    localStorage.setItem('buildmate_bookings', JSON.stringify(bookings));
  };

  const handleConfirm = () => {
    saveBooking();
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const steps = [
    { number: 1, title: "Booking Details", icon: CalendarDays },
    { number: 2, title: "Delivery Options", icon: Truck },
    { number: 3, title: "Additional Services", icon: Wrench },
    { number: 4, title: "Payment & Confirm", icon: CreditCard }
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDatesSummary = selectedDates.length > 0
    ? `${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''} selected`
    : 'Select dates';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative rounded-t-2xl sm:rounded-2xl"
        >
          <button onClick={onClose} className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>

          {/* Progress Steps */}
          <div className="p-3 sm:p-6 pr-12 sm:pr-14 border-b border-border/50">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: currentStep >= step.number ? 1 : 0.8 }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-base sm:text-xl font-bold text-gradient">
              {steps.find(s => s.number === currentStep)?.title}
            </h2>
          </div>

          <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(100vh-220px)] sm:max-h-[calc(90vh-200px)] modal-scroll">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-card rounded-xl sm:rounded-2xl">
                  <img src={machine.image} alt={machine.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm sm:text-base truncate">{machine.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{machine.location}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">For Dates</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="mt-2 w-full justify-start text-left font-normal bg-card/50 border-border/50"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {selectedDates.length > 0
                            ? `${format(selectedDates[0], "MMM d")}${selectedDates.length > 1 ? ` — ${format(selectedDates[selectedDates.length - 1], "MMM d")}` : ''}`
                            : "Select rental dates"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[calc(100vw-3rem)] sm:w-auto p-0" align="center" sideOffset={8}>
                        <Calendar
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={(dates) => setSelectedDates(dates || [])}
                          disabled={(date) => date < today}
                          initialFocus
                          className="w-full"
                          fromDate={today}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedDatesSummary} &middot; {
                        duration === 1 ? '1 day rental' : `${duration} day rental`
                      }
                    </p>
                  </div>

                  {selectedDates.length > 0 && (
                    <div className="p-3 glass-card rounded-2xl space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Selected dates:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, i) => (
                          <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {format(date, "d MMM")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 glass-card rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Daily Rate</span>
                    <span className="font-semibold">₹{machine.pricePerDay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{duration} day{duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="border-t border-border/50 pt-1.5 sm:pt-3 flex justify-between">
                    <span className="font-bold text-foreground text-sm sm:text-base">Subtotal</span>
                    <span className="font-bold text-primary text-sm sm:text-base">₹{(machine.pricePerDay * duration).toLocaleString()}</span>
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
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Delivery Method</h3>
                  <RadioGroup
                    value={bookingData.deliveryMethod}
                    onValueChange={(value) => setBookingData({...bookingData, deliveryMethod: value as "pickup" | "delivery"})}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 glass-card rounded-xl sm:rounded-2xl">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm sm:text-base">Self Pickup</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Pick up from {machine.location}</div>
                      </Label>
                      <div className="text-right">
                        <div className="font-semibold text-emerald-600 text-xs sm:text-sm">FREE</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 glass-card rounded-xl sm:rounded-2xl">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm sm:text-base">Home Delivery</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Delivered to your location</div>
                      </Label>
                      <div className="text-right">
                        <div className="font-semibold text-primary text-xs sm:text-sm">₹2,000</div>
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
                  <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Additional Services</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 glass-card rounded-xl sm:rounded-2xl">
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
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <div className="font-medium text-sm sm:text-base">{service.name}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">{service.description}</div>
                            </div>
                            <div className="font-semibold text-primary text-sm sm:text-base shrink-0">₹{service.price.toLocaleString()}</div>
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
                <div className="p-4 sm:p-6 glass-card rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
                  <h3 className="font-bold text-gradient text-sm sm:text-lg">Booking Summary</h3>

                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equipment ({duration} day{duration > 1 ? 's' : ''})</span>
                      <span>₹{(machine.pricePerDay * duration).toLocaleString()}</span>
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

                    <div className="border-t border-border/50 pt-2 sm:pt-3 flex justify-between font-bold">
                      <span className="text-foreground">Total Amount</span>
                      <span className="text-primary text-sm sm:text-lg">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label className="font-medium text-foreground text-sm sm:text-base">Payment Method</Label>
                    <RadioGroup
                      value={bookingData.paymentMethod}
                      onValueChange={(value) => setBookingData({...bookingData, paymentMethod: value as "card" | "bank" | "cash"})}
                      className="mt-2 sm:mt-3 space-y-2"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 glass-card rounded-lg sm:rounded-xl">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                          <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 glass-card rounded-lg sm:rounded-xl">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Bank Transfer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 glass-card rounded-lg sm:rounded-xl">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="cursor-pointer text-sm sm:text-base">Pay in Cash</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 glass-card rounded-lg sm:rounded-xl">
                    <Checkbox
                      id="terms"
                      checked={bookingData.termsAccepted}
                      onCheckedChange={(checked) => setBookingData({...bookingData, termsAccepted: !!checked})}
                    />
                    <Label htmlFor="terms" className="text-xs sm:text-sm cursor-pointer">
                      I agree to the <span className="text-primary underline">Terms & Conditions</span> and <span className="text-primary underline">Rental Agreement</span>
                    </Label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-6 border-t border-border/50 flex flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10">
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
            </div>

            <div className="flex flex-1 justify-end">
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 flex items-center justify-center gap-2 text-xs sm:text-sm px-4 sm:px-6 h-9 sm:h-10"
                  disabled={currentStep === 1 && selectedDates.length === 0}
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 flex items-center justify-center gap-2 text-xs sm:text-sm px-4 sm:px-6 h-9 sm:h-10"
                  disabled={!bookingData.termsAccepted}
                >
                  {bookingData.paymentMethod === 'cash' ? 'Confirm & Book' : 'Pay & Confirm'}
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-xl font-bold text-white"
                >
                  Booking Confirmed
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-sm text-muted-foreground mt-1"
                >
                  Your equipment has been booked successfully
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
