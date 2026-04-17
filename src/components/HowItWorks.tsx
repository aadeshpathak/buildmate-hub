import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, CalendarCheck, Truck, ThumbsUp } from "lucide-react";

const steps = [
  { icon: Search, title: "Browse", desc: "Explore our fleet of 500+ machines and equipment" },
  { icon: CalendarCheck, title: "Book", desc: "Select dates and get instant pricing & availability" },
  { icon: Truck, title: "Deliver", desc: "We deliver the machine right to your construction site" },
  { icon: ThumbsUp, title: "Build", desc: "Start your project with top-quality equipment" },
];

const HowItWorks = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="how-it-works" className="section-padding relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Simple Process</span>
          <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl mt-3">
            How It <span className="text-gradient">Works</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="neu-card w-20 h-20 mx-auto flex items-center justify-center mb-6 group-hover:glow transition-shadow">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center sm:left-1/2 sm:translate-x-6 sm:right-auto">
                {i + 1}
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
