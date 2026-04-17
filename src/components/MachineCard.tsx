import { motion } from "framer-motion";
import { Star, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Machine } from "@/data/machines";
import { useState } from "react";

interface Props {
  machine: Machine;
  index: number;
  onBook: (machine: Machine) => void;
}

const MachineCard = ({ machine, index, onBook }: Props) => {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="glass-card overflow-hidden group cursor-pointer border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 h-full"
    >
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-64 group">
        {/* Premium image with enhanced effects */}
        <motion.img
          src={machine.image}
          alt={machine.name}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
        />

        {/* Multi-layer overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Premium shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Enhanced status badge */}
        <div className="absolute top-4 left-4">
          {machine.available ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white text-xs font-bold shadow-lg border border-white/20 backdrop-blur-sm"
            >
              ✓ Available Now
            </motion.span>
          ) : (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/90 to-red-600/90 text-white text-xs font-bold shadow-lg border border-white/20 backdrop-blur-sm"
            >
              ⏳ Currently Booked
            </motion.span>
          )}
        </div>

        {/* Premium like button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 p-3 rounded-full glass-card border border-white/20 shadow-xl hover:shadow-primary/20 transition-all duration-300"
        >
          <Heart className={`h-5 w-5 transition-all duration-300 ${
            liked
              ? "fill-red-500 text-red-500 drop-shadow-lg"
              : "text-white/80 hover:text-white"
          }`} />
        </motion.button>

        {/* Premium overlay text */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg drop-shadow-lg">
              {machine.name.split(' ')[0]}
            </span>
            <span className="text-white/90 text-sm font-medium drop-shadow-md">
              {machine.category}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 flex flex-col h-full">
        <div className="flex items-start justify-between mb-2 md:mb-3 lg:mb-4 xl:mb-5">
          <h3 className="font-semibold text-foreground text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight flex-1 pr-2">{machine.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 fill-primary text-primary" />
            <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium text-foreground">{machine.rating}</span>
            <span className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg text-muted-foreground">({machine.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
          <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">{machine.location}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4 mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
          {Object.entries(machine.specs).slice(0, 3).map(([key, val]) => (
            <span key={key} className="px-1.5 sm:px-2 md:px-3 lg:px-4 xl:px-5 py-0.5 sm:py-1 md:py-1.5 lg:py-2 xl:py-2.5 rounded-md bg-secondary text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg text-secondary-foreground">
              {key}: {val}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-6 border-t border-primary/10 bg-gradient-to-r from-primary/5 to-transparent px-4 sm:px-6 md:px-5 lg:px-6 xl:px-6 pb-4 sm:pb-6 md:pb-5 lg:pb-6 xl:pb-6 mt-auto">
          <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5 lg:space-y-2 xl:space-y-2">
                <div className="flex items-baseline gap-1 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-black text-gradient">₹{machine.pricePerHour.toLocaleString()}</span>
                  <span className="text-xs sm:text-sm md:text-sm lg:text-xs xl:text-xs text-muted-foreground font-medium">per hour</span>
                </div>
                <div className="flex items-baseline gap-1 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2">
                  <span className="text-sm sm:text-lg md:text-xl lg:text-xl xl:text-xl font-bold text-primary/80">₹{machine.pricePerDay.toLocaleString()}</span>
                  <span className="text-xs sm:text-sm md:text-sm lg:text-xs xl:text-xs text-muted-foreground">per day</span>
                </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              disabled={!machine.available}
              onClick={() => onBook(machine)}
              className={`font-bold px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 py-2 sm:py-3 md:py-3 lg:py-2 xl:py-3 rounded-xl transition-all duration-300 shadow-lg text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl ${
                machine.available
                  ? 'bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-white glow-primary hover:shadow-primary/25'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {machine.available ? 'Book Now' : 'Unavailable'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MachineCard;
