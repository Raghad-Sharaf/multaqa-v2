import { ReactNode } from "react";
import { Link } from "wouter";
import { Navbar } from "./Navbar";

export function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-muted-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: "#001279" }} className="text-white pt-16 pb-8">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <img src="/logo.png" alt="Multaqa" className="h-10 w-auto mb-4 brightness-0 invert" />
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Palestine's first dedicated coworking booking platform. Your seat. Secured.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-xs font-bold">in</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-xs font-bold">ig</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-xs font-bold">x</a>
              </div>
            </div>

            {/* Spaces */}
            <div>
              <h4 className="font-bold text-white text-sm tracking-wide uppercase mb-4 opacity-50">Spaces</h4>
              <ul className="space-y-3">
                {[["Browse Desks", "/desks"], ["Browse Rooms", "/rooms"], ["Nablus Location", "/desks"], ["Ramallah Location", "/rooms"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-white/60 hover:text-white text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-white text-sm tracking-wide uppercase mb-4 opacity-50">Platform</h4>
              <ul className="space-y-3">
                {[["How it Works", "/onboarding"], ["My Reservations", "/my-reservations"], ["Community", "/community"], ["Support", "/support"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-white/60 hover:text-white text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white text-sm tracking-wide uppercase mb-4 opacity-50">Contact</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li>support@multaqa.ps</li>
                <li>+970 599 000 000</li>
                <li>Sun–Thu, 9 AM – 6 PM</li>
                <li className="pt-2">
                  <Link href="/support" className="inline-flex items-center gap-2 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "#FF5100" }}>
                    Submit a Ticket →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© {new Date().getFullYear()} Multaqa — Coworking & Booking. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-white/40">
              <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white/70 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
