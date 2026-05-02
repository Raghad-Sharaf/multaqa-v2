import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingModal } from "@/components/OnboardingModal";

export default function Home() {
  const { desks, currentLocation } = useAppContext();

  const availableDesks = desks.filter(d => d.location === currentLocation && d.status === "Available").length;
  const totalDesks = desks.filter(d => d.location === currentLocation).length;

  return (
    <UserLayout>
      <OnboardingModal />

      {/* Hero Section */}
      <section className="relative overflow-hidden text-white" style={{
        background: "linear-gradient(135deg, #000840 0%, #001279 35%, #001C9E 65%, #0A22B0 100%)"
      }}>
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,81,0,0.18) 0%, transparent 70%)", transform: "translate(20%, -20%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,81,0,0.10) 0%, transparent 70%)", transform: "translate(-20%, 30%)" }} />
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "150px" }} />

        <div className="container mx-auto px-6 py-24 md:py-36 relative z-10 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-widest mb-8 uppercase">
              Coworking in Palestine
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white max-w-4xl leading-[1.05]">
              Your seat.{" "}
              <span style={{ color: "#FF5100" }}>Secured.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed">
              A warm, professional space for remote workers, freelancers, and students.
              Book your desk or meeting room in Nablus and Ramallah.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/desks">
                <Button size="lg" className="w-full sm:w-auto text-base h-14 px-10 rounded-xl shadow-xl shadow-[#FF5100]/20"
                  style={{ background: "#FF5100" }}>
                  Browse Desks
                </Button>
              </Link>
              <Link href="/rooms">
                <Button size="lg" variant="outline"
                  className="w-full sm:w-auto text-base h-14 px-10 bg-white/8 border-white/25 hover:bg-white/15 hover:text-white rounded-xl text-white backdrop-blur-sm">
                  Browse Rooms
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Counter */}
      <div className="relative -mt-8 z-20 container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white rounded-xl shadow-xl border border-border p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary" style={{ background: "#FFF0E8" }}>
              <ArmchairIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Live Availability</p>
              <p className="text-xl font-bold text-secondary">
                <span className="text-primary">{availableDesks}</span> of {totalDesks} seats available
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">Right now at Multaqa — {currentLocation}</p>
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to secure your productive space for the day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: "1. Browse", icon: <SearchIcon className="w-8 h-8" />, desc: "Find the perfect desk or room based on your needs — deep work or calls allowed." },
              { step: "2. Book", icon: <CalendarIcon className="w-8 h-8" />, desc: "Select your time, from one hour to a full day. Team, multi-day, and recurring options available." },
              { step: "3. Arrive", icon: <DoorOpenIcon className="w-8 h-8" />, desc: "Pay in cash on-site. Walk in, find your reserved spot, and start working." },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary" style={{ background: "#FFF0E8" }}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">{item.step}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-10 border-y border-border bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            {[
              { label: "Team Booking", desc: "Book adjacent seats for your whole team" },
              { label: "Multi-Day", desc: "Select multiple days in one checkout" },
              { label: "Recurring", desc: "Weekly or daily recurring reservations" },
              { label: "Favourites", desc: "Save preferred seats for quick rebooking" },
            ].map(f => (
              <div key={f.label} className="flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-secondary">{f.label}</span>
                <span className="text-xs text-muted-foreground">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-24 bg-muted border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Everything you need to do your best work.</h2>
              <div className="space-y-6">
                {[
                  { title: "Verified spaces & real photos", desc: "What you see is what you get. No surprises when you arrive." },
                  { title: "Transparent pricing", desc: "Pay per hour, half day, or full day. Clear rates, no hidden fees." },
                  { title: "Reliable amenities", desc: "Fast WiFi, standing desks, and monitors available where you need them." },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-secondary text-lg">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="/desk-1.png" alt="Coworking space" className="rounded-xl object-cover h-64 w-full" />
              <img src="/room-1.png" alt="Meeting room" className="rounded-xl object-cover h-64 w-full mt-8" />
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
}

function ArmchairIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/>
      <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/>
      <path d="M5 18v2"/><path d="M19 18v2"/>
    </svg>
  );
}
function SearchIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
}
function CalendarIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;
}
function DoorOpenIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/></svg>;
}
