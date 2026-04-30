import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import HeroScene from "./HeroScene";
import heroBg from "@/assets/hero-bg.jpg";
import { stats } from "@/data/machines";

// PREMIUM LOADER - Elegant Loading Experience
const PremiumPageLoader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    console.log('✨ PREMIUM LOADER: Starting...');

    // Force remove any existing loaders first
    const existing = document.getElementById('ultimate-loader');
    if (existing) {
      document.body.removeChild(existing);
    }

    // Create guaranteed visible premium loader
    const loader = document.createElement('div');
    loader.id = 'premium-loader';
    loader.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%) !important;
      z-index: 999999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      opacity: 1 !important;
      backdrop-filter: blur(8px) !important;
    `;

    // Create premium content
    loader.innerHTML = `
      <div style="
        text-align: center;
        color: white;
        max-width: 400px;
        padding: 2rem;
        position: relative;
        z-index: 1000000;
      ">
        <!-- Premium Dual Spinner -->
        <div style="
          position: relative;
          margin-bottom: 2.5rem;
          display: inline-block;
        ">
          <div style="
            width: 80px;
            height: 80px;
            border: 3px solid rgba(251, 191, 36, 0.3);
            border-radius: 50%;
            border-top-color: #fbbf24;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          "></div>
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 80px;
            height: 80px;
            border: 3px solid transparent;
            border-top-color: #f59e0b;
            border-radius: 50%;
            animation: spin-reverse 0.8s linear infinite;
          "></div>
          <div style="
            position: absolute;
            top: 16px;
            left: 16px;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3));
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          "></div>
        </div>

        <!-- Premium Typography -->
        <h2 style="
          font-size: 2.5rem;
          font-weight: 300;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
          color: white;
          animation: textFadeIn 0.6s ease-out 0.2s both;
        ">Initializing</h2>

        <!-- Progress Bar -->
        <div style="
          width: 240px;
          height: 4px;
          background: rgba(55, 65, 81, 0.5);
          border-radius: 2px;
          margin: 0 auto 1rem;
          overflow: hidden;
          animation: textFadeIn 0.6s ease-out 0.4s both;
        ">
          <div style="
            height: 100%;
            background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
            border-radius: 2px;
            animation: progressFill 4s ease-in-out 0.8s both;
          "></div>
        </div>

        <!-- Subtle Animated Elements -->
        <div style="
          position: absolute;
          top: 25%;
          left: 20%;
          width: 12px;
          height: 12px;
          background: rgba(251, 191, 36, 0.6);
          border-radius: 50%;
          filter: blur(2px);
          animation: float 3.5s ease-in-out infinite 0.5s;
        "></div>

        <div style="
          position: absolute;
          top: 30%;
          right: 25%;
          width: 8px;
          height: 8px;
          background: rgba(245, 158, 11, 0.5);
          border-radius: 50%;
          filter: blur(1px);
          animation: float 2.8s ease-in-out infinite 0.8s;
        "></div>

        <div style="
          position: absolute;
          bottom: 25%;
          left: 30%;
          width: 10px;
          height: 10px;
          background: rgba(251, 146, 60, 0.7);
          border-radius: 50%;
          filter: blur(1.5px);
          animation: float 4s ease-in-out infinite 1.1s;
        "></div>

        <!-- Progress Bar -->
        <div style="
          width: 240px;
          height: 4px;
          background: rgba(55, 65, 81, 0.5);
          border-radius: 2px;
          margin: 0 auto 2.5rem;
          overflow: hidden;
          animation: textFadeIn 0.6s ease-out 0.6s both;
        ">
          <div style="
            height: 100%;
            background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
            border-radius: 2px;
            animation: progressFill 4s ease-in-out 0.8s both;
          "></div>
        </div>

        <!-- Subtle Animated Elements -->
        <div style="
          position: absolute;
          top: 25%;
          left: 20%;
          width: 12px;
          height: 12px;
          background: rgba(251, 191, 36, 0.6);
          border-radius: 50%;
          filter: blur(2px);
          animation: float 3.5s ease-in-out infinite 0.5s;
        "></div>

        <div style="
          position: absolute;
          top: 30%;
          right: 25%;
          width: 8px;
          height: 8px;
          background: rgba(245, 158, 11, 0.5);
          border-radius: 50%;
          filter: blur(1px);
          animation: float 2.8s ease-in-out infinite 0.8s;
        "></div>

        <div style="
          position: absolute;
          bottom: 25%;
          left: 30%;
          width: 10px;
          height: 10px;
          background: rgba(251, 146, 60, 0.7);
          border-radius: 50%;
          filter: blur(1.5px);
          animation: float 4s ease-in-out infinite 1.1s;
        "></div>
      </div>
    `;

    // Add premium CSS animations
    const css = document.createElement('style');
    css.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes spin-reverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }

      @keyframes textFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes progressFill {
        from { width: 0%; }
        to { width: 100%; }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); opacity: 0.6; }
        50% { transform: translateY(-15px); opacity: 1; }
      }
    `;
    document.head.appendChild(css);

    // Force append and ensure visibility
    document.body.appendChild(loader);
    console.log('✨ PREMIUM LOADER: Elegant loader displayed');

    // Make absolutely sure it's visible
    loader.style.display = 'flex !important';
    loader.style.opacity = '1 !important';
    loader.style.visibility = 'visible !important';

    // Force a reflow
    loader.offsetHeight;

    // Timer for completion
    const timer = setTimeout(() => {
      console.log('✨ PREMIUM LOADER: Timer complete, fading out');
      loader.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(loader)) {
          document.body.removeChild(loader);
        }
        if (document.head.contains(css)) {
          document.head.removeChild(css);
        }
        console.log('✨ PREMIUM LOADER: Experience complete, navigating to dashboard');
        onComplete();
      }, 500);
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(loader)) {
        document.body.removeChild(loader);
      }
      if (document.head.contains(css)) {
        document.head.removeChild(css);
      }
    };
  }, [onComplete]);

  return null;
};

// Add custom shimmer animation
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { transform: translateX(-100%) skewX(-12deg); }
    100% { transform: translateX(200%) skewX(-12deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}

// Simplified Hero Animations - Less AI-generated feel
const heroAnimations = {
  // Hero content animations
  contentEnter: {
    opacity: 0,
    x: -60
  },
  contentAnimate: {
    opacity: 1,
    x: 0
  },

  // Stats animations
  statsEnter: (index: number) => ({
    opacity: 0,
    y: 20
  }),
  statsAnimate: {
    opacity: 1,
    y: 0
  },

  // Premium button animations
  buttonHover: {
    scale: 1.03,
    y: -2
  },
  buttonTap: {
    scale: 0.98,
    y: 0
  }
};

// Cinematic transitions - slower and more intentional
const heroTransitions = {
  content: {
    duration: 1.5,
    ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for cinematic feel
  },
  stats: (index: number) => ({
    duration: 1.2,
    delay: 0.8 + (index * 0.2),
    ease: [0.25, 0.46, 0.45, 0.94]
  }),
  button: {
    duration: 0.5,
    ease: [0.23, 1, 0.32, 1] // Custom easing for premium feel
  }
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }: { value: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const hasPlus = value.includes("+");

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        const rounded = Math.round(latest);
        setDisplayValue(hasPlus ? `${rounded}+` : rounded.toString());
      }
    });

    return controls.stop;
  }, [numericValue, duration, hasPlus]);

  return <span>{displayValue}</span>;
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  console.log('HeroSection render - isLoaderVisible:', isLoaderVisible);

  const handleLoaderComplete = useCallback(() => {
    console.log('handleLoaderComplete called');
    setIsLoaderVisible(false);
    console.log('setIsLoaderVisible(false) called');
    // Navigate immediately to prevent landing page flash
    console.log('Navigating directly to dashboard');
    navigate('/dashboard');
  }, [navigate]);

  const handleStartClick = useCallback(() => {
    console.log('handleStartClick called');
    setIsLoaderVisible(true);
    console.log('setIsLoaderVisible(true) called');
  }, []);

  return (
    <>
      {/* Premium Page Loader */}
      <AnimatePresence>
        {isLoaderVisible && (
          <PremiumPageLoader
            key="premium-loader"
            onComplete={handleLoaderComplete}
          />
        )}
      </AnimatePresence>

      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Clean background with subtle overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/75 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/10" />

        <HeroScene />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={heroAnimations.contentEnter}
            animate={heroAnimations.contentAnimate}
            transition={heroTransitions.content}
          >
            {/* Clean badge - no unnecessary animation */}
            <motion.div
              initial={heroAnimations.statsEnter(0)}
              animate={heroAnimations.statsAnimate}
              transition={heroTransitions.stats(0)}
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md mb-0 md:mb-12"
            >
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-sm font-semibold text-white">500+ Machines Ready to Deploy</span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-7xl lg:text-8xl leading-[0.92] mb-12 mt-8 md:mt-0 font-display font-bold tracking-tight"
              initial={heroAnimations.contentEnter}
              animate={heroAnimations.contentAnimate}
              transition={heroTransitions.content}
              style={{
                fontFeatureSettings: '"liga" 1, "calt" 1',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              <span className="block text-white drop-shadow-lg">Rent Heavy</span>
              <span className="block text-gradient bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                Machinery
              </span>
              <span className="block text-white drop-shadow-lg">On Demand</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl lg:text-2xl text-white/85 max-w-2xl mb-16 leading-relaxed font-sans font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{
                fontFeatureSettings: '"liga" 1, "calt" 1',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              India's most <span className="text-yellow-300 font-medium">premium construction equipment rental platform</span>.
              AJAX machinery, cranes, bulldozers & more — delivered to your site with just a few clicks.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-6 mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div
                whileHover={heroAnimations.buttonHover}
                whileTap={heroAnimations.buttonTap}
                transition={heroTransitions.button}
                className="inline-block"
              >
                {/* Button styling will be updated in next task */}
                <Button
                  size="lg"
                  onClick={handleStartClick}
                  className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-white font-bold text-xl px-12 h-16 rounded-2xl shadow-xl hover:shadow-amber-500/30 transition-all duration-700 group overflow-hidden"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-amber-300/30 to-orange-300/30 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" />

                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 blur-sm transition-all duration-700" />

                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 rounded-2xl bg-white/40 scale-0 group-active:scale-100 group-active:opacity-0 transition-all duration-300" />

                  <Zap className="mr-3 h-7 w-7 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 drop-shadow-lg" />
                  <span className="relative z-10 group-hover:scale-105 transition-all duration-500 drop-shadow-lg">Start</span>
                  <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 relative z-10 drop-shadow-lg" />

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.5s_ease-in-out] transition-opacity duration-700" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Premium Statistics Grid */}
            {/* Redesigned Statistics Grid */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            >
              {/* Mobile: 2x2 Grid */}
              <div className="block xl:hidden px-4">
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 1 + (i * 0.1),
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="group"
                    >
                      <div className="relative bg-gradient-to-br from-white/12 via-white/8 to-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/25 shadow-2xl hover:shadow-white/10 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 min-h-[120px] flex flex-col justify-center items-center text-center overflow-hidden">
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                        {/* Content */}
                        <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1">
                          <div className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                            <AnimatedCounter value={stat.value} />
                          </div>
                          <div className="text-xs text-white/80 group-hover:text-white/95 font-medium uppercase tracking-wider leading-tight max-w-full px-1 text-center">
                            {stat.label.split(' ').slice(0, 2).join(' ')}
                            {stat.label.split(' ').length > 2 && (
                              <><br />{stat.label.split(' ').slice(2).join(' ')}</>
                            )}
                          </div>
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-sm group-hover:blur-none transition-all duration-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Desktop: Horizontal Row */}
              <div className="hidden xl:block px-4">
                <div className="flex flex-row justify-center gap-12 max-w-6xl mx-auto">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 1 + (i * 0.1),
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="group"
                    >
                      <div className="relative bg-gradient-to-br from-white/12 via-white/8 to-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/25 shadow-2xl hover:shadow-white/10 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 min-h-[160px] min-w-[180px] flex flex-col justify-between items-center text-center overflow-hidden">
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                        {/* Content */}
                        <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1">
                          <div className="text-4xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                            <AnimatedCounter value={stat.value} />
                          </div>
                          <div className="text-sm text-white/80 group-hover:text-white/95 font-medium uppercase tracking-wider leading-tight max-w-full px-2 text-center">
                            {stat.label}
                          </div>
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-sm group-hover:blur-none transition-all duration-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block"
          />
        </div>
      </div>


      </section>
    </>
  );
};

export default HeroSection;
