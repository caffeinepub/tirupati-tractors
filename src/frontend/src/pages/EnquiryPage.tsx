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
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Instagram,
  Loader2,
  MessageCircle,
  SendHorizonal,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TRACTOR_MODELS } from "../data/products";

const WA_LINK =
  "https://wa.me/919424569451?text=Hi%2C%20I%20am%20interested%20in%20a%20Swaraj%20tractor.%20Please%20share%20the%20price%20quote.";
const IG_LINK = "https://instagram.com/tirupatitractors";

export default function EnquiryPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    model: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Enquiry submitted! We will contact you shortly.");
  };

  const handleReset = () => {
    setForm({ name: "", phone: "", email: "", model: "", message: "" });
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-primary/10 px-4 py-12">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Tractor Enquiry
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Fill in your details and our team will get in touch with pricing,
            availability, and finance options.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-footer rounded-xl p-6 text-footer-foreground">
              <h3 className="font-display font-bold text-white text-lg mb-4">
                Why Enquire With Us?
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Authorised Swaraj Dealer — Genuine Parts & Service",
                  "Best prices in Madhya Pradesh",
                  "Finance options available",
                  "Free demo at your farm",
                  "After-sales service support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp Quote card */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-primary rounded-xl p-6 text-primary-foreground hover:bg-secondary transition-colors group"
              data-ocid="enquiry.phone_button"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span className="font-display font-bold text-sm uppercase tracking-wide">
                  Get a Quote on WhatsApp
                </span>
              </div>
              <p className="font-display font-extrabold text-2xl tracking-tight">
                +91 94245 69451
              </p>
              <p className="text-xs text-primary-foreground/70 mt-1">
                Mon – Sat, 9 AM to 7 PM
              </p>
            </a>

            {/* Instagram link */}
            <a
              href={IG_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-5 text-white hover:opacity-90 transition-opacity group"
              data-ocid="enquiry.secondary_button"
            >
              <div className="bg-white/20 rounded-full p-2">
                <Instagram className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Follow on Instagram</p>
                <p className="text-xs text-white/80">@tirupatitractors</p>
              </div>
            </a>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <p className="text-sm font-semibold text-foreground mb-2">
                Available Models
              </p>
              <ul className="space-y-2">
                {TRACTOR_MODELS.map((m) => (
                  <li key={m} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                    {m}
                    {m.includes("744 XT") && (
                      <span className="text-xs bg-gold text-gold-foreground px-2 py-0.5 rounded-full font-semibold">
                        Best Seller
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div
                className="bg-card border border-border rounded-xl p-10 text-center"
                data-ocid="enquiry.success_state"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">
                  Enquiry Received!
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Thank you, <strong>{form.name}</strong>! Our team will call
                  you at <strong>{form.phone}</strong> within 24 hours.
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-primary text-primary"
                  data-ocid="enquiry.secondary_button"
                >
                  Submit Another Enquiry
                </Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 shadow-card">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  data-ocid="enquiry.panel"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="page-enq-name">Your Name *</Label>
                      <Input
                        id="page-enq-name"
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
                      <Label htmlFor="page-enq-phone">Phone Number *</Label>
                      <Input
                        id="page-enq-phone"
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
                    <Label htmlFor="page-enq-email">
                      Email Address{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="page-enq-email"
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
                    <Label htmlFor="page-enq-model">
                      Select Tractor Model *
                    </Label>
                    <Select
                      value={form.model}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, model: v }))
                      }
                      required
                    >
                      <SelectTrigger
                        id="page-enq-model"
                        data-ocid="enquiry.select"
                      >
                        <SelectValue placeholder="Choose a model..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TRACTOR_MODELS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                            {m.includes("744 XT") ? " ⭐ Best Seller" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="page-enq-message">Message / Query</Label>
                    <Textarea
                      id="page-enq-message"
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      rows={4}
                      placeholder="Tell us about your farming needs, land size, preferred budget, or any questions..."
                      data-ocid="enquiry.textarea"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || !form.model}
                    className="w-full bg-primary text-primary-foreground hover:bg-secondary font-semibold py-5"
                    data-ocid="enquiry.submit_button"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <SendHorizonal className="h-4 w-4 mr-2" />
                    )}
                    {submitting ? "Sending Enquiry..." : "Submit Enquiry"}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
