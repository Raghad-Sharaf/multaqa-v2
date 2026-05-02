import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { CheckCircle2, Wifi, Coffee, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { desks, currentLocation } = useAppContext();
  
  const availableDesks = desks.filter(d => d.location === currentLocation && d.status === "Available").length;
  const totalDesks = desks.filter(d => d.location === currentLocation).length;

  return (
    <UserLayout>
      {/* Hero Section */}
      <section className="bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-[#001D99] z-0" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none mix-blend-overlay" />
        
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-medium tracking-wide mb-6 uppercase">
              Coworking in Palestine
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white max-w-4xl leading-tight">
              Your seat. <span className="text-primary">Secured.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              A warm, professional space for remote workers, freelancers, and students. 
              Book your desk or meeting room in Nablus and Ramallah.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/desks">
                <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20">
                  Browse Desks
                </Button>
              </Link>
              <Link href="/rooms">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 bg-white/5 border-white/20 hover:bg-white/10 hover:text-white rounded-lg text-white">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-xl border border-border p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary">
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
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent text-primary flex items-center justify-center mb-6">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">1. Browse</h3>
              <p className="text-muted-foreground">Find the perfect desk or room based on your needs — deep work or calls allowed.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent text-primary flex items-center justify-center mb-6">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">2. Book</h3>
              <p className="text-muted-foreground">Select your time, from one hour to a full day. No account required to start.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent text-primary flex items-center justify-center mb-6">
                <DoorOpenIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">3. Arrive</h3>
              <p className="text-muted-foreground">Pay in cash on-site. Walk in, find your reserved spot, and start working.</p>
            </div>
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
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-secondary text-lg">Verified spaces & real photos</h4>
                    <p className="text-muted-foreground">What you see is what you get. No surprises when you arrive.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-secondary text-lg">Transparent pricing</h4>
                    <p className="text-muted-foreground">Pay per hour, half day, or full day. Clear rates, no hidden fees.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-secondary text-lg">Reliable amenities</h4>
                    <p className="text-muted-foreground">Fast WiFi, standing desks, and monitors available where you need them.</p>
                  </div>
                </div>
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
      <path d="M5 18v2"/>
      <path d="M19 18v2"/>
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  )
}

function CalendarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
  )
}

function DoorOpenIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/></svg>
  )
}
