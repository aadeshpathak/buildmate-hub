import { Flame } from "lucide-react";

const Footer = () => {
  const handleEquipmentClick = (filter: string) => {
    // Navigate to the page with filter and scroll to machines section
    window.location.href = `/?filter=${filter}#machines`;
  };
  return (
    <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">BR</span>
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                Build<span className="text-primary">Rent</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">India's premium construction equipment rental platform.</p>
          </div>

          {[
            { title: "Equipment", links: ["SLCM Mixers", "Batching Plants", "Transit Mixers", "Concrete Pumps"], filters: ["SLCM", "Batching Plants", "Transit Mixers", "Concrete Pumps"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
            { title: "Support", links: ["Help Center", "Safety", "Terms", "Privacy"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-foreground mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, index) => (
                  <li key={link}>
                    {col.title === "Equipment" ? (
                      <button
                        onClick={() => handleEquipmentClick(col.filters[index])}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
                      >
                        {link}
                      </button>
                    ) : (
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            © 2026 BuildRent. All rights reserved.
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 backdrop-blur-sm rounded-full border border-muted/50">
            <span className="text-sm font-cursive text-muted-foreground">With</span>
            <span className="text-lg">❤️</span>
            <span className="text-sm font-cursive text-muted-foreground">from</span>
            <a
              href="https://www.self.so/prathamesh-surendra-tiwari-resume"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-cursive font-bold text-foreground hover:text-primary transition-colors"
            >
              Prathamesh Tiwari
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
