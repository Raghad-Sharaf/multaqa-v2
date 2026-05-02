import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { X, BellRing, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

type Props = {
  itemId: string;
  itemName: string;
  itemType: "desk" | "room";
  date?: string;
  timeSlot?: string;
  onClose: () => void;
};

export function WaitlistModal({ itemId, itemName, itemType, date, timeSlot, onClose }: Props) {
  const { currentUser, waitlist, setWaitlist } = useAppContext();
  const [email, setEmail] = useState(currentUser?.email || "");
  const [selectedDate, setSelectedDate] = useState(date || format(new Date(), "yyyy-MM-dd"));
  const [selectedTime, setSelectedTime] = useState(timeSlot || "9:00–13:00");
  const [submitted, setSubmitted] = useState(false);

  const alreadyOnList = waitlist.some(
    w => w.itemId === itemId && w.userEmail === email && w.date === selectedDate
  );

  const timeSlots = [
    "8:00–12:00", "9:00–13:00", "10:00–14:00", "13:00–17:00", "14:00–18:00", "9:00–17:00",
  ];

  const handleJoin = () => {
    if (!email || alreadyOnList) return;
    const entry = {
      id: `WL-${String(waitlist.length + 1).padStart(3, "0")}`,
      itemId,
      itemType,
      userEmail: email,
      date: selectedDate,
      timeSlot: selectedTime,
      createdAt: new Date().toISOString(),
    };
    setWaitlist(prev => [...prev, entry]);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,18,121,0.55)", backdropFilter: "blur(5px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {!submitted ? (
          <>
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-secondary text-lg">Join the Waitlist</h2>
                  <p className="text-muted-foreground text-sm">{itemName}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-muted/50 p-4 rounded-xl border border-border text-sm text-muted-foreground flex gap-3">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-warning" />
                <span>This {itemType === "desk" ? "desk" : "room"} is currently reserved. If a cancellation happens, you'll get a booking link by email — first-come, first-served.</span>
              </div>

              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-11"
                />
                {alreadyOnList && (
                  <p className="text-xs text-warning font-medium">You're already on the waitlist for this date.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Preferred Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Preferred Time</Label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all text-center ${selectedTime === slot ? "bg-primary text-white border-primary" : "bg-white text-secondary border-border hover:border-primary/40"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
                disabled={!email || alreadyOnList}
                onClick={handleJoin}
              >
                <BellRing className="w-4 h-4 mr-2" /> Join Waitlist
              </Button>
            </div>
          </>
        ) : (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-success/20">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-secondary mb-2">You're on the list!</h2>
            <p className="text-muted-foreground text-sm mb-1">
              We'll email <strong className="text-secondary">{email}</strong> the moment a spot opens for
            </p>
            <p className="text-secondary font-semibold text-sm mb-6">
              {itemName} — {format(new Date(selectedDate), "EEE, MMM d")} · {selectedTime}
            </p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-white">
              Done
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
