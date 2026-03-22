import {
  Award,
  Clock,
  Mail,
  MapPin,
  Phone,
  Tractor,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetShowroomInfo } from "../hooks/useQueries";

const STATS = [
  { icon: Tractor, label: "Tractors Sold", value: "5000+" },
  { icon: Users, label: "Happy Farmers", value: "10,000+" },
  { icon: Award, label: "Years of Service", value: "15+" },
];

export default function AboutPage() {
  const { data: showroom } = useGetShowroomInfo();

  const info = showroom || {
    name: "Tirupati Tractors",
    address: "Balwadi - Sendhwa, Madhya Pradesh",
    phone: "+91 94245 69451",
    email: "Tirupatitractor551@gmail.com",
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          About Tirupati Tractors
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Tirupati Tractors is an authorised dealer of Swaraj Tractors in
          Sendhwa, Madhya Pradesh. With over 15 years of experience, we have
          been empowering farmers with the best agricultural machinery.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center"
          >
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-3xl font-display font-bold text-primary">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Our Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-xl border border-border p-8 mb-10"
      >
        <h2 className="text-xl font-display font-bold mb-4">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Founded in 2009, Tirupati Tractors began as a small dealership with a
          vision to bring the best agricultural solutions to the farmers of
          Madhya Pradesh. Over the years, we have grown to become one of the
          most trusted Swaraj dealerships in the region.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We offer a comprehensive range of Swaraj tractors — from compact mini
          tractors to heavy-duty powerhouses — along with a full line of farm
          implements and accessories. Our dedicated service team ensures that
          your machinery runs at peak performance throughout the farming season.
        </p>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-footer rounded-xl p-8 text-footer-foreground"
      >
        <h2 className="text-xl font-display font-bold text-white mb-6">
          Visit Our Showroom
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-footer-foreground/60 mb-0.5">
                  Address
                </p>
                <p className="text-sm">{info.address}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-gold shrink-0" />
              <div>
                <p className="text-xs text-footer-foreground/60 mb-0.5">
                  Phone
                </p>
                <a
                  href={`tel:${info.phone}`}
                  className="text-sm hover:text-gold transition-colors"
                >
                  {info.phone}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-gold shrink-0" />
              <div>
                <p className="text-xs text-footer-foreground/60 mb-0.5">
                  Email
                </p>
                <a
                  href={`mailto:${info.email}`}
                  className="text-sm hover:text-gold transition-colors"
                >
                  {info.email}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-gold shrink-0" />
              <div>
                <p className="text-xs text-footer-foreground/60 mb-0.5">
                  Hours
                </p>
                <p className="text-sm">Mon–Sat: 9:00 AM – 6:00 PM</p>
                <p className="text-sm text-footer-foreground/60">
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-5 flex flex-col justify-center">
            <h3 className="font-semibold text-white mb-3">Send us a message</h3>
            <a
              href="https://wa.me/919424569451?text=Hello%2C%20I%27m%20interested%20in%20your%20tractors"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-gold-foreground text-sm font-medium px-5 py-2.5 rounded text-center hover:bg-gold/90 transition-colors"
              data-ocid="contact.primary_button"
            >
              WhatsApp Us
            </a>
            <p className="text-xs text-footer-foreground/50 mt-3 text-center">
              Quick response guaranteed!
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
