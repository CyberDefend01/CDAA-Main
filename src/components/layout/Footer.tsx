import { Link } from "react-router-dom";
import { Mail, Linkedin, Twitter, Youtube, Facebook, ArrowRight, Shield, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const footerLinks = {
  courses: [
    { name: "Cybersecurity Fundamentals", href: "/courses" },
    { name: "Ethical Hacking",            href: "/courses" },
    { name: "Cloud Security",             href: "/courses" },
    { name: "SOC Analyst Training",       href: "/courses" },
    { name: "GRC & Compliance",           href: "/courses" },
  ],
  company: [
    { name: "About Us",  href: "/about" },
    { name: "Blog",      href: "/blog" },
    { name: "Careers",   href: "/contact" },
    { name: "Contact",   href: "/contact" },
    { name: "Partners",  href: "/about" },
  ],
  support: [
    { name: "Help Center",       href: "/contact" },
    { name: "FAQs",              href: "/contact" },
    { name: "Privacy Policy",    href: "#" },
    { name: "Terms of Service",  href: "#" },
    { name: "Cookie Policy",     href: "#" },
  ],
};

const socials = [
  { icon: Linkedin, href: "#", label: "LinkedIn",  color: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10" },
  { icon: Twitter,  href: "#", label: "Twitter/X", color: "hover:text-foreground hover:bg-muted" },
  { icon: Youtube,  href: "#", label: "YouTube",   color: "hover:text-[#FF0000] hover:bg-[#FF0000]/10" },
  { icon: Facebook, href: "#", label: "Facebook",  color: "hover:text-[#1877F2] hover:bg-[#1877F2]/10" },
];

const stats = [
  { value: "5,000+",  label: "Students Trained" },
  { value: "50+",     label: "Expert Courses" },
  { value: "95%",     label: "Completion Rate" },
  { value: "30+",     label: "Certifications" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 cyber-dots opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 ambient-blob ambient-blob-cyan opacity-20 pointer-events-none -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-80 h-80 ambient-blob ambient-blob-magenta opacity-15 pointer-events-none -translate-y-1/2" />

      {/* Stats Bar */}
      <div className="relative z-10 border-b border-border/40">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="font-display font-extrabold text-2xl md:text-3xl gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-cyan/20 blur-md group-hover:blur-lg transition-all" />
                <img src={logo} alt="CDAA" className="relative h-11 w-11 rounded-full object-cover ring-2 ring-border/40 group-hover:ring-cyan/30 transition-all" />
              </div>
              <div>
                <p className="font-display font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                  Cyber Defend Africa
                </p>
                <p className="text-[11px] text-muted-foreground font-semibold tracking-widest uppercase">Academy</p>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Securing Africa's digital future through world-class cybersecurity training, certifications, and career development programmes.
            </p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
                <span>Lagos, Nigeria · Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                <a href="mailto:info@cdaa.africa" className="hover:text-primary transition-colors">info@cdaa.africa</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                <span>+234 800 000 0000</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`p-2.5 rounded-xl border border-border/50 text-muted-foreground transition-all duration-200 ${social.color}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {([
            { title: "Courses",  links: footerLinks.courses },
            { title: "Company",  links: footerLinks.company },
            { title: "Support",  links: footerLinks.support },
          ] as const).map((group, gi) => (
            <div key={group.title} className="space-y-4">
              <h4 className="font-display font-bold text-sm text-foreground tracking-wide">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group/link flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <span className="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-200 opacity-0 group-hover/link:opacity-100">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get the latest cybersecurity insights and course updates.
            </p>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-cyber pl-9 text-sm h-10"
                />
              </div>
              <button className="w-full btn-cyber h-10 text-sm text-white font-semibold rounded-xl">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-border/40">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary/60" />
            <span>© {new Date().getFullYear()} Cyber Defend Africa Academy. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                to="#"
                className="hover:text-primary transition-colors duration-200 relative group/bottom"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover/bottom:w-full transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
