import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HeroScene from "./HeroScene";
import heroBg from "@/assets/hero-bg.jpg";
import { stats } from "@/data/machines";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    // Add a smooth transition effect before navigation
    const transition = document.createElement('div');
    transition.className = 'fixed inset-0 bg-gradient-to-r from-primary to-yellow-500 z-50 flex items-center justify-center';
    transition.innerHTML = `
      <div class="text-center text-white">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
        <h2 class="text-2xl font-bold">Starting Your Journey...</h2>
      </div>
    `;
    document.body.appendChild(transition);

    setTimeout(() => {
      navigate('/dashboard');
      document.body.removeChild(transition);
    }, 1500);
  };

  return (
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
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Premium glass morphism badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg" />
              <span className="text-sm font-semibold text-white drop-shadow-lg">500+ Machines Ready to Deploy</span>
            </motion.div>

            <motion.h1
              className="heading-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] mb-8 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="block text-white drop-shadow-2xl">Rent Heavy</span>
              <span className="block text-gradient font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
                Machinery
              </span>
              <span className="block text-white drop-shadow-2xl">On Demand</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed font-light drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              India's most <span className="text-yellow-300 font-semibold">premium construction equipment rental platform</span>.
              AJAX machinery, cranes, bulldozers & more — delivered to your site with just a few clicks.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={handleStartClick}
                  className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold text-xl px-12 h-16 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 group backdrop-blur-sm border border-white/20"
                >
                  <Zap className="mr-3 h-7 w-7 group-hover:animate-pulse" />
                  <span className="relative z-10">Start</span>
                  <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Premium statistics with proper text containment */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 1.2 + i * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="group relative"
                >
                  <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-xl min-h-[110px] sm:min-h-[130px] flex flex-col justify-center items-center text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white mb-1 sm:mb-2 drop-shadow-lg leading-tight text-center">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-white/80 font-medium uppercase tracking-wide leading-tight text-center">
                      {stat.label === 'Projects Completed' ? 'Projects\nDone' :
                       stat.label === 'Happy Clients' ? 'Happy\nClients' :
                       stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
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

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
