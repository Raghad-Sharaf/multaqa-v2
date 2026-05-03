import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Users, RefreshCw, Heart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <CalendarDays className="w-5 h-5" />,
    title: "Book your space in seconds",
    desc: "Browse desks and rooms, pick your date and time, confirm in 3 steps.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Bring your whole team",
    desc: "Book a room for your entire team in one go — pick a date, add members, and everyone gets a confirmation.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Multi-day & recurring",
    desc: "Need the same spot every week? Set up a recurring reservation easily.",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Save your favourites",
    desc: "Heart any desk or room and it's instantly added to your saved list.",
  },
];

export function OnboardingModal() {
  const { hasSeenOnboarding, setHasSeenOnboarding } = useAppContext();
  const [step, setStep] = useState(0);

  if (hasSeenOnboarding) return null;

  const isLast = step === steps.length - 1;
  const handleDone = () => setHasSeenOnboarding(true);

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-bottom"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="fixed z-50 pointer-events-none"
        style={{
          bottom: "16px",
          right: "16px",
          left: "16px",
          width: "auto",
        }}
      >
        {/* On sm+ screens, float right at fixed width */}
        <div className="ml-auto sm:w-[300px] w-full">
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            style={{ border: "1px solid rgba(0,18,121,0.1)" }}
          >
            <div className="h-[3px] w-full" style={{ background: "#FF5100" }} />

            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "#FFF0E8", color: "#FF5100" }}>
                    {steps[step].icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#FF5100" }}>
                      Quick tour · {step + 1}/{steps.length}
                    </p>
                    <h3 className="font-bold leading-tight" style={{ fontSize: "13px", color: "#001279" }}>
                      {steps[step].title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={handleDone}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                  style={{ background: "oklch(95% .03 268)", color: "#535060" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(90% .03 268)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "oklch(95% .03 268)")}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <p className="leading-relaxed mb-3" style={{ fontSize: "12px", color: "#535060" }}>
                {steps[step].desc}
              </p>

              {/* Progress dots */}
              <div className="flex items-center gap-1 mb-3">
                {steps.map((_, i) => (
                  <div key={i} className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? "18px" : "6px",
                      background: i === step ? "#FF5100" : i < step ? "rgba(255,81,0,0.3)" : "oklch(90% .005 285)",
                    }}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="h-8 px-3 rounded-lg border transition-colors"
                    style={{ fontSize: "12px", borderColor: "oklch(90% .005 285)", color: "#535060" }}
                  >
                    Back
                  </button>
                )}
                {!isLast ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="h-8 px-4 rounded-lg text-white font-semibold flex items-center gap-1 transition-colors"
                    style={{ fontSize: "12px", background: "#FF5100" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#e04800")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
                  >
                    Next <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={handleDone}
                    className="h-8 px-4 rounded-lg text-white font-semibold transition-colors"
                    style={{ fontSize: "12px", background: "#FF5100" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#e04800")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
                  >
                    Get Started
                  </button>
                )}
                <button
                  onClick={handleDone}
                  className="transition-colors"
                  style={{ fontSize: "11px", color: "#535060" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#535060")}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
