const Footer = () => {
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
            { title: "Equipment", links: ["Excavators", "Cranes", "Bulldozers", "Mixers"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
            { title: "Support", links: ["Help Center", "Safety", "Terms", "Privacy"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-foreground mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © 2026 BuildRent. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
