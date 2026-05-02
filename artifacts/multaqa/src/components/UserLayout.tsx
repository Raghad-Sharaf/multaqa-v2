import { ReactNode } from "react";
import { Link } from "wouter";
import { Navbar } from "./Navbar";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-muted-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="pt-16 pb-8 border-t" style={{ backgroundColor: "var(--navy-tint)", borderTopColor: "rgba(0,18,121,0.1)" }}>
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <img src="/logo.png" alt="Multaqa" className="h-10 w-auto mb-4" />
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#535060" }}>
                Palestine's first dedicated coworking booking platform. Your seat. Secured.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>, label: "LinkedIn" },
                  { icon: <InstagramIcon />, label: "Instagram" },
                  { icon: <FacebookIcon />, label: "Facebook" },
                ].map(({ icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors border"
                    style={{ color: "#001279", borderColor: "rgba(0,18,121,0.2)", background: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#001279";
                      (e.currentTarget as HTMLAnchorElement).style.color = "white";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#001279";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.6)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#001279";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,18,121,0.2)";
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Spaces */}
            <div>
              <h4 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: "#001279", opacity: 0.5 }}>Spaces</h4>
              <ul className="space-y-3">
                {[["Browse Desks", "/desks"], ["Browse Rooms", "/rooms"], ["Nablus Location", "/desks"], ["Ramallah Location", "/rooms"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm transition-colors" style={{ color: "#535060" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#535060")}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: "#001279", opacity: 0.5 }}>Platform</h4>
              <ul className="space-y-3">
                {[["How it Works", "/onboarding"], ["My Reservations", "/my-reservations"], ["Community", "/community"], ["Support", "/support"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm transition-colors" style={{ color: "#535060" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#535060")}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: "#001279", opacity: 0.5 }}>Contact</h4>
              <ul className="space-y-3 text-sm" style={{ color: "#535060" }}>
                <li>support@multaqa.ps</li>
                <li>+970 599 000 000</li>
                <li>Sun–Thu, 9 AM – 6 PM</li>
                <li className="pt-2">
                  <Link href="/support"
                    className="inline-flex items-center gap-2 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "#FF5100" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#e04800")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
                  >
                    Submit a Ticket →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(0,18,121,0.1)" }}>
            <p className="text-sm" style={{ color: "#535060", opacity: 0.7 }}>
              © {new Date().getFullYear()} Multaqa — Coworking &amp; Booking. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs" style={{ color: "#535060" }}>
              {["Privacy Policy", "Terms of Service", "Sitemap"].map(t => (
                <a key={t} href="#" className="transition-colors hover:opacity-100" style={{ opacity: 0.7 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#535060")}
                >{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
