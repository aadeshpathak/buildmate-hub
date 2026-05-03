import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, CalendarCheck, Truck, ThumbsUp, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    desc: "Explore our premium fleet of construction machinery with detailed specifications and real-time availability",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500"
  },
  {
    icon: CalendarCheck,
    title: "Reserve",
    desc: "Book your equipment instantly with flexible dates, competitive pricing, and instant confirmation",
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-500"
  },
  {
    icon: Truck,
    title: "Deliver",
    desc: "Professional delivery and setup at your construction site with trained technicians",
    color: "from-orange-500/20 to-yellow-500/20",
    iconColor: "text-orange-500"
  },
  {
    icon: ThumbsUp,
    title: "Execute",
    desc: "Power your project with top-quality equipment backed by 24/7 support and maintenance",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500"
  },
];

const HowItWorks = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Connecting Lines Background */}
      <div className="absolute inset-0 hidden lg:block">
        <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
              <stop offset="50%" stopColor="hsl(var(--primary) / 0.3)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M200 300 L400 300 L400 300"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <motion.path
            d="M500 300 L700 300 L700 300"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
          <motion.path
            d="M800 300 L1000 300 L1000 300"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >

          <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl mt-6 mb-6">
            How It <span className="text-gradient relative">
              Works
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-full"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Experience the future of construction equipment rental with our seamless 4-step process designed for efficiency and excellence
          </motion.p>
        </motion.div>

        {/* Premium Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.2 + 0.6,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="relative group"
            >
              {/* Step Number Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={inView ? { scale: 1, rotate: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.2 + 0.8,
                  type: "spring",
                  stiffness: 200
                }}
                className="absolute -top-4 -right-4 z-20 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-yellow-500 text-white text-lg font-bold flex items-center justify-center shadow-2xl border-4 border-background"
              >
                {i + 1}
              </motion.div>

              {/* Main Card */}
              <motion.div
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="glass-strong rounded-2xl p-8 h-full border border-primary/10 hover:border-primary/30 transition-all duration-500 relative overflow-hidden group/card"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 mx-auto mb-8 rounded-2xl glass-card border border-primary/20 flex items-center justify-center group/icon"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                      }}
                    >
                      <step.icon className={`h-10 w-10 ${step.iconColor} drop-shadow-lg`} />
                    </motion.div>

                    {/* Icon Glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover/icon:opacity-50 transition-opacity duration-300 blur-md`} />
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="font-bold text-foreground text-xl mb-4 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-muted-foreground text-center leading-relaxed"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.desc}
                  </motion.p>
                </div>

                {/* Connecting Arrow (hidden on mobile) */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.2 + 1.2 }}
                    className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10"
                  >
                    <motion.div
                      animate={{
                        x: [0, 5, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3
                      }}
                      className="w-12 h-12 rounded-full glass-card border border-primary/20 flex items-center justify-center"
                    >
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {/* Bottom Glow */}
              <div className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl blur-lg" />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass-strong border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group"
          >
            <span className="font-semibold text-foreground">Ready to get started?</span>
            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
