import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday, isPast, isSameDay } from "date-fns";
import { ArrowLeft, Clock, Calendar as CalendarIcon, Info } from "lucide-react";
import { NotFound } from "@/pages/not-found";

export default function ModifyBooking() {
  const [match, params] = useRoute("/my-reservations/modify/:id");
  const [, setLocation] = useLocation();
  const { bookings, desks, rooms, setBookings, currentUser } = useAppContext();
  
  if (!currentUser) {
    setLocation("/login");
    return null;
  }
  
  if (!match || !params.id) return <NotFound />;
  
  const booking = bookings.find(b => b.id === params.id && b.userId === currentUser.id);
  if (!booking) return <NotFound />;

  const item = booking.itemType === "desk" 
    ? desks.find(d => d.id === booking.itemId) 
    : rooms.find(r => r.id === booking.itemId);
    
  if (!item) return <NotFound />;

  const [date, setDate] = useState<Date | undefined>(new Date(booking.date));
  const [timeSlot, setTimeSlot] = useState<string | undefined>(booking.time);
  const [isSaving, setIsSaving] = useState(false);

  // Since we're only allowing same duration modification for simplicity, we lock duration
  const duration = booking.duration;

  const timeSlots = [
    "8:00–9:00", "9:00–10:00", "10:00–11:00", "11:00–12:00", 
    "12:00–13:00", "13:00–14:00", "14:00–15:00", "15:00–16:00",
    "16:00–17:00", "17:00–18:00"
  ];
  
  const halfDaySlots = [
    "8:00–12:00", "9:00–13:00", "13:00–17:00", "14:00–18:00"
  ];
  
  const fullDaySlots = [
    "8:00–16:00", "9:00–17:00"
  ];

  const getSlots = () => {
    if (duration === "1 Hour") return timeSlots;
    if (duration === "Half Day") return halfDaySlots;
    return fullDaySlots;
  };

  const isSlotPast = (slot: string, selectedDate: Date) => {
    if (!isToday(selectedDate)) return false;
    const startHour = parseInt(slot.split(":")[0]);
    const currentHour = new Date().getHours();
    return startHour <= currentHour;
  };

  const isOriginal = date && format(date, "yyyy-MM-dd") === booking.date && timeSlot === booking.time;

  const handleSave = () => {
    if (!date || !timeSlot) return;
    setIsSaving(true);
    
    setTimeout(() => {
      setBookings(prev => 
        prev.map(b => b.id === booking.id ? { 
          ...b, 
          date: format(date, "yyyy-MM-dd"), 
          time: timeSlot 
        } : b)
      );
      setLocation("/my-reservations");
    }, 800);
  };

  return (
    <UserLayout>
      <div className="bg-muted border-b border-border py-4">
        <div className="container mx-auto px-6">
          <Link href="/my-reservations" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to reservations
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-secondary mb-2">Modify Booking {booking.id}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Modifying date and time for <strong>{item.name}</strong> • {duration} • {booking.totalPrice} ILS
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Left Column: Form */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" /> New Date
              </h2>
              <div className="bg-white p-4 rounded-xl border border-border shadow-sm inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-none"
                  disabled={(date) => isPast(date) && !isSameDay(date, new Date())}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> New Time ({duration})
              </h2>

              {date ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
                  {getSlots().map(slot => {
                    const past = isSlotPast(slot, date);
                    const selected = timeSlot === slot;
                    const original = format(date, "yyyy-MM-dd") === booking.date && slot === booking.time;
                    
                    return (
                      <button
                        key={slot}
                        onClick={() => !past && setTimeSlot(slot)}
                        disabled={past}
                        className={`
                          py-3 px-4 rounded-lg border text-sm font-medium transition-all text-center relative overflow-hidden
                          ${past ? "bg-muted text-muted-foreground border-transparent opacity-50 cursor-not-allowed" : 
                            selected ? "bg-primary text-white border-primary shadow-md" : 
                            "bg-white text-secondary border-border hover:border-primary/50"}
                        `}
                      >
                        {slot}
                        {original && !selected && (
                          <span className="absolute bottom-0 inset-x-0 bg-muted-foreground text-[10px] text-white py-0.5">
                            Original
                          </span>
                        )}
                        {original && selected && (
                          <span className="absolute bottom-0 inset-x-0 bg-white/20 text-[10px] text-white py-0.5">
                            Original
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Please select a date first.</p>
              )}
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="w-full md:w-80 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-lg p-6">
              <h3 className="font-bold text-lg text-secondary mb-4">Summary of Changes</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Original</span>
                  <p className="text-sm font-medium text-secondary line-through opacity-70">
                    {format(new Date(booking.date), "MMM d, yyyy")} at {booking.time}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-primary uppercase font-semibold block mb-1">New</span>
                  <p className="text-sm font-medium text-secondary">
                    {date ? format(date, "MMM d, yyyy") : "—"} at {timeSlot || "—"}
                  </p>
                </div>
              </div>

              {!isOriginal && (
                <div className="bg-accent/30 p-3 rounded-lg border border-accent flex gap-2 mb-6">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-secondary font-medium">Modifications are free of charge. Price remains {booking.totalPrice} ILS.</p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={!date || !timeSlot || isOriginal || isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/my-reservations">
                  <Button variant="outline" size="lg" className="w-full border-border text-secondary hover:bg-muted">
                    Keep Original
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </UserLayout>
  );
}
