import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FloatingConnectionBridge = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="relative -mt-16 mb-16 overflow-hidden">
      {/* Main floating bridge structure */}
      <div className="relative h-32 flex items-center justify-center">
        {/* Animated geometric shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Central geometric core */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/30"
          >
            {/* Inner rotating elements */}
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-primary/40"
            >
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/30 to-transparent"
              />
            </motion.div>

            {/* Floating particles around the core */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, Math.cos((i * 45 * Math.PI) / 180) * 60, 0],
                  y: [0, Math.sin((i * 45 * Math.PI) / 180) * 60, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="absolute w-2 h-2 bg-primary/60 rounded-full blur-sm"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: "-4px",
                  marginTop: "-4px",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Connecting lines */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />

        {/* Side floating elements */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute left-8 top-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center"
          >
            <div className="w-6 h-6 rounded bg-primary/30" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute right-8 top-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{
              rotate: [0, -5, 5, 0],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center"
          >
            <div className="w-6 h-6 rounded bg-primary/30" />
          </motion.div>
        </motion.div>

        {/* Wave pattern overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute inset-0"
        >
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,50 Q100,20 200,50 T400,50"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-primary"
              animate={{
                d: [
                  "M0,50 Q100,20 200,50 T400,50",
                  "M0,50 Q100,80 200,50 T400,50",
                  "M0,50 Q100,20 200,50 T400,50",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Gradient transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50 pointer-events-none" />
    </div>
  );
};

export default FloatingConnectionBridge;