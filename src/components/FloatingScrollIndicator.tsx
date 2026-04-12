import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FloatingScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 sm:gap-6">
      {/* Premium floating orb with enhanced effects */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.08, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative group cursor-pointer"
      >
        {/* Multi-layer glow rings */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-radial from-primary/30 via-primary/10 to-transparent blur-xl"
        />

        <motion.div
          animate={{
            scale: [1.1, 1.4, 1.1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute inset-0 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-radial from-yellow-400/40 via-orange-400/20 to-transparent blur-lg"
        />

        {/* Main premium orb */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary via-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl border-2 border-white/20 backdrop-blur-xl glow-primary touch-manipulation"
        >
          {/* Inner rotating elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border border-white/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-white/20"
          />

          {/* Icon with premium styling */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <ChevronDown className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Interactive ripple effect */}
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 2, 3], opacity: [1, 0.5, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full border-2 border-primary/40"
        />
      </motion.div>

      {/* Enhanced floating particles */}
      <div className="relative w-32 sm:w-40 h-8 sm:h-10">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i * 0.5) * 12, 0],
              opacity: [0, 1, 0],
              scale: [0.3, 1.2, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-primary to-yellow-400 blur-sm shadow-lg"
            style={{
              left: `${15 + i * 10}%`,
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
            }}
          />
        ))}
      </div>

      {/* Premium text hint */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-xs text-primary/80 font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent"
      >
        Discover More
      </motion.div>
    </div>
  );
};

export default FloatingScrollIndicator;