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
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter,  href: "#", label: "Twitter/X" },
  { icon: Youtube,  href: "#", label: "YouTube" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

const stats = [
  { value: "5,200+", label: "Students Trained" },
  { value: "47",     label: "Expert Courses" },
  { value: "93%",    label: "Completion Rate" },
  { value: "15+",    label: "Countries Reached" },
];

export function Footer() {
  return (
    <footer className="relative bg-[hsl(224,32%,7%)] overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-[hsl(222,89%,55%/0.08)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-[hsl(199,92%,52%/0.06)] rounded-full blur-[100px] pointer-events-none" />

      {/* Stats Bar */}
      <div className="relative z-10 border-b border-white/[0.08]">
        <div className="container-custom py-10">
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
                <p className="font-display font-extrabold text-2xl md:text-3xl text-[hsl(222,89%,68%)]">{stat.value}</p>
                <p className="text-sm text-white/40 mt-1 font-medium">{stat.label}</p>
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
              <img src={logo} alt="CDAA" className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10" />
              <div>
                <p className="font-display font-extrabold text-base text-white group-hover:text-[hsl(199,92%,62%)] transition-colors">
                  Cyber Defend Africa
                </p>
                <p className="text-[11px] text-white/35 font-semibold tracking-widest uppercase">Academy</p>
              </div>
            </Link>

            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              Securing Africa's digital future through world-class cybersecurity training, certifications, and career development programmes.
            </p>

            <div className="space-y-2.5 text-sm text-white/45">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[hsl(199,92%,52%)] shrink-0" />
                <span>Lagos, Nigeria · Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[hsl(199,92%,52%)] shrink-0" />
                <a href="mailto:info@cdaa.africa" className="hover:text-white transition-colors">info@cdaa.africa</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[hsl(199,92%,52%)] shrink-0" />
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
                  className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
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
          ] as const).map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="font-display font-bold text-sm text-white tracking-wide">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group/link flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors duration-200"
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
            <h4 className="font-display font-bold text-sm text-white">Stay Updated</h4>
            <p className="text-sm text-white/40 leading-relaxed">
              Get the latest cybersecurity insights and course updates.
            </p>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-3 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[hsl(222,89%,55%)] focus:ring-1 focus:ring-[hsl(222,89%,55%/0.3)] transition-all"
                />
              </div>
              <button className="w-full h-10 text-sm text-white font-semibold rounded-xl bg-[hsl(222,89%,55%)] hover:bg-[hsl(222,89%,60%)] hover:scale-[1.02] active:scale-95 transition-all">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-white/30">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/[0.08]">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-white/35">
            <Shield className="w-4 h-4 text-[hsl(199,92%,52%/0.6)]" />
            <span>© {new Date().getFullYear()} Cyber Defend Africa Academy. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-white/35">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                to="#"
                className="hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
