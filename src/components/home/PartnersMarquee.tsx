import { motion } from "framer-motion";

const partners = [
  {
    name: "Cisco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/220px-Cisco_logo_blue_2016.svg.png",
  },
  {
    name: "EC-Council",
    logo: "https://images.credly.com/images/65e10a5c-ea11-4072-97f1-60607e9cf8e6/EC-Council-Logo.png",
  },
  {
    name: "ISC²",
    logo: "https://www.youracclaim.com/assets/isc2-logo-4b2a5a9e.png",
    fallback: true,
  },
  {
    name: "Coursera",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/220px-Coursera-Logo_600x600.svg.png",
  },
  {
    name: "CompTIA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/CompTIA_logo.svg/220px-CompTIA_logo.svg.png",
  },
  {
    name: "ICDFA",
    logo: "",
  },
];

export function PartnersMarquee() {
  const renderPartners = partners.map((partner, i) => (
    <div
      key={`${partner.name}-${i}`}
      className="flex items-center justify-center mx-12 min-w-[160px] hover:scale-110 transition-transform duration-300"
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-10 md:h-14 w-auto object-contain"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const sibling = target.nextElementSibling as HTMLElement;
            if (sibling) sibling.style.display = "flex";
          }}
        />
      ) : null}
      <span
        className={`text-lg font-display font-bold text-primary ${partner.logo ? "hidden" : "flex"}`}
      >
        {partner.name}
      </span>
    </div>
  ));

  return (
    <section className="py-14 border-y border-border/30 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
          Trusted by Leading Industry Partners
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          className="flex items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {renderPartners}
          {renderPartners}
        </motion.div>
      </div>
    </section>
  );
}
