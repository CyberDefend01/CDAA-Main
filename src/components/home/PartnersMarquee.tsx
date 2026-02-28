import { motion } from "framer-motion";

const partners = [
  { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png" },
  { name: "EC-Council", logo: "https://www.eccouncil.org/wp-content/uploads/2021/11/EC-Council-Logo-Blue.png" },
  { name: "ISC2", logo: "https://www.isc2.org/-/media/ISC2/Landing-Pages/isc2-logo-stacked.ashx" },
  { name: "Coursera", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/1200px-Coursera-Logo_600x600.svg.png" },
  { name: "CompTIA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/CompTIA_logo.svg/1200px-CompTIA_logo.svg.png" },
  { name: "ICDFA", logo: "" },
];

export function PartnersMarquee() {
  const renderPartners = partners.map((partner, i) => (
    <div
      key={`${partner.name}-${i}`}
      className="flex items-center justify-center mx-10 min-w-[140px] grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-10 md:h-12 w-auto object-contain"
          loading="lazy"
        />
      ) : (
        <span className="text-lg font-display font-bold text-muted-foreground">{partner.name}</span>
      )}
    </div>
  ));

  return (
    <section className="py-12 border-y border-border/30 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Trusted by Leading Industry Partners
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          className="flex items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {renderPartners}
          {renderPartners}
        </motion.div>
      </div>
    </section>
  );
}
