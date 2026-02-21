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
    <footer className="relative border-t border-sky-300/30 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(197 71% 73%), hsl(199 80% 65%), hsl(197 71% 73%))' }}>
      {/* Cyber watermark background */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'url(/images/cyber-footer-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="relative z-10 container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Cyber Defend Africa Academy" className="h-12 w-auto" />
              <div>
                <span className="font-display font-bold text-lg text-slate-900">Cyber Defend Africa</span>
                <span className="block text-xs text-slate-700">Academy</span>
              </div>
            </Link>
            <p className="text-slate-700 mb-6 max-w-sm">
              Securing Africa's Digital Future through world-class cybersecurity training and education.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/30 rounded-lg text-slate-700 hover:text-sky-900 hover:bg-white/50 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/30 rounded-lg text-slate-700 hover:text-sky-900 hover:bg-white/50 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/30 rounded-lg text-slate-700 hover:text-sky-900 hover:bg-white/50 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/30 rounded-lg text-slate-700 hover:text-sky-900 hover:bg-white/50 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-slate-900 mb-4">Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-700 hover:text-sky-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-700 hover:text-sky-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-700 hover:text-sky-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sky-300/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-700 text-sm">
            © {new Date().getFullYear()} Cyber Defend Africa Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-700">
            <Link to="#" className="hover:text-sky-900 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-sky-900 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-sky-900 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
