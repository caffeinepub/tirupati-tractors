import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Tractor,
  Youtube,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + desc */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary rounded-full p-1.5">
                <Tractor className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-base block">
                  Tirupati Tractors
                </span>
                <span className="text-xs text-footer-foreground/60">
                  Authorised Swaraj Dealer
                </span>
              </div>
            </div>
            <p className="text-sm text-footer-foreground/70 leading-relaxed">
              Your trusted partner for Swaraj tractors and farm implements.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 uppercase text-xs tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-footer-foreground/70">
              <li>
                <a href="/" className="hover:text-gold transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/models" className="hover:text-gold transition-colors">
                  Tractor Models
                </a>
              </li>
              <li>
                <a
                  href="/implements"
                  className="hover:text-gold transition-colors"
                >
                  Implements
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gold transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-gold transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Address + Phone */}
          <div>
            <h4 className="font-semibold text-white mb-3 uppercase text-xs tracking-wider">
              Visit Us
            </h4>
            <div className="space-y-3 text-sm text-footer-foreground/70">
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>Balwadi - Sendhwa, Madhya Pradesh</span>
              </div>
              <div className="flex gap-2">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <a
                  href="tel:+919424569451"
                  className="hover:text-gold transition-colors"
                >
                  +91 94245 69451
                </a>
              </div>
              <div className="flex gap-2">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <a
                  href="mailto:Tirupatitractor551@gmail.com"
                  className="hover:text-gold transition-colors"
                >
                  Tirupatitractor551@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-3 uppercase text-xs tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-primary p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/tirupatitractors"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-pink-500 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/919424569451"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-green-500 p-2 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-red-600 p-2 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-footer-foreground/50 mt-4">
              Mon–Sat: 9:00 AM – 6:00 PM
            </p>
            <p className="text-xs text-footer-foreground/50">Sunday: Closed</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 py-4 text-center text-xs text-footer-foreground/50">
          © {year} Tirupati Tractors. All rights reserved. ·{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
