import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Layers,
  Loader2,
  SendHorizonal,
  Settings,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ProductEntry } from "../backend.d";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { SAMPLE_PRODUCTS, TRACTOR_MODELS } from "../data/products";
import { useGetAllProducts } from "../hooks/useQueries";

const IMPLEMENTS = [
  {
    title: "Rotavators",
    desc: "Achieve perfect seedbed preparation with our range of rotary tillers for all soil types.",
    icon: Settings,
    img: "/assets/generated/implement-rotavator.dim_600x400.jpg",
  },
  {
    title: "Cultivators",
    desc: "Break up soil, remove weeds, and aerate for better crop yield with heavy-duty cultivators.",
    icon: Wrench,
    img: "/assets/generated/implement-cultivator.dim_600x400.jpg",
  },
  {
    title: "Disc Ploughs",
    desc: "Primary tillage implements for deep ploughing. Available in multiple disc configurations.",
    icon: Layers,
    img: "/assets/generated/implement-plough.dim_600x400.jpg",
  },
];

function EnquirySection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    model: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success("Enquiry submitted! We will contact you shortly.");
    setForm({ name: "", phone: "", email: "", model: "", message: "" });
  };

  return (
    <section className="py-14 bg-muted/40" id="enquiry">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-foreground">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Interested in a tractor? Fill in your details and we'll get back to
            you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-8 shadow-card"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enq-name">Your Name *</Label>
                <Input
                  id="enq-name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Ravi Kumar"
                  data-ocid="enquiry.input"
                />
              </div>
              <div>
                <Label htmlFor="enq-phone">Phone Number *</Label>
                <Input
                  id="enq-phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                  data-ocid="enquiry.input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="enq-email">Email Address (optional)</Label>
              <Input
                id="enq-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="your@email.com"
                data-ocid="enquiry.input"
              />
            </div>

            <div>
              <Label htmlFor="enq-model">Tractor Model *</Label>
              <Select
                value={form.model}
                onValueChange={(v) => setForm((p) => ({ ...p, model: v }))}
                required
              >
                <SelectTrigger id="enq-model" data-ocid="enquiry.select">
                  <SelectValue placeholder="Select a model..." />
                </SelectTrigger>
                <SelectContent>
                  {TRACTOR_MODELS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="enq-message">Message / Query</Label>
              <Textarea
                id="enq-message"
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                rows={4}
                placeholder="Tell us about your farming needs, budget, or any questions..."
                data-ocid="enquiry.textarea"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !form.model}
              className="w-full bg-primary text-primary-foreground hover:bg-secondary font-semibold"
              data-ocid="enquiry.submit_button"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4 mr-2" />
              )}
              {submitting ? "Sending..." : "Submit Enquiry"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { data: backendProducts, isLoading } = useGetAllProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductEntry | null>(
    null,
  );

  const products: ProductEntry[] =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SAMPLE_PRODUCTS;
  const displayProducts = products.slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[520px] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-tractor.dim_1200x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-widest mb-3 block">
              Authorised Swaraj Dealer — Balwadi
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              Power Your Farm,
              <br /> Grow Your Future
            </h1>
            <p className="text-white/80 text-base mb-8 leading-relaxed">
              Discover Swaraj's complete range of tractors and implements.
              Trusted by 10,000+ farmers across Madhya Pradesh.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/models">
                <Button
                  className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold px-6"
                  data-ocid="hero.primary_button"
                >
                  View All Models <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/enquiry">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  data-ocid="hero.secondary_button"
                >
                  Make an Enquiry
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-14 bg-background">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-foreground">
              Our Swaraj Tractor Lineup
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              5 models available — from 35 HP to 55 HP
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  key={i}
                  className="h-96 rounded-lg"
                  data-ocid="products.loading_state"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((p, i) => (
                <motion.div
                  key={String(p.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <ProductCard
                    product={p}
                    index={i + 1}
                    onViewSpecs={setSelectedProduct}
                    onGetQuote={(prod) =>
                      window.open(
                        `https://wa.me/919424569451?text=${encodeURIComponent(`Hi, I am interested in ${prod.name}. Please share the price quote.`)}`,
                        "_blank",
                      )
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/models">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-muted"
                data-ocid="models.primary_button"
              >
                View All Models <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Implements */}
      <section className="py-14 bg-muted/50">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-foreground">
              Farm Implements & Accessories
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Complete your farming setup with our range of implements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {IMPLEMENTS.map((impl, i) => (
              <motion.div
                key={impl.title}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-lg overflow-hidden border border-border shadow-card hover:shadow-md transition-shadow"
              >
                <img
                  src={impl.img}
                  alt={impl.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">
                    {impl.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{impl.desc}</p>
                  <Link to="/implements">
                    <Button
                      variant="link"
                      className="text-primary px-0 mt-2 text-sm"
                      data-ocid={`implements.item.${i + 1}.link`}
                    >
                      Learn More <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin promo banner */}
      <section className="py-10 bg-background">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-footer rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
                For Showroom Management
              </p>
              <h3 className="font-display font-bold text-white text-2xl">
                Admin Dashboard Overview
              </h3>
              <p className="text-footer-foreground/70 text-sm mt-2">
                Manage your product catalog, update pricing, track inventory and
                more from a single dashboard.
              </p>
            </div>
            <Link to="/admin">
              <Button
                className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold shrink-0 px-6"
                data-ocid="admin.primary_button"
              >
                Go to Admin <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enquiry section */}
      <EnquirySection />

      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
