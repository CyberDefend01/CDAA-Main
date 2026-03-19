import { motion } from "framer-motion";

const partners = [
  {
    name: "Cisco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/220px-Cisco_logo_blue_2016.svg.png",
    color: "text-[#049fd9]",
  },
  {
    name: "EC-Council",
    color: "text-[#c41230]",
  },
  {
    name: "ISC²",
    color: "text-[#009639]",
  },
  {
    name: "Coursera",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/220px-Coursera-Logo_600x600.svg.png",
    color: "text-[#0056d2]",
  },
  {
    name: "CompTIA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/CompTIA_logo.svg/220px-CompTIA_logo.svg.png",
    color: "text-[#c8202f]",
  },
  {
    name: "ICDFA",
    color: "text-primary",
  },
];

export function PartnersMarquee() {
  const renderPartners = partners.map((partner, i) => (
    <div
      key={`${partner.name}-${i}`}
      className="flex items-center justify-center mx-10 md:mx-14 min-w-[140px] hover:scale-105 transition-transform duration-300"
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-8 md:h-12 w-auto object-contain"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const next = target.nextElementSibling as HTMLElement;
            if (next) next.style.display = "block";
          }}
        />
      ) : null}
      <span
        className={`text-xl md:text-2xl font-display font-extrabold tracking-tight ${partner.color || "text-foreground"} ${partner.logo ? "hidden" : "block"}`}
      >
        {partner.name}
      </span>
    </div>
  ));

  return (
    <section className="py-12 md:py-16 border-y border-border bg-card overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-[0.25em]">
          Trusted by Leading Industry Partners
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-card to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-card to-transparent z-10" />
        <motion.div
          className="flex items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {renderPartners}
          {renderPartners}
        </motion.div>
      </div>
    </section>
  );
}
