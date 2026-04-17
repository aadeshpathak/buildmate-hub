import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PremiumSearchBarProps {
  initialSearch?: string;
  onSearchSubmit: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: string[];
  isMobile?: boolean;
}

const PremiumSearchBar = ({
  initialSearch = "",
  onSearchSubmit,
  activeFilter,
  onFilterChange,
  filters,
  isMobile = false
}: PremiumSearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(initialSearch);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local search when initialSearch prop changes
  useEffect(() => {
    setLocalSearch(initialSearch);
  }, [initialSearch]);

  // Handle search input changes - only update local state, submit on Enter or long delay
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set timeout for auto-submit after user stops typing (2 seconds)
    searchTimeoutRef.current = setTimeout(() => {
      onSearchSubmit(value);
    }, 2000);
  }, [onSearchSubmit]);

  // Handle explicit search submission (Enter key)
  const handleSearchSubmit = useCallback((value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onSearchSubmit(value);
  }, [onSearchSubmit]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle form submission - submit search
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSearchSubmit(localSearch);
  }, [localSearch, handleSearchSubmit]);

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Premium Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <form onSubmit={handleFormSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              key="mobile-search"
              type="text"
              placeholder="Search premium equipment..."
              value={localSearch}
              onChange={(e) => {
                e.preventDefault();
                handleSearchChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchSubmit(localSearch);
                }
              }}
              className="pl-12 pr-12 h-14 bg-card/50 backdrop-blur-xl border-border/50 rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-accent/20"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </form>
        </motion.div>

        {/* Swipeable Filter Categories */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map((filter, index) => (
                  <motion.button
                    key={filter}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onFilterChange(filter);
                      setShowFilters(false);
                    }}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap hover-3d click-3d ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-card/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-card/80 hover:text-foreground'
                }`}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filter Indicator */}
        {activeFilter !== "All" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {activeFilter}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onFilterChange("All");
                }}
                className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </motion.div>
        )}
      </div>
    );
  }

  // Desktop Version
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      {/* Premium Search Input */}
      <form onSubmit={handleFormSubmit} className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          key="desktop-search"
          type="text"
          placeholder="Search premium construction equipment..."
          value={localSearch}
          onChange={(e) => {
            e.preventDefault();
            handleSearchChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearchSubmit(localSearch);
            }
          }}
          className="pl-12 h-14 bg-card/50 backdrop-blur-xl border-border/50 rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </form>

      {/* Filter Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter, index) => (
          <motion.button
            key={filter}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFilterChange(filter);
            }}
            className={`flex-shrink-0 px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap hover-3d click-3d ${
              activeFilter === filter
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-card/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-card/80 hover:text-foreground'
            }`}
          >
            {filter}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default memo(PremiumSearchBar);