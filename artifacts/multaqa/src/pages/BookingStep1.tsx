import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isToday, addHours, isPast, isSameDay } from "date-fns";
import { ArrowLeft, Clock, Calendar as CalendarIcon } from "lucide-react";

export default function BookingStep1() {
  const [, setLocation] = useLocation();
  const { desks, rooms, bookingDraft, setBookingDraft } = useAppContext();
  
  // Parse query params for item info
  const searchParams = new URLSearchParams(window.location.search);
  const itemId = searchParams.get("item");
  const itemType = searchParams.get("type") as "desk" | "room" | null;
  
  const [date, setDate] = useState<Date | undefined>(bookingDraft?.date ? new Date(bookingDraft.date) : new Date());
  const [timeSlot, setTimeSlot] = useState<string | undefined>(bookingDraft?.time);
  const [duration, setDuration] = useState<"1 Hour" | "Half Day" | "Full Day">(bookingDraft?.duration || "1 Hour");

  // Find item
  const item = itemType === "desk" ? desks.find(d => d.id === itemId) : rooms.find(r => r.id === itemId);
  
  useEffect(() => {
    if (!item) {
      setLocation("/");
    }
  }, [item, setLocation]);

  if (!item) return null;

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

  const getPrice = () => {
    if (duration === "1 Hour") return item.priceHour;
    if (duration === "Half Day") return item.priceHalfDay || (item.priceHour * 4);
    // @ts-ignore (rooms might not have full day price, default to 8x hourly)
    if (duration === "Full Day") return item.priceFullDay || (item.priceHour * 8);
    return item.priceHour;
  };

  const handleContinue = () => {
    if (!date || !timeSlot) return;
    
    setBookingDraft({
      itemId: item.id,
      itemType: itemType!,
      location: item.location,
      date: format(date, "yyyy-MM-dd"),
      time: timeSlot,
      duration,
      totalPrice: getPrice(),
      paymentMethod: "Cash"
    });
    
    setLocation("/book/step2");
  };

  return (
    <UserLayout>
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
            <div className="h-px bg-border flex-1 mx-4"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-muted border border-muted-foreground text-muted-foreground flex items-center justify-center font-bold text-sm">2</div>
              <span className="font-bold text-muted-foreground text-sm">Review</span>
            </div>
            <div className="h-px bg-border flex-1 mx-4"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-muted border border-muted-foreground text-muted-foreground flex items-center justify-center font-bold text-sm">3</div>
              <span className="font-bold text-muted-foreground text-sm">Done</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl flex-1 flex flex-col md:flex-row gap-10">
        
        {/* Left Column: Form */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" /> Select Date
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
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" /> Select Time
              </h2>
              <div className="w-40">
                <Select value={duration} onValueChange={(val: any) => {
                  setDuration(val);
                  setTimeSlot(undefined);
                }}>
                  <SelectTrigger className="bg-white border-border">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 Hour">1 Hour</SelectItem>
                    {item.priceHalfDay && <SelectItem value="Half Day">Half Day</SelectItem>}
                    {/* @ts-ignore */}
                    {item.priceFullDay && <SelectItem value="Full Day">Full Day</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {date ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getSlots().map(slot => {
                  const past = isSlotPast(slot, date);
                  const selected = timeSlot === slot;
                  
                  return (
                    <button
                      key={slot}
                      onClick={() => !past && setTimeSlot(slot)}
                      disabled={past}
                      className={`
                        py-3 px-4 rounded-lg border text-sm font-medium transition-all text-center
                        ${past ? "bg-muted text-muted-foreground border-transparent opacity-50 cursor-not-allowed" : 
                          selected ? "bg-primary text-white border-primary shadow-md" : 
                          "bg-white text-secondary border-border hover:border-primary/50"}
                      `}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Please select a date first.</p>
            )}
            
            {date && isToday(date) && (
              <p className="text-sm text-warning mt-4 font-medium bg-warning/10 p-3 rounded-lg inline-block border border-warning/20">
                Closing in {Math.max(0, 18 - new Date().getHours())} hours today.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-lg overflow-hidden flex flex-col">
            <div className="h-40 bg-muted relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 text-xs font-medium rounded border border-white/20">
                {item.location}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-xl text-secondary mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                {itemType === "desk" ? "Coworking Desk" : "Meeting Room"}
              </p>
              
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold text-secondary">{date ? format(date, "MMM d, yyyy") : "—"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold text-secondary">{timeSlot || "—"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold text-secondary">{duration}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-border">
                  <span className="text-secondary font-medium">Total</span>
                  <span className="font-bold text-primary text-xl">{getPrice()} ILS</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full h-12 text-base font-medium"
                disabled={!date || !timeSlot}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
        
      </div>
    </UserLayout>
  );
}
