import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, BookingMode, RecurringPattern } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, isToday, isPast, isSameDay, addDays } from "date-fns";
import { ArrowLeft, Clock, Calendar as CalendarIcon, Users, RefreshCw, Layers, User } from "lucide-react";

type Duration = "1 Hour" | "Half Day" | "Full Day";

export default function BookingStep1() {
  const [, setLocation] = useLocation();
  const { desks, rooms, bookingDraft, setBookingDraft, favorites } = useAppContext();

  const searchParams = new URLSearchParams(window.location.search);
  const itemId = searchParams.get("item");
  const itemType = searchParams.get("type") as "desk" | "room" | null;

  const item = itemType === "desk" ? desks.find(d => d.id === itemId) : rooms.find(r => r.id === itemId);

  const [bookingMode, setBookingMode] = useState<BookingMode>("single");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);
  const [timeSlot, setTimeSlot] = useState<string | undefined>();
  const [duration, setDuration] = useState<Duration>("1 Hour");
  const [recurringPattern, setRecurringPattern] = useState<RecurringPattern>("weekly");
  const [recurringEndDate, setRecurringEndDate] = useState<string>(format(addDays(new Date(), 28), "yyyy-MM-dd"));
  const [teamSize, setTeamSize] = useState(2);
  const [teamEmails, setTeamEmails] = useState<string[]>(["", ""]);

  useEffect(() => {
    if (!item) setLocation("/");
  }, [item, setLocation]);

  if (!item) return null;

  const isFav = favorites.includes(item.id);

  const timeSlots = ["8:00–9:00","9:00–10:00","10:00–11:00","11:00–12:00","12:00–13:00","13:00–14:00","14:00–15:00","15:00–16:00","16:00–17:00","17:00–18:00"];
  const halfDaySlots = ["8:00–12:00","9:00–13:00","13:00–17:00","14:00–18:00"];
  const fullDaySlots = ["8:00–16:00","9:00–17:00"];

  const getSlots = () => {
    if (duration === "1 Hour") return timeSlots;
    if (duration === "Half Day") return halfDaySlots;
    return fullDaySlots;
  };

  const isSlotPast = (slot: string, d: Date) => {
    if (!isToday(d)) return false;
    return parseInt(slot.split(":")[0]) <= new Date().getHours();
  };

  const getPrice = () => {
    const base = duration === "1 Hour" ? item.priceHour : duration === "Half Day" ? (item.priceHalfDay || item.priceHour * 4) : ((item as any).priceFullDay || item.priceHour * 8);
    if (bookingMode === "multi-day") return base * selectedDates.length;
    if (bookingMode === "recurring") {
      const weeks = recurringPattern === "weekly" ? 4 : 20;
      return base * weeks;
    }
    if (bookingMode === "team") return base * teamSize;
    return base;
  };

  const toggleMultiDate = (d: Date) => {
    setSelectedDates(prev => {
      const exists = prev.some(x => isSameDay(x, d));
      if (exists) return prev.filter(x => !isSameDay(x, d));
      return [...prev, d];
    });
  };

  const updateTeamEmail = (idx: number, val: string) => {
    const copy = [...teamEmails];
    copy[idx] = val;
    setTeamEmails(copy);
  };

  const changeTeamSize = (size: number) => {
    setTeamSize(size);
    const emails = Array.from({ length: size }, (_, i) => teamEmails[i] || "");
    setTeamEmails(emails);
  };

  const handleContinue = () => {
    const baseDate = bookingMode === "multi-day" ? format(selectedDates[0], "yyyy-MM-dd") : format(date!, "yyyy-MM-dd");
    if (!timeSlot) return;

    const availableDesks = desks.filter(d => d.location === item.location && d.status === "Available" && d.id !== item.id);
    const teamDeskIds = bookingMode === "team" ? [item.id, ...availableDesks.slice(0, teamSize - 1).map(d => d.id)] : undefined;

    setBookingDraft({
      itemId: item.id,
      itemType: itemType!,
      location: item.location,
      date: baseDate,
      time: timeSlot,
      duration,
      totalPrice: getPrice(),
      paymentMethod: "Cash",
      bookingMode,
      multiDays: bookingMode === "multi-day" ? selectedDates.map(d => format(d, "yyyy-MM-dd")) : undefined,
      recurringPattern: bookingMode === "recurring" ? recurringPattern : undefined,
      recurringEndDate: bookingMode === "recurring" ? recurringEndDate : undefined,
      teamMembers: bookingMode === "team" ? teamEmails.filter(Boolean) : undefined,
      teamDeskIds,
    });

    setLocation("/book/step2");
  };

  const canContinue = timeSlot && (
    bookingMode === "single" ? !!date :
    bookingMode === "multi-day" ? selectedDates.length > 0 :
    bookingMode === "recurring" ? !!recurringEndDate :
    teamEmails.some(Boolean)
  );

  const modes: { id: BookingMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "single", label: "Single Day", icon: <User className="w-4 h-4" />, desc: "One session" },
    { id: "multi-day", label: "Multi-Day", icon: <Layers className="w-4 h-4" />, desc: "Multiple days" },
    { id: "recurring", label: "Recurring", icon: <RefreshCw className="w-4 h-4" />, desc: "Weekly or daily" },
    { id: "team", label: "Team", icon: <Users className="w-4 h-4" />, desc: "Multiple seats" },
  ];

  return (
    <UserLayout>
      {/* Step indicator */}
      <div className="bg-muted border-b border-border py-4">
        <div className="container mx-auto px-6">
          <Link href={`/${itemType}s/${item.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-secondary mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to details
          </Link>
          <div className="flex items-center justify-center max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
              <span className="font-bold text-secondary text-sm">Date & Time</span>
            </div>
            <div className="h-px bg-border flex-1 mx-4" />
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-muted border border-muted-foreground text-muted-foreground flex items-center justify-center font-bold text-sm">2</div>
              <span className="font-bold text-muted-foreground text-sm">Review</span>
            </div>
            <div className="h-px bg-border flex-1 mx-4" />
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-muted border border-muted-foreground text-muted-foreground flex items-center justify-center font-bold text-sm">3</div>
              <span className="font-bold text-muted-foreground text-sm">Done</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl flex-1 flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-8">

          {/* Booking Mode Selector */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-4">Booking Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {modes.map(m => (
                <button key={m.id} onClick={() => setBookingMode(m.id)}
                  className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border-2 text-sm font-medium transition-all ${bookingMode === m.id ? "border-primary bg-primary/5 text-primary" : "border-border bg-white text-secondary hover:border-primary/40"}`}>
                  {m.icon}
                  <span className="font-semibold">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Duration
            </h2>
            <div className="w-40">
              <Select value={duration} onValueChange={(v: any) => { setDuration(v); setTimeSlot(undefined); }}>
                <SelectTrigger className="bg-white border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Hour">1 Hour</SelectItem>
                  {item.priceHalfDay && <SelectItem value="Half Day">Half Day</SelectItem>}
                  {(item as any).priceFullDay && <SelectItem value="Full Day">Full Day</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {bookingMode === "multi-day" ? "Select Multiple Days" : "Select Date"}
              {isFav && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">★ Favourite</span>}
            </h2>

            <div className="bg-white p-4 rounded-xl border border-border shadow-sm inline-block">
              {bookingMode === "multi-day" ? (
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  className="rounded-md border-none"
                  disabled={(d) => isPast(d) && !isSameDay(d, new Date())}
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-none"
                  disabled={(d) => isPast(d) && !isSameDay(d, new Date())}
                />
              )}
            </div>

            {bookingMode === "multi-day" && selectedDates.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {[...selectedDates].sort((a,b) => a.getTime()-b.getTime()).map(d => (
                  <span key={d.toISOString()} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-md">
                    {format(d, "MMM d")}
                    <button onClick={() => toggleMultiDate(d)} className="ml-1 hover:text-primary/60">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recurring options */}
          {bookingMode === "recurring" && (
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
              <h3 className="font-bold text-secondary">Recurrence Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Pattern</Label>
                  <Select value={recurringPattern} onValueChange={(v: any) => setRecurringPattern(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily (weekdays)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>End Date (max 1 month)</Label>
                  <Input type="date" value={recurringEndDate} onChange={e => setRecurringEndDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    max={format(addDays(new Date(), 31), "yyyy-MM-dd")}
                    className="h-10"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {recurringPattern === "weekly" ? "~4 sessions" : "~20 sessions"} will be created based on your selected time slot.
              </p>
            </div>
          )}

          {/* Team options */}
          {bookingMode === "team" && (
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
              <h3 className="font-bold text-secondary">Team Details</h3>
              <div className="space-y-1.5">
                <Label>Number of seats</Label>
                <Select value={String(teamSize)} onValueChange={(v) => changeTeamSize(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[2,3,4,5,6,7,8].map(n => <SelectItem key={n} value={String(n)}>{n} seats</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Team member emails (for confirmation)</Label>
                {Array.from({ length: teamSize }).map((_, i) => (
                  <Input key={i} type="email" placeholder={`member${i + 1}@example.com`}
                    value={teamEmails[i] || ""} onChange={e => updateTeamEmail(i, e.target.value)}
                    className="h-10" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Adjacent available desks in {item.location} will be automatically assigned to your team.</p>
            </div>
          )}

          {/* Time slots */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Select Time
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {getSlots().map(slot => {
                const activeDate = bookingMode === "multi-day" ? (selectedDates[0] || new Date()) : (date || new Date());
                const past = isSlotPast(slot, activeDate);
                const selected = timeSlot === slot;
                return (
                  <button key={slot} onClick={() => !past && setTimeSlot(slot)} disabled={past}
                    className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all text-center
                      ${past ? "bg-muted text-muted-foreground border-transparent opacity-50 cursor-not-allowed" :
                        selected ? "bg-primary text-white border-primary shadow-md" :
                        "bg-white text-secondary border-border hover:border-primary/50"}`}>
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-lg overflow-hidden flex flex-col">
            <div className="h-40 bg-muted relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 text-xs font-medium rounded border border-white/20">
                {item.location}
              </div>
              {isFav && (
                <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 text-xs font-medium rounded flex items-center gap-1">
                  ★ Favourite
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-xl text-secondary mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                {itemType === "desk" ? "Coworking Desk" : "Meeting Room"}
              </p>

              <div className="space-y-3 mb-6 flex-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-semibold text-secondary capitalize">{bookingMode.replace("-", " ")}</span>
                </div>
                {bookingMode === "single" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold text-secondary">{date ? format(date, "MMM d, yyyy") : "—"}</span>
                  </div>
                )}
                {bookingMode === "multi-day" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days</span>
                    <span className="font-semibold text-secondary">{selectedDates.length} selected</span>
                  </div>
                )}
                {bookingMode === "recurring" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Until</span>
                    <span className="font-semibold text-secondary">{recurringEndDate ? format(new Date(recurringEndDate), "MMM d") : "—"}</span>
                  </div>
                )}
                {bookingMode === "team" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-semibold text-secondary">{teamSize}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold text-secondary">{timeSlot || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold text-secondary">{duration}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="text-secondary font-medium">Total</span>
                  <span className="font-bold text-primary text-xl">{getPrice()} ILS</span>
                </div>
              </div>

              <Button size="lg" className="w-full h-12 text-base font-medium" disabled={!canContinue} onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
