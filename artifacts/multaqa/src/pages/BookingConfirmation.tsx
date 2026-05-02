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
    single: { label: "Single Booking", icon: <CalendarDays className="w-4 h-4" />, color: "bg-muted/60 text-secondary border-border" },
    "multi-day": { label: "Multi-Day Booking", icon: <Layers className="w-4 h-4" />, color: "bg-secondary/10 text-secondary border-secondary/20" },
    recurring: { label: "Recurring Booking", icon: <RefreshCw className="w-4 h-4" />, color: "bg-primary/10 text-primary border-primary/20" },
    team: { label: "Team Booking", icon: <Users className="w-4 h-4" />, color: "bg-success/10 text-success border-success/20" },
  };

  const mb = modeBanner[mode];

  return (
    <UserLayout>
      <div className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-6 max-w-3xl">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-border shadow-xl overflow-hidden"
          >
            <div className="bg-success/10 p-10 text-center border-b border-success/20">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-secondary mb-2">You're all set!</h1>

              <Badge variant="outline" className={`inline-flex items-center gap-1.5 mb-4 ${mb.color}`}>
                {mb.icon} {mb.label}
              </Badge>

              <p className="text-success font-medium mb-6">Booking confirmed • Ref: {booking.id}</p>

              <div className="inline-flex bg-white py-2 px-4 rounded-lg border border-border shadow-sm text-sm text-secondary">
                Confirmation{mode === "team" ? "s" : ""} sent to <strong>&nbsp;{booking.guestEmail}</strong>
                {mode === "team" && booking.teamMembers && booking.teamMembers.filter(Boolean).length > 0 && ` + ${booking.teamMembers.filter(Boolean).length} team members`}
              </div>
            </div>

            <div className="p-8 md:p-10">
              <h2 className="text-xl font-bold text-secondary mb-6 border-b border-border pb-4">Booking Details</h2>

              {/* Mode-specific summary */}
              {mode === "multi-day" && booking.multiDays && (
                <div className="mb-6 bg-secondary/5 p-4 rounded-xl border border-secondary/15">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-3">Selected Days ({booking.multiDays.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.multiDays.map(d => (
                      <span key={d} className="bg-secondary text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                        {format(parseISO(d), "EEE, MMM d")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {mode === "recurring" && (
                <div className="mb-6 bg-primary/5 p-4 rounded-xl border border-primary/15 flex gap-3">
                  <RefreshCw className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-secondary text-sm mb-1">
                      {booking.recurringPattern === "weekly" ? "Weekly" : "Daily"} schedule confirmed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Starting {format(parseISO(booking.date), "MMM d, yyyy")} · {booking.time} ·
                      {" "}Running until {booking.recurringEndDate ? format(parseISO(booking.recurringEndDate), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                </div>
              )}

              {mode === "team" && booking.teamDeskIds && (
                <div className="mb-6 bg-success/5 p-4 rounded-xl border border-success/15">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-3">
                    Team Desks Reserved ({booking.teamDeskIds.length})
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {booking.teamDeskIds.map(id => (
                      <span key={id} className="bg-success text-white text-xs font-semibold px-2.5 py-1 rounded-md">Desk {id}</span>
                    ))}
                  </div>
                  {booking.teamMembers && booking.teamMembers.filter(Boolean).length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Confirmations sent to: {booking.teamMembers.filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-semibold mb-1">Space</p>
                      <p className="font-bold text-secondary text-lg">{item.name}</p>
                      <p className="text-muted-foreground">Multaqa — {booking.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-semibold mb-1">Date</p>
                      <p className="font-bold text-secondary text-lg">
                        {mode === "multi-day" && booking.multiDays
                          ? `${booking.multiDays.length} days selected`
                          : format(parseISO(booking.date), "EEEE, MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-semibold mb-1">Time</p>
                      <p className="font-bold text-secondary text-lg">{booking.time}</p>
                      <p className="text-muted-foreground">{booking.duration}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center shrink-0 border border-warning/30">
                      <span className="font-bold text-warning text-sm">ILS</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-semibold mb-1">Payment</p>
                      <p className="font-bold text-secondary text-lg">{booking.totalPrice} ILS Total</p>
                      {booking.paymentDeadline && (
                        <p className="text-warning font-medium text-sm flex items-center gap-1 mt-1">
                          <Info className="w-3.5 h-3.5" /> Due on-site by {format(parseISO(booking.paymentDeadline), "MMM d")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!currentUser && (
                <div className="bg-accent/30 p-6 rounded-xl border border-accent flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 mt-4">
                  <div>
                    <h4 className="font-bold text-secondary text-lg mb-1">Save your booking history</h4>
                    <p className="text-sm text-muted-foreground">Create a free account to manage modifications and cancellations easily.</p>
                  </div>
                  <Link href="/register">
                    <Button variant="outline" className="bg-white border-primary text-primary hover:bg-accent shrink-0">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-8 border-t border-border">
                {currentUser && (
                  <Link href="/my-reservations">
                    <Button variant="outline" className="w-full sm:w-auto min-w-[200px] h-12 border-secondary text-secondary hover:bg-muted">
                      View My Bookings
                    </Button>
                  </Link>
                )}
                <Link href="/">
                  <Button className="w-full sm:w-auto min-w-[200px] h-12 bg-primary hover:bg-primary/90 text-white">
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
