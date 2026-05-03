import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import MachineCard from "./MachineCard";
import MachineCardSkeleton from "./MachineCardSkeleton";
import BookingModal from "./BookingModal";
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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

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

  // Reset carousel to beginning when filter changes
  useEffect(() => {
    if (carouselApi) {
      carouselApi.scrollTo(0);
    }
  }, [activeFilter, carouselApi]);

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

  const filtered = (() => {
    // First, filter by search and basic criteria
    const searchFiltered = machines.filter((m) => {
      const matchesSearch = search.trim() === "" || m.name.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && m.available;
    });

    // Then apply category filtering with limits
    if (activeFilter === "All") {
      // Group by category and take 5 from each
      const categoryGroups: { [key: string]: typeof searchFiltered } = {};
      searchFiltered.forEach(machine => {
        const category = machine.category || "Unknown";
        if (!categoryGroups[category]) {
          categoryGroups[category] = [];
        }
        categoryGroups[category].push(machine);
      });

      // Take 5 from each category
      const result: typeof searchFiltered = [];
      Object.values(categoryGroups).forEach(group => {
        result.push(...group.slice(0, 5));
      });
      return result;
    } else {
      // Filter by specific category and take only 5
      const categoryFiltered = searchFiltered.filter((m) => {
        const machineCategory = (m.category || "").toLowerCase().trim();
        if (activeFilter === "SLCM") {
          return machineCategory === "slcm mixers";
        } else if (activeFilter === "Batching Plants") {
          return machineCategory.includes("batching plants");
        } else if (activeFilter === "Transit Mixers") {
          return machineCategory === "transit mixers";
        } else if (activeFilter === "Concrete Pumps") {
          return machineCategory === "concrete pumps";
        }
        return false;
      });

      // Debug logging
      if (activeFilter !== "All") {
        console.log(`Category "${activeFilter}": ${categoryFiltered.length} machines found`);
      }

      return categoryFiltered.slice(0, 5);
    }
  })();

  // Debug: Log current filter and search
  console.log('Active filter:', activeFilter, 'Search:', search, 'Filtered count:', filtered.length);

  // Limit to 5 machines for carousel display
  const carouselMachines = filtered.slice(0, 5);

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
          <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <MachineCardSkeleton key={i} />
            ))}
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
            <div className="block md:hidden">
              {loading ? (
                <div className="flex gap-4 overflow-x-hidden">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[85%] sm:w-[75%]">
                      <div className="p-1">
                        <MachineCardSkeleton />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                    dragFree: false,
                    containScroll: "trimSnaps",
                  }}
                  setApi={setCarouselApi}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {carouselMachines.map((machine, i) => (
                      <CarouselItem key={machine.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-[75%] lg:basis-[60%]">
                        <div className="p-1">
                          <MachineCard machine={machine} index={i} onBook={setSelectedMachine} showBookButton={false} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {carouselMachines.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border shadow-lg h-10 w-10" />
                      <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border shadow-lg h-10 w-10" />
                    </>
                  )}
                </Carousel>
              )}
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
              {filtered.slice(0, 9).map((machine, i) => (
                <MachineCard key={machine.id} machine={machine} index={i} onBook={setSelectedMachine} />
              ))}
            </div>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-muted/20 to-muted/40 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-4xl"
                    >
                      🔍
                    </motion.div>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    No machines found
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    We couldn't find any equipment matching your search criteria.
                    Try adjusting your filters or search terms.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setActiveFilter("All");
                        setSearch("");
                        setLocalSearch("");
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Clear Filters
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch("");
                        setLocalSearch("");
                      }}
                      className="border-border hover:bg-accent"
                    >
                      Clear Search
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        <BookingModal machine={selectedMachine} onClose={() => setSelectedMachine(null)} />
      </div>
    </section>
  );
};

export default MachinesSection;
