import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Play, Users, CalendarDays, RefreshCw, Heart, ArrowRight } from "lucide-react";

export default function Onboarding() {
  const { setHasSeenOnboarding } = useAppContext();

  return (
    <UserLayout>
      <div className="py-16 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-4">Welcome to Multaqa</span>
            <h1 className="text-4xl font-bold text-secondary mb-4">Your seat. Secured.</h1>
            <p className="text-muted-foreground text-lg">Here's everything you need to know to get started with Multaqa's coworking platform.</p>
          </div>

          {/* Explainer video */}
          <div className="rounded-2xl overflow-hidden mb-12 shadow-xl border border-border aspect-video flex flex-col items-center justify-center relative"
            style={{ background: "linear-gradient(135deg,#000840,#001279)" }}>
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 shadow-2xl shadow-primary/40 cursor-pointer hover:scale-105 transition-transform">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
            <p className="text-white font-bold text-lg">Watch the 90-second tour</p>
            <p className="text-white/50 text-sm mt-1">Placeholder — embed your YouTube/Vimeo URL here</p>
            <div className="absolute bottom-4 right-4 bg-white/10 px-3 py-1 rounded text-white/60 text-xs">1:30</div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: <CalendarDays className="w-6 h-6" />,
                title: "Book in 3 steps",
                desc: "Browse, pick your time, confirm. No account needed to start. Takes under 60 seconds.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Booking",
                desc: "Reserve multiple adjacent desks for your group. Confirmation sent to all team members automatically.",
              },
              {
                icon: <RefreshCw className="w-6 h-6" />,
                title: "Recurring & Multi-Day",
                desc: "Lock in your desk every week or book multiple days at once with a single checkout.",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Favourites & Waitlist",
                desc: "Save your favourite desks and join a waitlist when a slot is fully booked.",
              },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-border shadow-sm p-6 flex gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-primary shrink-0" style={{ background: "#FFF0E8" }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-secondary mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/desks" onClick={() => setHasSeenOnboarding(true)}>
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 bg-primary hover:bg-primary/90 text-white font-semibold">
                Browse Desks <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/rooms" onClick={() => setHasSeenOnboarding(true)}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 border-secondary text-secondary hover:bg-muted font-semibold">
                Browse Rooms
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
