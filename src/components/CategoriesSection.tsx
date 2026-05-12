import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categories } from '@/data/machines';

gsap.registerPlugin(ScrollTrigger);

const getFilterForCategory = (categoryId: string) => {
  switch (categoryId) {
    case 'slcm': return 'SLCM';
    case 'crb':
    case 'irb':
    case 'ibp': return 'Batching Plants';
    case 'af': return 'Transit Mixers';
    case 'asp': return 'Concrete Pumps';
    default: return 'All';
  }
};

const CategoriesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const heading = section.querySelector('.categories-heading') as HTMLElement;
    const cards = section.querySelectorAll('.category-card') as NodeListOf<HTMLElement>;
    if (!heading || !cards.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([heading, ...cards], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${window.innerHeight * 1.5}`,
          scrub: true,
        }
      });

      tl.fromTo(heading,
        { opacity: 1, y: 25 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );

      cards.forEach((card) => {
        tl.fromTo(card,
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' },
          '>-=0.01'
        );
      });

      tl.to({}, { duration: 0.8 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="relative bg-background"
      style={{ height: 'calc(100vh * 2.5)' }}
    >
      <div className="sticky top-0 h-screen flex items-start justify-center pt-8 md:pt-20 overflow-hidden sm:overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-yellow-400/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 w-full px-4 pb-4 md:pb-6">
          <div className="categories-heading text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Sparkles className="w-4 h-4" />
              Browse by Category
            </div>
            <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Everything You Need to{' '}
              <span className="text-gradient font-black">
                Build
              </span>
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
              Discover our premium collection of construction equipment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card glass-card rounded-xl p-3 md:p-4 group relative overflow-hidden cursor-pointer"
                onClick={() => {
                  const filter = getFilterForCategory(category.id);
                  window.location.href = `/?filter=${encodeURIComponent(filter)}`;
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 rounded-xl transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="text-3xl md:text-5xl mb-2 w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xs md:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300 font-display truncate w-full">
                    {category.name}
                  </h3>
                  <p className="text-[11px] md:text-sm text-muted-foreground mb-1 leading-relaxed line-clamp-1">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 pt-1 border-t border-primary/10 w-full justify-center">
                    <span className="text-sm md:text-xl font-black text-gradient">{category.count}</span>
                    <span className="text-[11px] md:text-sm text-muted-foreground">items</span>
                  </div>
                  <span className="mt-1 text-[11px] md:text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    View All
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                  </span>
                </div>

                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
