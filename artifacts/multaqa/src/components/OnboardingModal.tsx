import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Users, RefreshCw, Heart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: "Book your space in seconds",
    desc: "Browse desks and rooms, pick your date and time, confirm in 3 steps.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Bring your whole team",
    desc: "Reserve multiple adjacent desks for your group in a single checkout.",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Multi-day & recurring",
    desc: "Need the same spot every week? Set up a recurring reservation easily.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
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
        className="fixed bottom-4 left-4 right-4 z-50 pointer-events-none"
        style={{ maxWidth: "420px", margin: "0 auto" }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          style={{ border: "1px solid rgba(0,18,121,0.1)" }}
        >
          {/* Top accent */}
          <div className="h-1 w-full" style={{ background: "#FF5100" }} />

          <div className="p-5">
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#FFF0E8", color: "#FF5100" }}>
                  {steps[step].icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#FF5100" }}>
                    Quick tour · {step + 1}/{steps.length}
                  </p>
                  <h3 className="font-bold text-[15px] leading-tight" style={{ color: "#001279" }}>
                    {steps[step].title}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleDone}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                style={{ background: "oklch(95% .03 268)", color: "#535060" }}
                onMouseEnter={e => (e.currentTarget.style.background = "oklch(90% .03 268)")}
                onMouseLeave={e => (e.currentTarget.style.background = "oklch(95% .03 268)")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#535060" }}>
              {steps[step].desc}
            </p>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mb-4">
              {steps.map((_, i) => (
                <div key={i} className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? "24px" : "8px",
                    background: i === step ? "#FF5100" : i < step ? "rgba(255,81,0,0.3)" : "oklch(90% .005 285)",
                  }}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="h-9 px-3 rounded-xl text-[13px] font-medium border transition-colors"
                  style={{ borderColor: "oklch(90% .005 285)", color: "#535060" }}
                >
                  Back
                </button>
              )}
              {!isLast ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex-1 h-9 rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  style={{ background: "#FF5100" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#e04800")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleDone}
                  className="flex-1 h-9 rounded-xl text-white text-[13px] font-semibold transition-colors"
                  style={{ background: "#FF5100" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#e04800")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
                >
                  Get Started
                </button>
              )}
              <button
                onClick={handleDone}
                className="text-[12px] shrink-0 transition-colors"
                style={{ color: "#535060" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
                onMouseLeave={e => (e.currentTarget.style.color = "#535060")}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
