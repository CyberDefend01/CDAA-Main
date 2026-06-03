import { motion } from "framer-motion";

const partners = [
  { name: "Cisco",     logo: "https://cdn.simpleicons.org/cisco/049fd9",       h: "h-7 md:h-9" },
  { name: "CompTIA",   logo: "https://cdn.simpleicons.org/comptia/C8202F",     h: "h-6 md:h-8" },
  { name: "Coursera",  logo: "https://cdn.simpleicons.org/coursera/0056D2",    h: "h-6 md:h-7" },
  { name: "EC-Council",  style: "ec" },
  { name: "ISC²",        style: "isc" },
  { name: "SANS",        style: "sans" },
  { name: "OffSec",      style: "offsec" },
  { name: "ICDFA",       style: "icdfa" },
];

/* Typographic logos for orgs without public CDN logos */
function TextLogo({ name, style }: { name: string; style: string }) {
  const styles: Record<string, string> = {
    ec:     "font-display font-extrabold text-[19px] md:text-[22px] tracking-tight text-red-600",
    isc:    "font-display font-extrabold text-[19px] md:text-[22px] tracking-tight text-emerald-700",
    sans:   "font-mono-cyber font-bold text-[20px] md:text-[24px] tracking-widest uppercase text-[#003366]",
    offsec: "font-display font-extrabold text-[18px] md:text-[21px] tracking-tight text-orange-600",
    icdfa:  "font-display font-extrabold text-[17px] md:text-[20px] tracking-wider uppercase text-indigo-700",
  };
  return <span className={styles[style] || ""}>{name}</span>;
}

function PartnerItem({ partner }: { partner: typeof partners[0] }) {
  return (
    <div className="flex items-center justify-center mx-8 md:mx-12 min-w-[130px] md:min-w-[150px] opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 select-none">
      {"logo" in partner && partner.logo ? (
        <>
          <img
            src={partner.logo}
            alt={partner.name}
            className={`${partner.h || "h-8"} w-auto object-contain`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const next = e.currentTarget.nextElementSibling as HTMLElement;
              if (next) next.style.display = "flex";
            }}
          />
          <span className="font-display font-extrabold text-lg text-foreground tracking-tight hidden">
            {partner.name}
          </span>
        </>
      ) : (
        <TextLogo name={partner.name} style={(partner as { style?: string }).style || ""} />
      )}
    </div>
  );
}

export function PartnersMarquee() {
  return (
    <section className="py-10 md:py-14 border-y border-border/40 bg-surface/30 overflow-hidden">
      <div className="container-custom mb-8">
        <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Aligned With Global Industry Standards
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...partners, ...partners].map((partner, i) => (
            <PartnerItem key={`${partner.name}-${i}`} partner={partner} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
