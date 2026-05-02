import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, LifeBuoy, BookOpen } from "lucide-react";

export function Navbar() {
  const { currentUser, setCurrentUser, favorites } = useAppContext();
  const [, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 border-b transition-all duration-200"
      style={{
        backgroundColor: scrolled
          ? "color-mix(in oklab, var(--background) 88%, transparent)"
          : "color-mix(in oklab, var(--background) 97%, transparent)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottomColor: scrolled ? "rgba(0,18,121,0.1)" : "rgba(0,18,121,0.05)",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.07)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between">
        {/* Logo + links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Multaqa" className="h-14 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {[
              { href: "/desks", label: "Browse Desks" },
              { href: "/rooms", label: "Browse Rooms" },
              ...(currentUser ? [{ href: "/community", label: "Community" }] : []),
              { href: "/support", label: "Support", icon: <LifeBuoy className="w-4 h-4" /> },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium flex items-center gap-1.5 transition-colors"
                style={{ color: "#001279" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                onMouseLeave={e => (e.currentTarget.style.color = "#001279")}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                href="/desks"
                className="relative hidden md:flex items-center transition-colors"
                title="My Favourites"
                style={{ color: "#001279" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                onMouseLeave={e => (e.currentTarget.style.color = "#001279")}
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                    style={{ background: "#FF5100" }}
                  >
                    {favorites.length}
                  </span>
                )}
              </Link>

              <Link
                href="/my-reservations"
                className="text-sm font-medium hidden md:block transition-colors"
                style={{ color: "#001279" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                onMouseLeave={e => (e.currentTarget.style.color = "#001279")}
              >
                My Bookings
              </Link>

              <Link
                href="/onboarding"
                className="hidden md:flex items-center gap-1 text-xs transition-colors"
                title="Tutorial"
                style={{ color: "#001279", opacity: 0.5 }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FF5100"; e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#001279"; e.currentTarget.style.opacity = "0.5"; }}
              >
                <BookOpen className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/my-reservations")}>
                <Avatar className="w-8 h-8 border" style={{ borderColor: "#001279" + "33" }}>
                  <AvatarFallback className="text-white text-xs" style={{ background: "#FF5100" }}>
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex text-sm font-medium transition-colors"
                style={{ color: "#001279" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                onMouseLeave={e => (e.currentTarget.style.color = "#001279")}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/onboarding"
                className="hidden md:flex items-center gap-1 text-xs transition-colors"
                style={{ color: "#001279", opacity: 0.6 }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FF5100"; e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#001279"; e.currentTarget.style.opacity = "0.6"; }}
              >
                <BookOpen className="w-4 h-4" /> Tour
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium hidden md:block transition-colors"
                style={{ color: "#001279" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                onMouseLeave={e => (e.currentTarget.style.color = "#001279")}
              >
                Log In
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="text-white font-semibold rounded-lg px-5 border-0"
                  style={{ background: "#FF5100" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#e04800")}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#FF5100")}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  function handleLogout() {
    setCurrentUser(null);
    setLocation("/");
  }
}
