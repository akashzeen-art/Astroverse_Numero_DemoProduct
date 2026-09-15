import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, Home, Hand, Calculator, Star, LayoutDashboard, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { isGatedPath } from "@/lib/subscription";
import AuthModal from "./AuthModal";
import LanguageSwitcher from "./LanguageSwitcher";
import gsap from "gsap";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { hasAccess, requestService, openSubscribeModal } = useSubscription();
  const { tr } = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const MENU_ITEMS = [
    { path: "/", label: tr.nav.home, icon: Home },
    { path: "/palm-analysis", label: tr.nav.palmReading, icon: Hand },
    { path: "/numerology", label: tr.nav.numerology, icon: Calculator },
    { path: "/astrology", label: tr.nav.astrology, icon: Star },
    { path: "/dashboard", label: tr.nav.dashboard, icon: LayoutDashboard },
    { path: "/my-account", label: tr.nav.profile, icon: User },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([logoRef.current], { opacity: 0, y: -20 });
      gsap.to(logoRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 });
      gsap.to(".premium-sparkle", { rotation: 180, scale: 1.1, duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true });
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handler = () => setIsAuthModalOpen(true);
    window.addEventListener("open-auth-modal", handler);
    return () => window.removeEventListener("open-auth-modal", handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (isGatedPath(path) && !hasAccess) {
      e.preventDefault();
      requestService(path);
    }
  };

  // Desktop nav links (main 5 only)
  const desktopLinks = MENU_ITEMS.slice(0, 5);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled ? "border-b border-border/50 backdrop-blur-md bg-background/80" : "bg-transparent border-none backdrop-blur-0"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/">
              <div ref={logoRef} className="flex items-center gap-1.5 relative">
                <img src="/logo.png" alt="Astroverse Logo" className="h-12 w-auto sm:h-14 md:h-16 object-contain" />
                <Sparkles className="premium-sparkle absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 text-amber-400" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {desktopLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  onClick={(e) => handleNavClick(link.path, e)}
                  className={`text-sm font-medium transition-all duration-200 hover:text-purple-400 hover:scale-105 ${
                    isActive(link.path) ? "text-purple-400 border-b-2 border-purple-400 pb-1" : "text-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              {/* Desktop auth */}
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-red-400">
                    <LogOut className="w-4 h-4 mr-1" /> {tr.nav.logOut}
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openSubscribeModal()} className="text-muted-foreground hover:text-yellow-300">
                      {tr.nav.signIn}
                    </Button>
                    <Button size="sm" onClick={() => openSubscribeModal("/palm-analysis")} className="bg-stellar-gradient hover:opacity-90 stellar-glow">
                      {tr.nav.getStarted}
                    </Button>
                  </>
                )}
              </div>
              {/* Burger button — always visible */}
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-center w-9 h-9 p-0">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Burger Menu Overlay — below navbar so it doesn't overlap */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 md:top-20 bottom-0 z-40 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />

          {/* Slide-in panel from right */}
          <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-slate-950 border-l border-white/10 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-bold text-sm">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-2">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      handleNavClick(item.path, e);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-white/5 ${
                      isActive(item.path) ? "text-purple-400 bg-purple-500/10" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 opacity-70" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Bottom auth */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <div className="flex justify-center pb-2">
                <LanguageSwitcher />
              </div>
              {user ? (
                <Button variant="outline" size="sm" onClick={logout} className="w-full border-red-400/30 text-red-400 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4 mr-2" /> {tr.nav.logOut}
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => { openSubscribeModal(); setIsMenuOpen(false); }}
                    className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-500/10">
                    {tr.nav.signIn}
                  </Button>
                  <Button size="sm" onClick={() => { openSubscribeModal("/palm-analysis"); setIsMenuOpen(false); }}
                    className="w-full bg-stellar-gradient hover:opacity-90">
                    {tr.nav.getStarted}
                  </Button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-4 text-[10px] text-gray-600 text-center">
              © 2026 Astroverse
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
