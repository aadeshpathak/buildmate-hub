import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/machines";
import { useNavigate } from "react-router-dom";

const CategoriesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const navigate = useNavigate();

  const getFilterForCategory = (categoryId: string) => {
    switch (categoryId) {
      case 'slcm':
        return 'SLCM';
      case 'crb':
      case 'irb':
      case 'ibp':
        return 'Batching Plants';
      case 'af':
        return 'Transit Mixers';
      case 'asp':
        return 'Concrete Pumps';
      default:
        return 'All';
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    const filter = getFilterForCategory(categoryId);
    navigate(`/?filter=${encodeURIComponent(filter)}`);
  };

  return (
    <section id="categories" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-yellow-400/10 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block text-sm font-bold text-primary uppercase tracking-widest px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            Browse by Category
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="heading-display text-4xl sm:text-5xl lg:text-6xl leading-tight"
          >
            Everything You Need to{" "}
            <span className="text-gradient font-black relative">
              Build
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-yellow-400 rounded-full"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6 font-light"
          >
            Discover our premium collection of construction equipment, from AJAX batching plants to transit mixers and concrete pumps.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                y: -12,
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              onClick={() => handleCategoryClick(cat.id)}
              className="glass-card p-8 cursor-pointer group hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 relative overflow-hidden"
            >
              {/* Premium background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-primary/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px]">
                <div className="w-full h-full bg-background rounded-lg" />
              </div>

              <div className="relative z-10">
                {/* Premium icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="text-5xl mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
                >
                  {cat.icon}
                </motion.div>

                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {cat.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gradient">{cat.count}</span>
                    <span className="text-sm font-medium text-muted-foreground">items</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View All
                    </span>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </motion.div>
                  </div>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
