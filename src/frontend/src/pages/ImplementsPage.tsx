import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const IMPLEMENTS = [
  {
    name: "Shaktiman Regular Plus Rotavator",
    model: "Regular Plus Series",
    img: "/assets/uploads/Shaktiman_Regular_Plus_Series_Image_2-1-1-1.png",
    category: "Tillage",
    desc: "Heavy-duty rotavator for fine seedbed preparation. Suitable for all soil types with robust blade configuration and high performance.",
    features: [
      "Heavy Duty Build",
      "PTO Driven",
      "Gear Drive",
      "Adjustable Depth",
      "3-Point Linkage",
      "All Soil Types",
    ],
  },
  {
    name: "Swaraj Rotavator",
    model: "RMB-145",
    img: "/assets/generated/implement-rotavator.dim_600x400.jpg",
    category: "Tillage",
    desc: "Advanced rotary tiller for fine seedbed preparation. Suitable for all soil types with adjustable blade configuration.",
    features: [
      "145cm Working Width",
      "42 Blades",
      "PTO Driven",
      "Gear Drive",
      "Side Drive",
      "3-Point Linkage",
    ],
  },
  {
    name: "Cultivator 9-Tyne",
    model: "CL-9T",
    img: "/assets/generated/implement-cultivator.dim_600x400.jpg",
    category: "Tillage",
    desc: "Heavy-duty 9-tyne spring loaded cultivator for inter-cultivation and weed control.",
    features: [
      "9 Tynes",
      "Spring Loaded",
      "Adjustable Depth",
      "Reversible Shovels",
      "3-Point Linkage",
      "All-Terrain",
    ],
  },
  {
    name: "Disc Plough (3-Disc)",
    model: "DP-3",
    img: "/assets/generated/implement-plough.dim_600x400.jpg",
    category: "Primary Tillage",
    desc: "3-disc mounted plough for primary tillage. Ideal for hard soils with heavy trash and residue.",
    features: [
      "3 Discs",
      "610mm Diameter",
      "Adjustable Angle",
      "Hard Chrome Discs",
      "Deep Ploughing",
      "3-Point Linkage",
    ],
  },
  {
    name: "Paddy Weeder",
    model: "PW-2R",
    img: "/assets/generated/implement-cultivator.dim_600x400.jpg",
    category: "Paddy",
    desc: "Two-row paddy weeder for mechanical weeding in wet paddy fields.",
    features: [
      "2-Row Operation",
      "Adjustable Row Spacing",
      "Lightweight",
      "Low Maintenance",
      "High Efficiency",
      "Manual Guided",
    ],
  },
  {
    name: "Box Blade",
    model: "BB-6FT",
    img: "/assets/generated/implement-plough.dim_600x400.jpg",
    category: "Leveling",
    desc: "6-foot box blade for land leveling, road grading, and moving materials.",
    features: [
      "6-Foot Width",
      "Reversible Blade",
      "Scarifier Shanks",
      "Category I/II",
      "3-Point Linkage",
      "Robust Steel",
    ],
  },
  {
    name: "Ridger",
    model: "RDG-3F",
    img: "/assets/generated/implement-rotavator.dim_600x400.jpg",
    category: "Sowing",
    desc: "3-furrow ridger for ridge formation for sugarcane, potato, and other row crops.",
    features: [
      "3 Furrows",
      "Adjustable Spacing",
      "Durable Cast Iron",
      "3-Point Linkage",
      "Low Draft",
      "Easy Maintenance",
    ],
  },
];

const WA_IMPL_LINK =
  "https://wa.me/919424569451?text=Hi%2C%20I%20am%20interested%20in%20a%20farm%20implement.%20Please%20share%20the%20price%20quote.";

export default function ImplementsPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          Farm Implements & Accessories
        </h1>
        <p className="text-muted-foreground text-sm">
          Complete your farming setup with quality implements
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {IMPLEMENTS.map((impl, i) => (
          <motion.div
            key={impl.model}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-lg border border-border shadow-card overflow-hidden flex flex-col"
            data-ocid={`implements.item.${i + 1}`}
          >
            <img
              src={impl.img}
              alt={impl.name}
              className="w-full h-44 object-cover"
              loading="lazy"
            />
            <div className="p-5 flex flex-col flex-1">
              <span className="text-xs text-primary font-medium uppercase tracking-wide">
                {impl.category}
              </span>
              <h3 className="font-display font-bold text-lg text-foreground mt-1">
                {impl.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">{impl.model}</p>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {impl.desc}
              </p>
              <ul className="grid grid-cols-2 gap-1 mb-4">
                {impl.features.map((f) => (
                  <li key={f} className="flex items-center gap-1 text-xs">
                    <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-end">
                <a
                  href={WA_IMPL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded font-medium hover:bg-secondary transition-colors"
                  data-ocid={`implements.item.${i + 1}.primary_button`}
                >
                  Get Quote
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
