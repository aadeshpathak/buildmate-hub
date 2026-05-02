import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Phone, User, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CTASection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative">
            <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl mb-4">
              Ready to <span className="text-gradient">Build</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Get a custom quote for your construction project. Our team will help you choose the right equipment and deliver it to your site.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setQuoteModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-jcb-yellow-dark hover:text-jcb-black font-semibold text-base px-8 h-14 rounded-xl glow group"
              >
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => setContactModalOpen(true)}
                className="border-border text-foreground hover:bg-secondary font-semibold text-base px-8 h-14 rounded-xl"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quote Modal */}
        {quoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setQuoteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background border border-border rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Get Free Quote</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuoteModalOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Fill out the form below and we'll get back to you with a custom quote for your construction equipment needs.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="modal-name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="modal-name"
                    placeholder="Your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="modal-phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <Input
                    id="modal-phone"
                    placeholder="Your phone number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="modal-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="modal-email"
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="modal-message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="modal-message"
                    placeholder="Tell us about your project requirements..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setQuoteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement form submission
                    alert("Quote request submitted! We'll get back to you soon.");
                    setQuoteModalOpen(false);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-jcb-yellow-dark hover:text-jcb-black"
                >
                  Get Quote
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Contact Modal */}
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setContactModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background border border-border rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setContactModalOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Reach out to our experts for personalized construction equipment solutions.
              </p>
              <div className="text-center text-sm text-muted-foreground mb-4">
                Get in touch with our construction equipment experts
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Praveen Mani Tripathi</div>
                    <div className="text-sm text-muted-foreground">Sales Manager</div>
                    <a
                      href="tel:8887956464"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      +91 88879 56464
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Amit Shukla</div>
                    <div className="text-sm text-muted-foreground">Technical Manager</div>
                    <a
                      href="tel:8855995591"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      +91 88559 95591
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-xs text-muted-foreground">
                Available Monday to Saturday, 9 AM to 6 PM IST
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CTASection;
