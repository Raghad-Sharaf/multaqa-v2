import { Link, useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { ReactNode } from "react";
import { LayoutDashboard, CalendarDays, DollarSign, Armchair, Building, LogOut, BarChart } from "lucide-react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, setCurrentUser } = useAppContext();
  const [location, setLocation] = useLocation();

  if (!currentUser || currentUser.role !== "admin") {
    setLocation("/login");
    return null;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setLocation("/");
  };

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "All Bookings", icon: CalendarDays },
    { href: "/admin/unpaid", label: "Unpaid Cash", icon: DollarSign },
    { href: "/admin/seats", label: "Seat Management", icon: Armchair },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-[#E8EBFF]">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Multaqa Admin</h2>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-md text-white/40 cursor-not-allowed">
            <Building className="w-5 h-5" />
            <span className="font-medium text-sm">Room Management</span>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-md text-white/40 cursor-not-allowed">
            <BarChart className="w-5 h-5" />
            <span className="font-medium text-sm">Analytics</span>
          </div>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
