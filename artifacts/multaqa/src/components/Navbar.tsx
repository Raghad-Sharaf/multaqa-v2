import { Link, useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, LifeBuoy, BookOpen } from "lucide-react";

export function Navbar() {
  const { currentUser, setCurrentUser, favorites } = useAppContext();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    setCurrentUser(null);
    setLocation("/");
  };

  return (
    <nav className="bg-secondary text-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Multaqa
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/desks" className="text-sm font-medium hover:text-accent transition-colors">
            Browse Desks
          </Link>
          <Link href="/rooms" className="text-sm font-medium hover:text-accent transition-colors">
            Browse Rooms
          </Link>
          {currentUser && (
            <Link href="/community" className="text-sm font-medium hover:text-accent transition-colors">
              Community
            </Link>
          )}
          <Link href="/support" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <LifeBuoy className="w-4 h-4" /> Support
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3">
            {/* Favourites badge */}
            <Link href="/desks" className="relative hidden md:flex items-center text-white/70 hover:text-white transition-colors" title="My Favourites">
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full text-[9px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link href="/my-reservations" className="text-sm font-medium hover:text-accent transition-colors hidden md:block">
              My Bookings
            </Link>

            <Link href="/onboarding" className="hidden md:flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors" title="Tutorial">
              <BookOpen className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/my-reservations")}>
              <Avatar className="w-8 h-8 border border-white/20">
                <AvatarFallback className="bg-primary text-white text-xs">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:text-accent hover:bg-white/10 hidden md:flex">
              Log Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/onboarding" className="hidden md:flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors">
              <BookOpen className="w-4 h-4" /> Tour
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-accent transition-colors hidden md:block">
              Log In
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-white text-secondary hover:bg-accent hover:text-primary">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
