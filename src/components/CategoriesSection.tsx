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

    const isMobile = window.innerWidth < 640;

    const heading = section.querySelector('.categories-heading') as HTMLElement;
    if (!heading) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(heading, { opacity: 1, y: 0 });
        gsap.set(section.querySelectorAll('.category-card, .category-card-mobile'), { opacity: 1, y: 0, scale: 1 });
        return;
      }

      if (isMobile) {
        const mobileCards = section.querySelectorAll('.category-card-mobile') as NodeListOf<HTMLElement>;
        if (!mobileCards.length) return;

        gsap.set(mobileCards, { opacity: 0, x: 0, y: 0, scale: 1 });
        gsap.set(heading, { opacity: 0, y: 20 });

        const patterns = [
          { enter: { scale: 0, opacity: 0 }, in: { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, exit: { scale: 0.9, y: -80, opacity: 0, duration: 0.25, ease: 'power2.in' } },
          { enter: { y: -60, opacity: 0 }, in: { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, exit: { x: 100, opacity: 0, duration: 0.25, ease: 'power2.in' } },
          { enter: { x: 80, opacity: 0 }, in: { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, exit: { scale: 0.5, y: 60, opacity: 0, duration: 0.25, ease: 'power2.in' } },
          { enter: { scale: 0.6, y: 50, opacity: 0 }, in: { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, exit: { x: -100, opacity: 0, duration: 0.25, ease: 'power2.in' } },
          { enter: { x: -80, opacity: 0 }, in: { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, exit: { y: -60, opacity: 0, duration: 0.25, ease: 'power2.in' } },
          { enter: { y: -50, opacity: 0 }, in: { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, exit: null },
        ];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${window.innerHeight * 3.5}`,
            scrub: 0.3,
            snap: {
              snapTo: 'labelsDirectional',
              duration: { min: 0.2, max: 0.5 },
              ease: 'power2.out',
            },
          }
        });

        tl.fromTo(heading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 'step-0');
        tl.fromTo(mobileCards[0], patterns[0].enter, patterns[0].in, 'step-1');

        for (let i = 1; i < mobileCards.length; i++) {
          const label = `step-${i + 1}`;
          tl.to(mobileCards[i-1], patterns[i-1].exit, label);
          tl.fromTo(mobileCards[i], patterns[i].enter, patterns[i].in, `${label}+=0.22`);
        }

      } else {
        const cards = section.querySelectorAll('.category-card') as NodeListOf<HTMLElement>;
        if (!cards.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${window.innerHeight * 3.5}`,
            scrub: 0.3,
          }
        });

        tl.fromTo(heading,
          { opacity: 1, y: 25 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );

        cards.forEach((card) => {
          tl.fromTo(card,
            { opacity: 0, y: 50, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
            '>-=0.1'
          );
        });

        tl.to({}, { duration: 0.5 });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="relative bg-background max-sm:h-[400vh] sm:h-[450vh]"
    >
      <div className="sticky top-0 max-sm:h-screen sm:min-h-screen flex items-start justify-center pt-8 md:pt-12 lg:pt-16 pb-4 sm:pb-8 overflow-hidden sm:overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-yellow-400/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 w-full px-4 pb-4 md:pb-6">
          <div className="categories-heading text-center mb-4 md:mb-6">
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

          {/* Mobile Cards - Stacked Layout */}
          <div className="block sm:hidden">
            <div className="relative mx-auto" style={{ height: 480, maxWidth: 400 }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card-mobile absolute inset-0 flex items-center justify-center"
                  onClick={() => {
                    const filter = getFilterForCategory(category.id);
                    window.location.href = `/?filter=${encodeURIComponent(filter)}`;
                  }}
                >
                  <div className="glass-card rounded-3xl p-10 group relative overflow-hidden cursor-pointer w-full max-w-[380px] min-h-[440px] flex flex-col items-center justify-center text-center border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 rounded-3xl transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                      <div className="text-7xl mb-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300">
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 font-display">
                        {category.name}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-primary/10 w-full justify-center">
                        <span className="text-4xl font-black text-gradient">{category.count}</span>
                        <span className="text-lg text-muted-foreground">items</span>
                      </div>
                      <span className="mt-3 text-lg font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        View All
                        <ArrowRight className="h-6 w-6" />
                      </span>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Cards - Enhanced Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-6xl mx-auto">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card glass-card rounded-2xl p-4 lg:p-6 group relative overflow-hidden cursor-pointer flex flex-col justify-center"
                onClick={() => {
                  const filter = getFilterForCategory(category.id);
                  window.location.href = `/?filter=${encodeURIComponent(filter)}`;
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 rounded-2xl transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />

                <div className="relative z-10 flex flex-col items-center text-center gap-2 lg:gap-2.5">
                  <div className="text-3xl lg:text-5xl w-10 h-10 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-sm lg:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 font-display">
                    {category.name}
                  </h3>
                  <p className="text-[11px] lg:text-sm text-muted-foreground leading-relaxed line-clamp-1 max-w-[200px]">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1.5 lg:pt-2 border-t border-primary/10 w-full justify-center">
                    <span className="text-base lg:text-xl font-black text-gradient">{category.count}</span>
                    <span className="text-[11px] lg:text-sm text-muted-foreground">items</span>
                  </div>
                  <span className="text-[11px] lg:text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    View All
                    <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4" />
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
