import { Link, useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { currentUser, setCurrentUser, currentLocation, setCurrentLocation } = useAppContext();
  const [location, setLocation] = useLocation();

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
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-4">
            <Link href="/my-reservations" className="text-sm font-medium hover:text-accent transition-colors hidden md:block">
              My Bookings
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
