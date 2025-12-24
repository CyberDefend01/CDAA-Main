import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Linkedin, Twitter, Youtube, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = {
  courses: [
    { name: "Cybersecurity Fundamentals", href: "/courses" },
    { name: "Ethical Hacking", href: "/courses" },
    { name: "Cloud Security", href: "/courses" },
    { name: "SOC Analyst Training", href: "/courses" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/contact" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/contact" },
    { name: "FAQs", href: "/contact" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Cyber Defend Africa Academy" className="h-12 w-auto" />
              <div>
                <span className="font-display font-bold text-lg text-foreground">Cyber Defend Africa</span>
                <span className="block text-xs text-muted-foreground">Academy</span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Securing Africa's Digital Future through world-class cybersecurity training and education.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Cyber Defend Africa Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}