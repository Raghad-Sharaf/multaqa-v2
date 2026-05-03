import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import {
  CheckCircle2, Users, Layers, RefreshCw, Heart,
  MessageSquare, BellRing, ArrowRight, Search, Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingModal } from "@/components/OnboardingModal";

const features = [
  {
    icon: <Users className="w-5 h-5" />,
    title: "Team Booking",
    desc: "Reserve adjacent desks for your whole team in one checkout. Confirmation sent to every member automatically.",
    color: "#001279", bg: "#E8EBFF",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Multi-Day Booking",
    desc: "Pick multiple days at once. One checkout, one confirmation — for the entire stretch you need.",
    color: "#1A7A4A", bg: "#E6F5EC",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Recurring Reservations",
    desc: "Set a weekly or daily schedule and your seat is secured automatically — no rebooking needed.",
    color: "#FF5100", bg: "#FFF0E8",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Favourite Seats",
    desc: "Heart any desk or room to save it. Next visit, your preferred spot is just one tap away.",
    color: "#CC1A00", bg: "#FFEAE8",
  },
  {
    icon: <BellRing className="w-5 h-5" />,
    title: "Waitlist",
    desc: "Fully booked? Join the waitlist. We notify you the moment a cancellation opens your preferred slot.",
    color: "#8B5CF6", bg: "#F3F0FF",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Customer Support",
    desc: "Reach us via the in-app support form. Track your tickets and get answers within 24 hours.",
    color: "#1A7A4A", bg: "#E6F5EC",
  },
];

const steps = [
  {
    num: "1",
    icon: <Search className="w-5 h-5" />,
    title: "Browse",
    desc: "Filter desks and rooms by zone, type, and location. See real-time availability.",
  },
  {
    num: "2",
    icon: <Calendar className="w-5 h-5" />,
    title: "Book",
    desc: "Pick your date, time and booking mode — single, multi-day, recurring or team.",
  },
  {
    num: "3",
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: "Arrive",
    desc: "Walk in, find your reserved spot, and pay in cash on-site. That's it.",
  },
];

export default function Home() {
  const { desks, currentLocation } = useAppContext();

  const availableDesks = desks.filter(
    (d) => d.location === currentLocation && d.status === "Available"
  ).length;
  const totalDesks = desks.filter((d) => d.location === currentLocation).length;

  return (
    <UserLayout footerVariant="white">
      <OnboardingModal />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom right, oklch(95% .04 268), oklch(100% 0 0) 50%, oklch(97% .03 50))",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,18,121,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="w-full max-w-6xl mx-auto px-6 md:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* ── Left ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-5"
            >
              {/* Live badge */}
              <div className="self-start">
                <span
                  className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border"
                  style={{
                    color: "#001279",
                    background: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(0,18,121,0.13)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  Live availability across Nablus &amp; Ramallah
                </span>
              </div>

              {/* Headline — 60px on desktop */}
              <div className="-mb-1">
                <h1
                  className="font-extrabold leading-[1.06] tracking-tight"
                  style={{ fontSize: "clamp(40px, 5vw, 60px)", color: "#001279" }}
                >
                  Your seat.
                </h1>
                <h1
                  className="font-extrabold leading-[1.06] tracking-tight"
                  style={{ fontSize: "clamp(40px, 5vw, 60px)", color: "#FF5100" }}
                >
                  Secured.
                </h1>
              </div>

              {/* Description */}
              <p className="leading-relaxed max-w-md" style={{ color: "#535060", fontSize: "18px" }}>
                Browse our desks and rooms, check live availability, and lock in your
                spot before you leave home. No more walk-in surprises.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="/desks">
                  <Button
                    size="lg"
                    className="h-12 px-7 rounded-xl text-white font-semibold text-sm flex items-center gap-2 border-0"
                    style={{ background: "#FF5100", boxShadow: "0 6px 20px rgba(255,81,0,.28)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#e04800")}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#FF5100")}
                  >
                    Browse Desks <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/rooms">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-7 rounded-xl font-semibold text-sm transition-colors"
                    style={{ color: "#001279", borderColor: "rgba(0,18,121,0.35)", background: "transparent" }}
                    onMouseEnter={e => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.background = "#001279";
                      b.style.color = "white";
                      b.style.borderColor = "#001279";
                    }}
                    onMouseLeave={e => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.background = "transparent";
                      b.style.color = "#001279";
                      b.style.borderColor = "rgba(0,18,121,0.35)";
                    }}
                  >
                    Browse Rooms
                  </Button>
                </Link>
              </div>

              {/* Availability card */}
              <div
                className="inline-flex items-center gap-3 self-start rounded-2xl px-4 py-3 border"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  borderColor: "rgba(0,18,121,0.09)",
                  boxShadow: "0 2px 12px rgba(0,18,121,0.07)",
                  maxWidth: "320px",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#E6F5EC" }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: "#1A7A4A" }} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-snug" style={{ color: "#001279" }}>
                    18 of 30 seats available right now
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#535060" }}>
                    at Multaqa {currentLocation} · updated just now
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Right: photo ── */}
            <motion.div
              initial={{ opacity: 0, x: 24, y: 6 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="hidden lg:flex items-center justify-end"
            >
              <div
                className="rounded-[2.25rem] p-3"
                style={{
                  background: "oklch(93% .04 50)",
                  boxShadow: "0 20px 60px rgba(0,18,121,0.10), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src="/desk-1.png"
                  alt="Multaqa coworking space"
                  className="rounded-[1.75rem] object-cover block"
                  style={{ height: "340px", width: "560px" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#001279" }}>
              Book in 3 steps
            </h2>
            <p style={{ color: "#535060" }}>
              From browsing to confirmed booking in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="bg-white rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-200 cursor-default"
                style={{ borderColor: "rgba(0,18,121,0.1)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#FF5100";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(255,81,0,0.1)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,18,121,0.1)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#FFF0E8", color: "#FF5100" }}
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#535060" }}>
                    STEP {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#001279" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#535060" }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features 3×2 Grid ── */}
      <section className="py-20" style={{ backgroundColor: "var(--navy-tint)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#001279" }}>
              Everything you need
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#535060" }}>
              From team collaboration to personal productivity — Multaqa has the tools to
              make every session seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.32, delay: (i % 3) * 0.07 }}
                className="group bg-white rounded-2xl border p-6 flex flex-col gap-4 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-default"
                style={{ borderColor: "rgba(0,18,121,0.08)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
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

      {/* ── Why Multaqa ── */}
      <section className="py-20 bg-white border-t" style={{ borderColor: "rgba(0,18,121,0.07)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: "#001279" }}>
                Why Multaqa
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Verified spaces & real photos", desc: "What you see is what you get. No surprises when you arrive." },
                  { title: "Transparent pricing", desc: "Pay per hour, half day, or full day. Clear rates, no hidden fees." },
                  { title: "Reliable amenities", desc: "Fast WiFi, standing desks, and monitors available where you need them." },
                ].map((item) => (
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
                    className="h-12 px-8 rounded-xl text-white font-semibold border-0 focus:ring-0 focus:outline-none"
                    style={{ background: "#001279", border: "none", boxShadow: "none" }}
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
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(94% .05 268) 0%, oklch(99% .01 268) 50%, oklch(96% .04 50) 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#001279" }}>
            Ready to book your space?
          </h2>
          <p className="mb-10 max-w-xl mx-auto text-lg" style={{ color: "#535060" }}>
            Join hundreds of professionals working smarter across Nablus and Ramallah.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/desks">
              <Button
                size="lg"
                className="h-12 px-7 rounded-xl text-white font-semibold text-sm flex items-center gap-2 border-0"
                style={{ background: "#FF5100", boxShadow: "0 6px 20px rgba(255,81,0,.28)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#e04800")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#FF5100")}
              >
                Browse Desks <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/rooms">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 rounded-xl font-semibold text-sm transition-colors"
                style={{ color: "#001279", borderColor: "rgba(0,18,121,0.35)", background: "transparent" }}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "#001279";
                  b.style.color = "white";
                  b.style.borderColor = "#001279";
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "transparent";
                  b.style.color = "#001279";
                  b.style.borderColor = "rgba(0,18,121,0.35)";
                }}
              >
                Browse Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </UserLayout>
  );
}
