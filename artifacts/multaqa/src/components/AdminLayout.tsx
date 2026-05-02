import { Link, useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { ReactNode } from "react";
import { LayoutDashboard, CalendarDays, DollarSign, Armchair, Building2, LogOut, BarChart3, PlusCircle } from "lucide-react";

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
    { href: "/admin/create-booking", label: "Create Booking", icon: PlusCircle },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-[#E8EBFF]">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Multaqa Admin</h2>
          <p className="text-xs text-white/50 mt-1">Space Management</p>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-1 px-4">
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

          <div className="flex items-center gap-3 px-4 py-3 rounded-md text-white/30 cursor-not-allowed mt-1">
            <Building2 className="w-5 h-5" />
            <span className="font-medium text-sm">Room Management</span>
            <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded">Soon</span>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">A</div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-white/50 truncate">admin@multaqa.ps</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
