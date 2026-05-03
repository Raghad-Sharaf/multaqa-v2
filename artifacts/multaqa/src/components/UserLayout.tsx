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

type FooterVariant = "white" | "light" | "dark";

export function UserLayout({ children, footerVariant = "light" }: { children: ReactNode; footerVariant?: FooterVariant }) {

  const footerBg =
    footerVariant === "white" ? "#ffffff"
    : footerVariant === "dark"  ? "#0D1117"
    : "oklch(95% .03 268)";

  const isDark = footerVariant === "dark";
  const isWhite = footerVariant === "white";

  const textMuted = isDark ? "rgba(255,255,255,0.5)" : "#535060";
  const textLink  = isDark ? "rgba(255,255,255,0.65)" : "#535060";
  const heading   = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,18,121,0.45)";
  const borderTop = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,18,121,0.09)";
  const divider   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,18,121,0.09)";
  const copy      = isDark ? "rgba(255,255,255,0.3)"  : "rgba(0,18,121,0.4)";
  const iconBg    = isDark ? "rgba(255,255,255,0.06)" : (isWhite ? "#F5F5F5" : "rgba(255,255,255,0.7)");
  const iconColor = isDark ? "rgba(255,255,255,0.5)"  : "#001279";
  const iconBorder= isDark ? "rgba(255,255,255,0.12)" : "rgba(0,18,121,0.18)";
  const logoClass = isDark ? "h-10 sm:h-14 w-auto mb-4 brightness-0 invert" : "h-10 sm:h-14 w-auto mb-4";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-muted-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="pt-14 pb-8 border-t" style={{ background: footerBg, borderTopColor: borderTop }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <img src="/logo.png" alt="Multaqa" className={logoClass} />
              <p className="text-sm leading-relaxed mb-5" style={{ color: textMuted }}>
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
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all border"
                    style={{ color: iconColor, borderColor: iconBorder, background: iconBg }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#FF5100";
                      (e.currentTarget as HTMLAnchorElement).style.color = "white";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#FF5100";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = iconBg;
                      (e.currentTarget as HTMLAnchorElement).style.color = iconColor;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = iconBorder;
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Spaces */}
            <div>
              <h4 className="font-bold text-xs tracking-widest uppercase mb-4" style={{ color: heading }}>Spaces</h4>
              <ul className="space-y-3">
                {[["Browse Desks", "/desks"], ["Browse Rooms", "/rooms"], ["Nablus Location", "/desks"], ["Ramallah Location", "/rooms"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm transition-colors" style={{ color: textLink }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                      onMouseLeave={e => (e.currentTarget.style.color = textLink)}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-xs tracking-widest uppercase mb-4" style={{ color: heading }}>Platform</h4>
              <ul className="space-y-3">
                {[["How it Works", "/onboarding"], ["My Reservations", "/my-reservations"], ["Community", "/community"], ["Support", "/support"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm transition-colors" style={{ color: textLink }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                      onMouseLeave={e => (e.currentTarget.style.color = textLink)}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-xs tracking-widest uppercase mb-4" style={{ color: heading }}>Contact</h4>
              <ul className="space-y-3 text-sm" style={{ color: textLink }}>
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

          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: divider }}>
            <p className="text-xs" style={{ color: copy }}>
              © {new Date().getFullYear()} Multaqa — Coworking &amp; Booking. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs" style={{ color: copy }}>
              {["Privacy Policy", "Terms of Service", "Sitemap"].map(t => (
                <a key={t} href="#" className="transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                  onMouseLeave={e => (e.currentTarget.style.color = copy)}
                >{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
