import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, Phone, Search, User, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsAdmin } from "../hooks/useQueries";

interface HeaderProps {
  onSearchChange?: (q: string) => void;
  searchValue?: string;
}

export default function Header({
  onSearchChange,
  searchValue = "",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const qc = useQueryClient();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsAdmin();
  const { data: userProfile } = useGetCallerUserProfile();
  const location = useLocation();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (err: any) {
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Models", to: "/models" },
    { label: "Implements", to: "/implements" },
    { label: "Enquiry", to: "/enquiry" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    ...(isAdmin ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-border">
      {/* Utility strip */}
      <div className="bg-primary text-primary-foreground text-xs py-1 px-4 text-right">
        Authorised Swaraj Tractor Dealer — Balwadi, Madhya Pradesh
      </div>
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <img
            src="/assets/uploads/IMG_20260322_110511-2-1.jpg"
            alt="Tirupati Tractors Logo"
            className="h-10 w-10 rounded-full object-cover border-2 border-primary"
          />
          <div>
            <span className="font-display font-bold text-primary text-lg leading-tight block">
              Tirupati Tractors
            </span>
            <span className="font-display font-bold text-foreground text-xs leading-tight block tracking-wide uppercase">
              Swaraj Dealer · Balwadi
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid="nav.link"
              className={`px-2.5 py-2 text-sm font-medium rounded transition-colors ${
                isActive(link.to)
                  ? "text-primary bg-muted"
                  : "text-foreground hover:text-primary hover:bg-muted"
              } ${link.label === "Admin" ? "text-gold font-semibold" : ""} ${
                link.label === "Enquiry"
                  ? "text-primary font-semibold border border-primary/30 hover:bg-primary hover:text-primary-foreground"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Search + Phone + Auth */}
        <div className="flex items-center gap-2">
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8 h-8 w-32 text-sm"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              data-ocid="header.search_input"
            />
          </div>

          <a href="tel:+919424569451" className="hidden sm:flex">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary text-primary hover:bg-muted"
              data-ocid="header.phone_button"
            >
              <Phone className="h-3.5 w-3.5" />
            </Button>
          </a>

          {isAuthenticated && userProfile && (
            <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              {userProfile.name}
            </span>
          )}

          <Button
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
            className="h-8 text-xs"
            onClick={handleAuth}
            disabled={loginStatus === "logging-in"}
            data-ocid="header.login_button"
          >
            {loginStatus === "logging-in" ? (
              "Logging in..."
            ) : isAuthenticated ? (
              <>
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="h-3.5 w-3.5 mr-1" />
                Login
              </>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 text-sm font-medium rounded ${
                isActive(link.to) ? "text-primary bg-muted" : "text-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
