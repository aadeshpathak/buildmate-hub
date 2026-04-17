import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

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
                className="bg-primary text-primary-foreground hover:bg-jcb-yellow-dark font-semibold text-base px-8 h-14 rounded-xl glow group"
              >
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary font-semibold text-base px-8 h-14 rounded-xl"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
