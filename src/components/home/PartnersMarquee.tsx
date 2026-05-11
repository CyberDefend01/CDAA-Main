import { motion } from "framer-motion";

const partners = [
  { name: "Cisco",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/220px-Cisco_logo_blue_2016.svg.png" },
  { name: "EC-Council" },
  { name: "ISC²" },
  { name: "Coursera", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/220px-Coursera-Logo_600x600.svg.png" },
  { name: "CompTIA",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/CompTIA_logo.svg/220px-CompTIA_logo.svg.png" },
  { name: "ICDFA" },
  { name: "SANS" },
  { name: "Offensive Security" },
];

function PartnerItem({ partner, index }: { partner: typeof partners[0]; index: number }) {
  return (
    <div
      key={`${partner.name}-${index}`}
      className="flex items-center justify-center mx-8 md:mx-12 min-w-[140px] md:min-w-[160px] opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
    >
      {partner.logo ? (
        <>
          <img
            src={partner.logo}
            alt={partner.name}
            className="h-7 md:h-9 w-auto object-contain"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const next = e.currentTarget.nextElementSibling as HTMLElement;
              if (next) next.style.display = "block";
            }}
          />
          <span className="font-display font-extrabold text-lg md:text-xl text-foreground tracking-tight hidden">
            {partner.name}
          </span>
        </>
      ) : (
        <span className="font-display font-extrabold text-lg md:text-xl text-foreground tracking-tight">
          {partner.name}
        </span>
      )}
    </div>
  );
}

export function PartnersMarquee() {
  return (
    <section className="py-10 md:py-14 border-y border-border/40 bg-surface/30 overflow-hidden">
      <div className="container-custom mb-7">
        <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Trusted by Leading Industry Partners &amp; Frameworks
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {[...partners, ...partners].map((partner, i) => (
            <PartnerItem key={`${partner.name}-${i}`} partner={partner} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
