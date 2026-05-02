import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { CheckCircle2, Users, Layers, RefreshCw, Heart, BarChart3, MessageSquare, BellRing, BookOpen, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingModal } from "@/components/OnboardingModal";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Booking",
    desc: "Reserve adjacent desks for your whole team in one checkout. Confirmation sent to every member automatically.",
    color: "#001279",
    bg: "#E8EBFF",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Multi-Day Booking",
    desc: "Pick multiple days at once. One checkout, one confirmation — for the entire stretch you need.",
    color: "#1A7A4A",
    bg: "#E6F5EC",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Recurring Reservations",
    desc: "Set a weekly or daily schedule and your seat is secured automatically — no rebooking needed.",
    color: "#FF5100",
    bg: "#FFF0E8",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Favourite Seats",
    desc: "Heart any desk or room to save it. Next visit, your preferred spot is just one tap away.",
    color: "#CC1A00",
    bg: "#FFEAE8",
  },
  {
    icon: <BellRing className="w-6 h-6" />,
    title: "Waitlist",
    desc: "Fully booked? Join the waitlist. We notify you the moment a cancellation opens your preferred slot.",
    color: "#8B5CF6",
    bg: "#F3F0FF",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Analytics & Reporting",
    desc: "Admins get real-time revenue charts, occupancy heatmaps, drop-off funnels, and popular seat rankings.",
    color: "#001279",
    bg: "#E8EBFF",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Customer Support",
    desc: "Reach us via the in-app support form. Track your tickets and get answers within 24 hours.",
    color: "#1A7A4A",
    bg: "#E6F5EC",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Guided Onboarding",
    desc: "A quick interactive tour and explainer video walks new users through every feature in under 2 minutes.",
    color: "#FF5100",
    bg: "#FFF0E8",
  },
];

export default function Home() {
  const { desks, currentLocation } = useAppContext();

  const availableDesks = desks.filter(d => d.location === currentLocation && d.status === "Available").length;
  const totalDesks = desks.filter(d => d.location === currentLocation).length;

  return (
    <UserLayout>
      <OnboardingModal />

      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(to bottom right, oklch(95% .04 268), oklch(100% 0 0) 50%, oklch(97% .03 50))",
        }}
      >
        {/* Soft grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40' fill='none' stroke='%23001279' stroke-width='0.5'/%3E%3C/svg%3E\")",
            backgroundSize: "40px 40px",
          }} />

        <div className="container mx-auto px-6 py-24 md:py-36 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span
                className="inline-block py-1.5 px-4 rounded-full text-xs font-semibold tracking-widest mb-8 uppercase border"
                style={{ background: "#E8EBFF", color: "#001279", borderColor: "#001279" + "22" }}
              >
                Coworking in Palestine
              </span>

              <h1
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
                style={{ color: "#001279" }}
              >
                Your seat.{" "}
                <span style={{ color: "#FF5100" }}>Secured.</span>
              </h1>

              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: "#535060" }}>
                A warm, professional space for remote workers, freelancers, and students. Book your desk or meeting room in Nablus and Ramallah — in under a minute.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/desks">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base h-14 px-10 rounded-xl shadow-lg text-white font-semibold"
                    style={{ background: "#FF5100", boxShadow: "0 8px 24px rgba(255,81,0,.25)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#e04800")}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#FF5100")}
                  >
                    Browse Desks
                  </Button>
                </Link>
                <Link href="/rooms">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base h-14 px-10 rounded-xl font-semibold"
                    style={{ color: "#001279", borderColor: "#001279" + "40" }}
                  >
                    Browse Rooms <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live availability card */}
        <div className="container mx-auto px-6 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border flex items-center gap-5 p-5"
            style={{ borderColor: "#001279" + "15" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#FFF0E8" }}
            >
              <MapPin className="w-5 h-5" style={{ color: "#FF5100" }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#535060" }}>
                Live Availability · {currentLocation}
              </p>
              <p className="font-bold text-lg" style={{ color: "#001279" }}>
                <span style={{ color: "#FF5100" }}>{availableDesks}</span> of {totalDesks} desks available right now
              </p>
            </div>
            <div className="ml-auto">
              <span className="w-3 h-3 rounded-full bg-emerald-400 flex items-center justify-center animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#FF5100" }}>Simple process</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4" style={{ color: "#001279" }}>Book in 3 steps</h2>
            <p className="max-w-xl mx-auto" style={{ color: "#535060" }}>From browsing to confirmed booking in under 60 seconds — no account required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: "01", title: "Browse", desc: "Filter desks and rooms by zone, type, and location. See real-time availability." },
              { num: "02", title: "Book", desc: "Pick your date, time and booking mode — single, multi-day, recurring or team." },
              { num: "03", title: "Arrive", desc: "Walk in, find your reserved spot, and pay in cash on-site. That's it." },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center group">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 font-black text-2xl transition-transform group-hover:scale-105"
                  style={{ background: "#E8EBFF", color: "#001279" }}
                >
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#001279" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#535060" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features 2×4 Grid ── */}
      <section
        className="py-24"
        style={{ backgroundImage: "linear-gradient(to bottom, oklch(97% .02 268), oklch(100% 0 0))" }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#FF5100" }}>Platform features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4" style={{ color: "#001279" }}>
              Everything your workspace needs
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#535060" }}>
              From team collaboration to personal productivity — Multaqa has the tools to make every session seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.07 }}
                className="group bg-white rounded-2xl border p-7 flex flex-col gap-4 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-default"
                style={{ borderColor: "#001279" + "12" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1.5" style={{ color: "#001279" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#535060" }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / Why Multaqa ── */}
      <section className="py-24 bg-white border-t" style={{ borderColor: "#001279" + "10" }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#FF5100" }}>Why Multaqa</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-8" style={{ color: "#001279" }}>
                Everything you need to do your best work.
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Verified spaces & real photos", desc: "What you see is what you get. No surprises when you arrive." },
                  { title: "Transparent pricing", desc: "Pay per hour, half day, or full day. Clear rates, no hidden fees." },
                  { title: "Reliable amenities", desc: "Fast WiFi, standing desks, and monitors available where you need them." },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" style={{ color: "#1A7A4A" }} />
                    <div>
                      <h4 className="font-bold text-base mb-1" style={{ color: "#001279" }}>{item.title}</h4>
                      <p className="text-sm" style={{ color: "#535060" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link href="/desks">
                  <Button
                    size="lg"
                    className="h-12 px-8 rounded-xl text-white font-semibold"
                    style={{ background: "#001279" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#001899")}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#001279")}
                  >
                    Find your desk <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img src="/desk-1.png" alt="Coworking space" className="rounded-2xl object-cover h-64 w-full shadow-md" />
              <img src="/room-1.png" alt="Meeting room" className="rounded-2xl object-cover h-64 w-full shadow-md mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-20"
        style={{ backgroundImage: "linear-gradient(135deg, #000840, #001279 50%, #001D99)" }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to book your space?</h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg">Join hundreds of professionals working smarter across Nablus and Ramallah.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/desks">
              <Button size="lg" className="h-14 px-10 text-base text-white font-semibold rounded-xl shadow-lg"
                style={{ background: "#FF5100", boxShadow: "0 8px 24px rgba(255,81,0,0.35)" }}>
                Browse Desks
              </Button>
            </Link>
            <Link href="/rooms">
              <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-xl font-semibold text-white border-white/30 hover:bg-white/10">
                Browse Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </UserLayout>
  );
}
