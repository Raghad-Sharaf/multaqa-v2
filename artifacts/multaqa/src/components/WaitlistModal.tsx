import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
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
    "8:00–12:00", "9:00–13:00", "10:00–14:00",
    "13:00–17:00", "14:00–18:00", "9:00–17:00",
  ];

  const handleJoin = () => {
    if (!email || alreadyOnList) return;
    setWaitlist(prev => [...prev, {
      id: `WL-${String(prev.length + 1).padStart(3, "0")}`,
      itemId, itemType,
      userEmail: email,
      date: selectedDate,
      timeSlot: selectedTime,
      createdAt: new Date().toISOString(),
    }]);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,18,121,0.5)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ maxHeight: "88vh", display: "flex", flexDirection: "column" }}
      >
        {!submitted ? (
          <>
            {/* Header */}
            <div className="px-5 py-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: "rgba(0,18,121,0.08)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFF0E8", color: "#FF5100" }}>
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-base" style={{ color: "#001279" }}>Join Waitlist</h2>
                  <p className="text-xs" style={{ color: "#535060" }}>{itemName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "#F5F5F5", color: "#535060" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#E8EBFF")}
                onMouseLeave={e => (e.currentTarget.style.background = "#F5F5F5")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
              {/* Info */}
              <div className="rounded-xl p-3 flex gap-2.5 text-xs" style={{ background: "#FFF8E8", color: "#535060" }}>
                <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
                <span>This {itemType} is reserved. We'll email you if a spot opens — first-come, first-served.</span>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold" style={{ color: "#001279" }}>Email Address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-9 text-sm"
                />
                {alreadyOnList && (
                  <p className="text-xs font-medium" style={{ color: "#D97706" }}>Already on waitlist for this date.</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold" style={{ color: "#001279" }}>Preferred Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="h-9 text-sm"
                />
              </div>

              {/* Time slots — 3 column */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold" style={{ color: "#001279" }}>Preferred Time</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className="py-1.5 px-1 rounded-lg border text-xs font-medium transition-all text-center"
                      style={
                        selectedTime === slot
                          ? { background: "#FF5100", color: "white", borderColor: "#FF5100" }
                          : { background: "white", color: "#535060", borderColor: "rgba(0,0,0,0.15)" }
                      }
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-5 py-4 border-t shrink-0" style={{ borderColor: "rgba(0,18,121,0.08)" }}>
              <button
                className="w-full h-10 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                style={{ background: "#FF5100" }}
                disabled={!email || alreadyOnList}
                onClick={handleJoin}
                onMouseEnter={e => { if (!(!email || alreadyOnList)) e.currentTarget.style.background = "#e04800"; }}
                onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
              >
                <BellRing className="w-4 h-4" /> Join Waitlist
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#E6F5EC" }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: "#1A7A4A" }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#001279" }}>You're on the list!</h2>
            <p className="text-sm mb-1" style={{ color: "#535060" }}>
              We'll email <strong style={{ color: "#001279" }}>{email}</strong> when a spot opens for
            </p>
            <p className="text-sm font-semibold mb-5" style={{ color: "#001279" }}>
              {itemName} — {format(new Date(selectedDate), "EEE, MMM d")} · {selectedTime}
            </p>
            <button
              className="px-6 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#FF5100" }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
