import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, Booking } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { CheckCircle2, CalendarDays, MapPin, Clock, Info, Users, RefreshCw, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function BookingConfirmation() {
  const [, setLocation] = useLocation();
  const { desks, rooms, bookingDraft, setBookingDraft, currentUser } = useAppContext();

  const booking = bookingDraft as Booking;

  useEffect(() => {
    if (!booking || !booking.id) setLocation("/");
    return () => setBookingDraft(null);
  }, [booking, setLocation, setBookingDraft]);

  if (!booking || !booking.id) return null;

  const item = booking.itemType === "desk"
    ? desks.find(d => d.id === booking.itemId)
    : rooms.find(r => r.id === booking.itemId);

  if (!item) return null;

  const mode = booking.bookingMode || "single";

  const modeBanner: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    single: { label: "Single Booking", icon: <CalendarDays className="w-3.5 h-3.5" />, color: "bg-muted/60 text-secondary border-border" },
    "multi-day": { label: "Multi-Day Booking", icon: <Layers className="w-3.5 h-3.5" />, color: "bg-secondary/10 text-secondary border-secondary/20" },
    recurring: { label: "Recurring Booking", icon: <RefreshCw className="w-3.5 h-3.5" />, color: "bg-primary/10 text-primary border-primary/20" },
    team: { label: "Team Booking", icon: <Users className="w-3.5 h-3.5" />, color: "bg-success/10 text-success border-success/20" },
  };

  const mb = modeBanner[mode];

  return (
    <UserLayout>
      <div className="flex-1 py-8" style={{ background: "oklch(97% .01 268)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 max-w-3xl">

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            style={{ border: "1px solid oklch(90% .005 285)" }}
          >
            {/* Success header */}
            <div className="p-8 text-center border-b" style={{ background: "rgba(26,122,74,0.06)", borderColor: "rgba(26,122,74,0.15)" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                style={{ background: "#1A7A4A", boxShadow: "0 4px 14px rgba(26,122,74,0.25)" }}>
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-bold mb-2" style={{ fontSize: "26px", color: "#001279" }}>You're all set!</h1>

              <Badge variant="outline" className={`inline-flex items-center gap-1.5 mb-3 text-[12px] ${mb.color}`}>
                {mb.icon} {mb.label}
              </Badge>

              <p className="font-medium text-[13px] mb-4" style={{ color: "#1A7A4A" }}>
                Booking confirmed · Ref: {booking.id}
              </p>

              <div className="inline-flex bg-white py-1.5 px-3.5 rounded-lg border shadow-sm text-[13px]"
                style={{ borderColor: "oklch(90% .005 285)", color: "#001279" }}>
                Confirmation{mode === "team" ? "s" : ""} sent to <strong className="ml-1">{booking.guestEmail}</strong>
                {mode === "team" && booking.teamMembers && booking.teamMembers.filter(Boolean).length > 0
                  && ` + ${booking.teamMembers.filter(Boolean).length} team members`}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="font-bold mb-5 border-b pb-4" style={{ fontSize: "18px", color: "#001279", borderColor: "oklch(90% .005 285)" }}>
                Booking Details
              </h2>

              {/* Mode-specific banners */}
              {mode === "multi-day" && booking.multiDays && (
                <div className="mb-5 p-4 rounded-xl border" style={{ background: "rgba(0,18,121,0.04)", borderColor: "rgba(0,18,121,0.12)" }}>
                  <p className="text-[11px] uppercase font-bold tracking-wider mb-2.5" style={{ color: "#535060" }}>
                    Selected Days ({booking.multiDays.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.multiDays.map(d => (
                      <span key={d} className="text-white text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ background: "#001279" }}>
                        {format(parseISO(d), "EEE, MMM d")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {mode === "recurring" && (
                <div className="mb-5 p-4 rounded-xl border flex gap-3" style={{ background: "rgba(255,81,0,0.04)", borderColor: "rgba(255,81,0,0.15)" }}>
                  <RefreshCw className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#FF5100" }} />
                  <div>
                    <p className="font-semibold text-[13px] mb-0.5" style={{ color: "#001279" }}>
                      {booking.recurringPattern === "weekly" ? "Weekly" : "Daily"} schedule confirmed
                    </p>
                    <p className="text-[13px]" style={{ color: "#535060" }}>
                      Starting {format(parseISO(booking.date), "MMM d, yyyy")} · {booking.time} · Running until{" "}
                      {booking.recurringEndDate ? format(parseISO(booking.recurringEndDate), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                </div>
              )}

              {mode === "team" && booking.teamDeskIds && (
                <div className="mb-5 p-4 rounded-xl border" style={{ background: "rgba(26,122,74,0.04)", borderColor: "rgba(26,122,74,0.15)" }}>
                  <p className="text-[11px] uppercase font-bold tracking-wider mb-2.5" style={{ color: "#535060" }}>
                    Team Rooms Reserved ({booking.teamDeskIds.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {booking.teamDeskIds.map(id => (
                      <span key={id} className="text-white text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ background: "#1A7A4A" }}>
                        Room {id}
                      </span>
                    ))}
                  </div>
                  {booking.teamMembers && booking.teamMembers.filter(Boolean).length > 0 && (
                    <p className="text-[12px]" style={{ color: "#535060" }}>
                      Confirmations sent to: {booking.teamMembers.filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              )}

              {/* Detail grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "oklch(96% .02 268)" }}>
                      <MapPin className="w-4 h-4" style={{ color: "#001279" }} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold tracking-wider mb-0.5" style={{ color: "#535060" }}>Space</p>
                      <p className="font-bold text-[14px]" style={{ color: "#001279" }}>{item.name}</p>
                      <p className="text-[13px]" style={{ color: "#535060" }}>Multaqa — {booking.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "oklch(96% .02 268)" }}>
                      <CalendarDays className="w-4 h-4" style={{ color: "#001279" }} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold tracking-wider mb-0.5" style={{ color: "#535060" }}>Date</p>
                      <p className="font-bold text-[14px]" style={{ color: "#001279" }}>
                        {mode === "multi-day" && booking.multiDays
                          ? `${booking.multiDays.length} days selected`
                          : format(parseISO(booking.date), "EEEE, MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "oklch(96% .02 268)" }}>
                      <Clock className="w-4 h-4" style={{ color: "#001279" }} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold tracking-wider mb-0.5" style={{ color: "#535060" }}>Time</p>
                      <p className="font-bold text-[14px]" style={{ color: "#001279" }}>{booking.time}</p>
                      <p className="text-[13px]" style={{ color: "#535060" }}>{booking.duration}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{ background: "rgba(217,119,6,0.08)", borderColor: "rgba(217,119,6,0.2)" }}>
                      <span className="font-bold text-[11px]" style={{ color: "#D97706" }}>ILS</span>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold tracking-wider mb-0.5" style={{ color: "#535060" }}>Payment</p>
                      <p className="font-bold text-[14px]" style={{ color: "#001279" }}>{booking.totalPrice} ILS Total</p>
                      {booking.paymentDeadline && (
                        <p className="flex items-center gap-1 mt-0.5 text-[12px] font-medium" style={{ color: "#D97706" }}>
                          <Info className="w-3 h-3" /> Due on-site by {format(parseISO(booking.paymentDeadline), "MMM d")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!currentUser && (
                <div className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
                  style={{ background: "rgba(255,81,0,0.04)", borderColor: "rgba(255,81,0,0.12)" }}>
                  <div>
                    <h4 className="font-bold mb-0.5 text-[16px]" style={{ color: "#001279" }}>Save your booking history</h4>
                    <p className="text-[13px]" style={{ color: "#535060" }}>Create a free account to manage modifications and cancellations easily.</p>
                  </div>
                  <Link href="/register">
                    <Button variant="outline" className="shrink-0 h-9 text-[13px]" style={{ borderColor: "#FF5100", color: "#FF5100" }}>
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6 border-t" style={{ borderColor: "oklch(90% .005 285)" }}>
                {currentUser && (
                  <Link href="/my-reservations">
                    <Button variant="outline" className="w-full sm:w-auto min-w-[180px] h-11 text-[14px]" style={{ borderColor: "#001279", color: "#001279" }}>
                      View My Bookings
                    </Button>
                  </Link>
                )}
                <Link href="/">
                  <Button className="w-full sm:w-auto min-w-[180px] h-11 text-[14px]" style={{ background: "#FF5100" }}>
                    Browse More Spaces
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </UserLayout>
  );
}
