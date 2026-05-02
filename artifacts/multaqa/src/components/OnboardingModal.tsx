import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Users, RefreshCw, Heart, ArrowRight, Play } from "lucide-react";

const steps = [
  {
    icon: <CalendarDays className="w-10 h-10" />,
    title: "Book your space in seconds",
    desc: "Browse available desks and rooms, pick your date and time, and confirm in 3 easy steps — no account required.",
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Bring your whole team",
    desc: "Use Team Booking to reserve multiple adjacent desks for your group in a single checkout. Confirmation goes to every member automatically.",
  },
  {
    icon: <RefreshCw className="w-10 h-10" />,
    title: "Multi-day & Recurring bookings",
    desc: "Need the same spot every week? Set up a recurring reservation. Or pick multiple days at once with our multi-day booking flow.",
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "Save your favourites",
    desc: "Heart any desk or room to save it as a favourite. On your next visit the system pre-selects your preferred seat if it's available.",
  },
];

export function OnboardingModal() {
  const { hasSeenOnboarding, setHasSeenOnboarding } = useAppContext();
  const [step, setStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  if (hasSeenOnboarding) return null;

  const isLast = step === steps.length - 1;

  const handleDone = () => setHasSeenOnboarding(true);

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,18,121,0.65)", backdropFilter: "blur(6px)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-8 pb-0">
            <button
              onClick={handleDone}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress dots */}
            <div className="flex gap-2 mb-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-muted"}`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {!showVideo ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="px-8 pb-8"
              >
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-primary"
                  style={{ background: "#FFF0E8" }}>
                  {steps[step].icon}
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-3">{steps[step].title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{steps[step].desc}</p>

                {isLast && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="flex items-center gap-3 w-full bg-secondary text-white rounded-xl p-4 mb-6 hover:bg-secondary/90 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Watch the 90-second tour</p>
                      <p className="text-white/60 text-xs">See Multaqa in action before you book</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-white/50" />
                  </button>
                )}

                <div className="flex gap-3">
                  {step > 0 && (
                    <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1 h-12 border-border">
                      Back
                    </Button>
                  )}
                  {!isLast ? (
                    <Button onClick={() => setStep(s => s + 1)} className="flex-1 h-12 bg-primary hover:bg-primary/90">
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleDone} className="flex-1 h-12 bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  )}
                </div>
                <button onClick={handleDone} className="w-full mt-4 text-sm text-muted-foreground hover:text-secondary transition-colors">
                  Skip tour
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="video"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="px-8 pb-8"
              >
                <h2 className="text-2xl font-bold text-secondary mb-2">Multaqa in 90 seconds</h2>
                <p className="text-muted-foreground mb-6 text-sm">See how easy it is to find, book, and arrive at your space.</p>

                {/* Video placeholder */}
                <div className="rounded-xl overflow-hidden bg-secondary aspect-video flex flex-col items-center justify-center mb-6 relative"
                  style={{ background: "linear-gradient(135deg,#000840,#001279)" }}>
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                  <p className="text-white font-semibold">Explainer Video</p>
                  <p className="text-white/50 text-sm mt-1">Placeholder — replace with real embed</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowVideo(false)} className="flex-1 h-12 border-border">
                    Back
                  </Button>
                  <Button onClick={handleDone} className="flex-1 h-12 bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
