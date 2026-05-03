import { motion } from "framer-motion";

const MachineCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden group cursor-pointer border border-primary/10 h-full"
    >
      {/* Image skeleton */}
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-64">
        <div className="w-full h-full bg-gradient-to-br from-muted/20 to-muted/40 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

        {/* Status badge skeleton */}
        <div className="absolute top-4 left-4">
          <div className="px-4 py-2 rounded-full bg-muted/60 animate-pulse">
            <div className="h-3 w-16 bg-muted-foreground/30 rounded"></div>
          </div>
        </div>

        {/* Like button skeleton */}
        <div className="absolute top-4 right-4 p-3 rounded-full glass-card border border-white/20">
          <div className="h-5 w-5 bg-muted-foreground/30 rounded animate-pulse"></div>
        </div>

        {/* Overlay text skeleton */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-white/20 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 flex flex-col h-full">
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-2 md:mb-3 lg:mb-4 xl:mb-5">
          <div className="h-6 w-3/4 bg-muted/60 rounded animate-pulse"></div>
          <div className="flex items-center gap-1 shrink-0">
            <div className="h-4 w-4 bg-muted/60 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-muted/60 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Location skeleton */}
        <div className="flex items-center gap-1 text-muted-foreground mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
          <div className="h-4 w-4 bg-muted/60 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-muted/60 rounded animate-pulse"></div>
        </div>

        {/* Specs skeleton */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4 mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-2 py-1 rounded-md bg-muted/40 animate-pulse">
              <div className="h-3 w-16 bg-muted-foreground/30 rounded"></div>
            </div>
          ))}
        </div>

        {/* Pricing section skeleton */}
        <div className="flex items-end justify-between pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-6 border-t border-primary/10 bg-gradient-to-r from-primary/5 to-transparent px-4 sm:px-6 md:px-5 lg:px-6 xl:px-6 pb-4 sm:pb-6 md:pb-5 lg:pb-6 xl:pb-6 mt-auto">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <div className="h-8 w-20 bg-gradient-to-r from-primary/20 to-yellow-500/20 rounded animate-pulse"></div>
              <div className="h-3 w-12 bg-muted/60 rounded animate-pulse"></div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="h-6 w-16 bg-primary/20 rounded animate-pulse"></div>
              <div className="h-3 w-12 bg-muted/60 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="h-12 w-24 bg-gradient-to-r from-primary/20 to-yellow-500/20 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default MachineCardSkeleton;