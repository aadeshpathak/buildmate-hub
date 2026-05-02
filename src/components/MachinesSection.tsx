import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MachineCard from "./MachineCard";
import BookingModal from "./BookingModal";
import { useMobileCarousel } from "@/hooks/useCarousel";
import { useMachines } from "@/hooks/useMachines";
import { type Machine } from "@/data/machines";
import { useLocation } from "react-router-dom";

const filters = ["All", "SLCM", "Batching Plants", "Transit Mixers", "Concrete Pumps"];

const MachinesSection = () => {
  const location = useLocation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Get filter from URL params
  const urlParams = new URLSearchParams(location.search);
  const filterFromUrl = urlParams.get('filter');
  const initialFilter = filterFromUrl && filters.includes(filterFromUrl) ? filterFromUrl : "All";

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState(search);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const { machines, loading, error } = useMachines();

  // Debug: Log machines and their categories
  console.log('Loaded machines:', machines.length);
  const categoryCounts = {};
  machines.forEach(m => {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
  });
  console.log('Category counts:', categoryCounts);
  machines.slice(0, 5).forEach(m => console.log(`Machine: ${m.name}, Category: ${m.category}, Available: ${m.available}`));

  // Update local search when prop changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Update activeFilter when URL filter changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filterFromUrl = urlParams.get('filter');
    if (filterFromUrl && filters.includes(filterFromUrl)) {
      setActiveFilter(filterFromUrl);
    }
  }, [location.search]);

  // Scroll to section when filter is applied and machines are loaded
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filterFromUrl = urlParams.get('filter');
    if (filterFromUrl && filters.includes(filterFromUrl) && !loading && machines.length > 0) {
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        const element = document.getElementById('machines');
        if (element) {
          const yOffset = -20;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [activeFilter, loading, machines.length, location.search]);

  // Debounced search update - only update after user stops typing
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 1000); // Increased to 1000ms for better performance
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const filtered = machines.filter((m) => {
    // Search filtering (if search is empty, matchesSearch is true)
    const matchesSearch = search.trim() === "" || m.name.toLowerCase().includes(search.toLowerCase());

    // Category filtering
    let matchesFilter = false;
    const machineCategory = (m.category || "").toLowerCase().trim();

    if (activeFilter === "All") {
      matchesFilter = true;
    } else if (activeFilter === "SLCM") {
      matchesFilter = machineCategory === "slcm";
    } else if (activeFilter === "Batching Plants") {
      matchesFilter = machineCategory === "crb" || machineCategory === "irb" || machineCategory === "ibp";
    } else if (activeFilter === "Transit Mixers") {
      matchesFilter = machineCategory === "af";
    } else if (activeFilter === "Concrete Pumps") {
      matchesFilter = machineCategory === "asp";
    }

    // Debug logging
    if (activeFilter !== "All" && !matchesFilter) {
      console.log(`Machine ${m.name} category: "${m.category}" -> "${machineCategory}" does not match filter "${activeFilter}"`);
    }

    return matchesSearch && matchesFilter && m.available;
  });

  // Debug: Log current filter and search
  console.log('Active filter:', activeFilter, 'Search:', search, 'Filtered count:', filtered.length);

  const carousel = useMobileCarousel(filtered.length);

  return (
    <section id="machines" className="section-padding relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Fleet</span>
          <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl mt-3">
            Featured <span className="text-gradient">Machines</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search machines..."
              value={localSearch}
              onChange={(e) => {
                e.preventDefault();
                handleSearchChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Submit immediately on Enter
                  if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                  }
                  setSearch(localSearch);
                }
              }}
              className="pl-10 bg-secondary border-border h-12"
            />
          </div>
          <Button variant="outline" className="h-12 border-border">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setSearch(""); // Clear search when changing filters
                setLocalSearch(""); // Clear local search as well
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading machines...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-destructive">
            <p>Failed to load machines. Please try again later.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Mobile Carousel */}
            <div className="block md:hidden relative">
              <div
                ref={carousel.containerRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
                style={{ scrollBehavior: 'smooth' }}
              >
                {filtered.slice(0, 5).map((machine, i) => (
                  <div key={machine.id} className="flex-none w-80 snap-center">
                    <MachineCard machine={machine} index={i} onBook={setSelectedMachine} />
                  </div>
                ))}
              </div>

              {/* Carousel Navigation */}
              {filtered.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border shadow-lg h-10 w-10"
                    onClick={carousel.goToPrev}
                    disabled={!carousel.canGoPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border shadow-lg h-10 w-10"
                    onClick={carousel.goToNext}
                    disabled={!carousel.canGoNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Dots Indicator */}
                  <div className="flex justify-center gap-2 mt-4">
                    {filtered.map((_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === carousel.activeIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                        onClick={() => carousel.scrollToIndex(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
              {filtered.slice(0, 9).map((machine, i) => (
                <MachineCard key={machine.id} machine={machine} index={i} onBook={setSelectedMachine} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                No machines found matching your search.
              </div>
            )}
          </>
        )}

        <BookingModal machine={selectedMachine} onClose={() => setSelectedMachine(null)} />
      </div>
    </section>
  );
};

export default MachinesSection;
