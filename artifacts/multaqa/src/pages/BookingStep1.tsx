import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, BookingMode, RecurringPattern } from "@/context/AppContext";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isPast, isSameDay, addDays } from "date-fns";
import { ArrowLeft, Clock, CalendarDays, Users, RefreshCw, Layers, User } from "lucide-react";

type Duration = "1 Hour" | "Half Day" | "Full Day";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 18;

const START_HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i); // 8..17
const ALL_END_HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + 1 + i); // 9..18

const fmtHour = (h: number) => `${String(h).padStart(2, "0")}:00`;

const getDuration = (hours: number): Duration => {
  if (hours >= 8) return "Full Day";
  if (hours >= 4) return "Half Day";
  return "1 Hour";
};

export default function BookingStep1() {
  const [, setLocation] = useLocation();
  const { desks, rooms, setBookingDraft, favorites } = useAppContext();

  const searchParams = new URLSearchParams(window.location.search);
  const itemId = searchParams.get("item");
  const itemType = searchParams.get("type") as "desk" | "room" | null;
  const item = itemType === "desk" ? desks.find(d => d.id === itemId) : rooms.find(r => r.id === itemId);

  const [bookingMode, setBookingMode] = useState<BookingMode>("single");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);
  const [recurringPattern, setRecurringPattern] = useState<RecurringPattern>("weekly");
  const [recurringEndDate, setRecurringEndDate] = useState<string>(format(addDays(new Date(), 28), "yyyy-MM-dd"));
  const [teamSize, setTeamSize] = useState(2);
  const [teamEmails, setTeamEmails] = useState<string[]>(["", ""]);

  useEffect(() => {
    if (!item) setLocation("/");
  }, [item, setLocation]);

  if (!item) return null;

  const isFav = favorites.includes(item.id);
  const endHours = startHour !== null ? ALL_END_HOURS.filter(h => h > startHour) : ALL_END_HOURS;
  const hoursPerDay = startHour !== null && endHour !== null ? endHour - startHour : 0;
  const daysCount = bookingMode === "multi-day" ? Math.max(selectedDates.length, 1) : 1;
  const totalPrice = item.priceHour * hoursPerDay * daysCount;
  const timeSlot = startHour !== null && endHour !== null ? `${fmtHour(startHour)}–${fmtHour(endHour)}` : undefined;

  const handleStartHour = (h: number) => {
    setStartHour(h);
    if (endHour !== null && endHour <= h) setEndHour(null);
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
    setTeamEmails(Array.from({ length: size }, (_, i) => teamEmails[i] || ""));
  };

  const canContinue = timeSlot && (
    bookingMode === "single" ? true :
    bookingMode === "multi-day" ? selectedDates.length > 0 :
    bookingMode === "recurring" ? !!recurringEndDate :
    teamEmails.some(Boolean)
  );

  const handleContinue = () => {
    if (!timeSlot) return;
    const baseDate = bookingMode === "multi-day"
      ? format(selectedDates.sort((a, b) => a.getTime() - b.getTime())[0], "yyyy-MM-dd")
      : format(date, "yyyy-MM-dd");
    const dur = getDuration(hoursPerDay);
    const availableDesks = desks.filter(d => d.location === item.location && d.status === "Available" && d.id !== item.id);
    const teamDeskIds = bookingMode === "team" ? [item.id, ...availableDesks.slice(0, teamSize - 1).map(d => d.id)] : undefined;

    setBookingDraft({
      itemId: item.id,
      itemType: itemType!,
      location: item.location,
      date: baseDate,
      time: timeSlot,
      duration: dur,
      totalPrice,
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

  const modes: { id: BookingMode; label: string; icon: React.ReactNode }[] = [
    { id: "single", label: "Single Day", icon: <User className="w-3.5 h-3.5" /> },
    { id: "multi-day", label: "Multi-Day", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "recurring", label: "Recurring", icon: <RefreshCw className="w-3.5 h-3.5" /> },
    { id: "team", label: "Team", icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <UserLayout>
      {/* Back nav + step indicator */}
      <div className="border-b py-4" style={{ background: "oklch(98% .01 268)", borderColor: "oklch(90% .005 285)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <Link href={`/${itemType}s/${item.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-3 transition-colors"
            style={{ color: "#535060" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
            onMouseLeave={e => (e.currentTarget.style.color = "#535060")}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to details
          </Link>
          {/* Step strip */}
          <div className="flex items-center gap-2 max-w-xs">
            {[{ n: 1, label: "Date & Time" }, { n: 2, label: "Review" }, { n: 3, label: "Done" }].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px" style={{ background: "oklch(90% .005 285)" }} />}
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={s.n === 1 ? { background: "#FF5100", color: "white" } : { background: "oklch(93% .005 285)", color: "#535060" }}>
                    {s.n}
                  </div>
                  <span className="text-[12px] font-semibold hidden sm:block" style={{ color: s.n === 1 ? "#001279" : "#535060" }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Booking mode tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {modes.map(m => (
            <button key={m.id} onClick={() => setBookingMode(m.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-all"
              style={bookingMode === m.id
                ? { background: "#001279", color: "white", borderColor: "#001279" }
                : { background: "white", color: "#535060", borderColor: "oklch(90% .005 285)" }
              }
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Column 1: Calendar */}
          <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid oklch(90% .005 285)" }}>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4" style={{ color: "#FF5100" }} />
              <h2 className="font-bold text-[16px]" style={{ color: "#001279" }}>Pick your date{bookingMode === "multi-day" ? "(s)" : ""}</h2>
            </div>
            <p className="text-[12px] mb-4" style={{ color: "#535060" }}>
              {bookingMode === "multi-day"
                ? "Tap one or more days. You can book up to one month ahead."
                : "Select the date for your session."}
              {isFav && <span className="ml-1 text-[11px] font-semibold" style={{ color: "#FF5100" }}>★ Favourite</span>}
            </p>

            {bookingMode === "multi-day" ? (
              <>
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  className="rounded-lg border-none p-0 w-full"
                  disabled={(d) => isPast(d) && !isSameDay(d, new Date())}
                />
                {selectedDates.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {[...selectedDates].sort((a, b) => a.getTime() - b.getTime()).map(d => (
                      <span key={d.toISOString()} className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,81,0,0.1)", color: "#FF5100" }}>
                        {format(d, "MMM d")}
                        <button onClick={() => toggleMultiDate(d)} className="ml-0.5 text-[13px] leading-none">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="rounded-lg border-none p-0 w-full"
                disabled={(d) => isPast(d) && !isSameDay(d, new Date())}
              />
            )}

            {/* Recurring / Team extras below calendar */}
            {bookingMode === "recurring" && (
              <div className="mt-4 space-y-3 pt-4 border-t" style={{ borderColor: "oklch(90% .005 285)" }}>
                <div className="space-y-1">
                  <Label className="text-[12px] font-semibold" style={{ color: "#001279" }}>Pattern</Label>
                  <Select value={recurringPattern} onValueChange={(v: any) => setRecurringPattern(v)}>
                    <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly (~4 sessions)</SelectItem>
                      <SelectItem value="daily">Daily weekdays (~20 sessions)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[12px] font-semibold" style={{ color: "#001279" }}>End date</Label>
                  <Input type="date" value={recurringEndDate}
                    onChange={e => setRecurringEndDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    max={format(addDays(new Date(), 31), "yyyy-MM-dd")}
                    className="h-9 text-[13px]"
                  />
                </div>
              </div>
            )}

            {bookingMode === "team" && (
              <div className="mt-4 space-y-3 pt-4 border-t" style={{ borderColor: "oklch(90% .005 285)" }}>
                <div className="space-y-1">
                  <Label className="text-[12px] font-semibold" style={{ color: "#001279" }}>Number of seats</Label>
                  <Select value={String(teamSize)} onValueChange={v => changeTeamSize(Number(v))}>
                    <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2,3,4,5,6,7,8].map(n => <SelectItem key={n} value={String(n)}>{n} seats</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-semibold" style={{ color: "#001279" }}>Team emails</Label>
                  {Array.from({ length: teamSize }).map((_, i) => (
                    <Input key={i} type="email" placeholder={`member${i + 1}@example.com`}
                      value={teamEmails[i] || ""} onChange={e => updateTeamEmail(i, e.target.value)}
                      className="h-8 text-[12px]" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Time picker */}
          <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid oklch(90% .005 285)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" style={{ color: "#FF5100" }} />
              <h2 className="font-bold text-[16px]" style={{ color: "#001279" }}>Pick your time</h2>
            </div>
            <p className="text-[12px] mb-5" style={{ color: "#535060" }}>
              Spaces are open from {fmtHour(OPEN_HOUR)} to {fmtHour(CLOSE_HOUR)}. Pick any start and end time.
            </p>

            {/* Start time */}
            <div className="mb-5">
              <p className="text-[13px] font-bold mb-2" style={{ color: "#001279" }}>Start time</p>
              <div className="grid grid-cols-5 gap-1.5">
                {START_HOURS.map(h => (
                  <button
                    key={h}
                    onClick={() => handleStartHour(h)}
                    className="py-2 rounded-lg text-[12px] font-medium border text-center transition-all"
                    style={
                      startHour === h
                        ? { background: "#FF5100", color: "white", borderColor: "#FF5100" }
                        : { background: "white", color: "#001279", borderColor: "oklch(90% .005 285)" }
                    }
                    onMouseEnter={e => { if (startHour !== h) { e.currentTarget.style.borderColor = "#FF5100"; } }}
                    onMouseLeave={e => { if (startHour !== h) { e.currentTarget.style.borderColor = "oklch(90% .005 285)"; } }}
                  >
                    {fmtHour(h)}
                  </button>
                ))}
              </div>
            </div>

            {/* End time */}
            <div>
              <p className="text-[13px] font-bold mb-2" style={{ color: "#001279" }}>End time</p>
              <div className="grid grid-cols-5 gap-1.5">
                {ALL_END_HOURS.map(h => {
                  const disabled = startHour === null || h <= startHour;
                  const selected = endHour === h;
                  return (
                    <button
                      key={h}
                      onClick={() => !disabled && setEndHour(h)}
                      disabled={disabled}
                      className="py-2 rounded-lg text-[12px] font-medium border text-center transition-all"
                      style={
                        selected
                          ? { background: "#FF5100", color: "white", borderColor: "#FF5100", cursor: "pointer" }
                          : disabled
                          ? { background: "oklch(97% .005 285)", color: "#535060", borderColor: "oklch(93% .005 285)", cursor: "not-allowed", opacity: 0.5 }
                          : { background: "white", color: "#001279", borderColor: "oklch(90% .005 285)", cursor: "pointer" }
                      }
                      onMouseEnter={e => { if (!disabled && !selected) e.currentTarget.style.borderColor = "#FF5100"; }}
                      onMouseLeave={e => { if (!disabled && !selected) e.currentTarget.style.borderColor = "oklch(90% .005 285)"; }}
                    >
                      {fmtHour(h)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration badge */}
            {hoursPerDay > 0 && (
              <div className="mt-5 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,81,0,0.06)", border: "1px solid rgba(255,81,0,0.15)" }}>
                <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: "#FF5100" }} />
                <span className="text-[13px] font-medium" style={{ color: "#FF5100" }}>
                  {hoursPerDay} {hoursPerDay === 1 ? "hour" : "hours"} session · {getDuration(hoursPerDay)}
                </span>
              </div>
            )}
          </div>

          {/* Column 3: Summary */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid oklch(90% .005 285)" }}>
              {/* Item preview */}
              <div className="flex gap-3 p-4 border-b" style={{ borderColor: "oklch(90% .005 285)" }}>
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-[15px] leading-tight" style={{ color: "#001279" }}>{item.name}</p>
                  <p className="text-[12px]" style={{ color: "#535060" }}>{item.location}</p>
                  {isFav && <span className="text-[11px] font-semibold mt-0.5" style={{ color: "#FF5100" }}>★ Favourite</span>}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="p-4 space-y-3">
                {[
                  { label: "Rate", value: `${item.priceHour} ILS/hr` },
                  { label: "Days", value: bookingMode === "multi-day" ? `${daysCount}` : "1" },
                  { label: "Hours / day", value: hoursPerDay > 0 ? `${hoursPerDay}` : "—" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-[13px]" style={{ color: "#535060" }}>{row.label}</span>
                    <span className="text-[13px] font-semibold" style={{ color: "#001279" }}>{row.value}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between items-center" style={{ borderColor: "oklch(90% .005 285)" }}>
                  <span className="font-bold text-[14px]" style={{ color: "#001279" }}>Total</span>
                  <span className="font-bold text-[20px]" style={{ color: "#FF5100" }}>{totalPrice} ILS</span>
                </div>
              </div>

              {/* Continue */}
              <div className="px-4 pb-4 space-y-2">
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="w-full h-11 rounded-xl text-white text-[14px] font-semibold transition-colors"
                  style={canContinue
                    ? { background: "#FF5100" }
                    : { background: "rgba(255,81,0,0.35)", cursor: "not-allowed" }
                  }
                  onMouseEnter={e => { if (canContinue) e.currentTarget.style.background = "#e04800"; }}
                  onMouseLeave={e => { if (canContinue) e.currentTarget.style.background = "#FF5100"; }}
                >
                  Continue
                </button>
                <p className="text-[11px] text-center" style={{ color: "#535060" }}>
                  Free cancellation up to 2 hours before start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
