import { useState } from "react";
import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, Zone, DeskType } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { MapPin, Wifi, Monitor, BatteryCharging, Heart, BellRing, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { WaitlistModal } from "@/components/WaitlistModal";

type AmenityFilter = "All" | "Window" | "Monitor" | "Standing Desk";

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium border transition-all whitespace-nowrap"
      style={
        active
          ? { background: "#FF5100", color: "white", borderColor: "#FF5100" }
          : { background: "white", color: "#535060", borderColor: "rgba(0,0,0,0.18)" }
      }
    >
      {label}
    </button>
  );
}

export default function Desks() {
  const { desks, currentLocation, setCurrentLocation, favorites, toggleFavorite } = useAppContext();

  const [filterZone, setFilterZone] = useState<Zone | "All">("All");
  const [filterType, setFilterType] = useState<DeskType | "All">("All");
  const [filterAmenity, setFilterAmenity] = useState<AmenityFilter>("All");
  const [waitlistTarget, setWaitlistTarget] = useState<{ id: string; name: string; type: "desk" | "room" } | null>(null);

  const filteredDesks = desks.filter(d =>
    d.location === currentLocation &&
    (filterZone === "All" || d.zone === filterZone) &&
    (filterType === "All" || d.type === filterType) &&
    (filterAmenity === "All" ||
      (filterAmenity === "Window" && d.amenities.some(a => a.toLowerCase().includes("window"))) ||
      (filterAmenity === "Monitor" && d.amenities.some(a => a.toLowerCase().includes("monitor"))) ||
      (filterAmenity === "Standing Desk" && d.amenities.some(a => a.toLowerCase().includes("standing"))))
  );

  return (
    <UserLayout>
      {waitlistTarget && (
        <WaitlistModal
          itemId={waitlistTarget.id}
          itemName={waitlistTarget.name}
          itemType={waitlistTarget.type}
          onClose={() => setWaitlistTarget(null)}
        />
      )}

      {/* Header + Filters */}
      <div className="w-full border-b" style={{ borderColor: "rgba(0,18,121,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#001279" }}>Browse Desks</h1>
              <p className="text-sm" style={{ color: "#535060" }}>Find your perfect spot. Available now.</p>
            </div>
            <div className="inline-flex items-center gap-1 p-1 rounded-xl border bg-white shrink-0" style={{ borderColor: "rgba(0,18,121,0.15)" }}>
              <span className="pl-2 pr-1"><MapPin className="w-4 h-4" style={{ color: "#535060" }} /></span>
              {(["Nablus", "Ramallah"] as const).map(loc => (
                <button key={loc} onClick={() => setCurrentLocation(loc)}
                  className="px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                  style={currentLocation === loc ? { background: "#001279", color: "white" } : { color: "#535060" }}
                >{loc}</button>
              ))}
            </div>
          </div>

          {/* Filter bar — full width */}
          <div className="w-full bg-white rounded-xl border p-3 sm:p-4 space-y-2.5" style={{ borderColor: "rgba(0,18,121,0.1)" }}>
            <div className="flex items-center flex-wrap gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" style={{ color: "#535060" }} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Zone:</span>
              {(["All", "Deep Work", "Calls Allowed"] as const).map(z => (
                <Pill key={z} label={z} active={filterZone === z} onClick={() => setFilterZone(z)} />
              ))}
              <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Type:</span>
              {(["All", "Flex Desk", "Hot Desk", "Dedicated Desk"] as const).map(t => (
                <Pill key={t} label={t} active={filterType === t} onClick={() => setFilterType(t as DeskType | "All")} />
              ))}
              {favorites.length > 0 && (
                <span className="ml-auto text-xs font-medium flex items-center gap-1 shrink-0" style={{ color: "#FF5100" }}>
                  <Heart className="w-3.5 h-3.5 fill-current" /> {favorites.length}
                </span>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Amenity:</span>
              {(["All", "Window", "Monitor", "Standing Desk"] as const).map(a => (
                <Pill key={a} label={a} active={filterAmenity === a} onClick={() => setFilterAmenity(a)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {filteredDesks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border" style={{ borderColor: "rgba(0,18,121,0.1)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#001279" }}>No desks found</h3>
            <p className="text-sm mb-5" style={{ color: "#535060" }}>Try adjusting your filters.</p>
            <Button variant="outline" onClick={() => { setFilterZone("All"); setFilterType("All"); setFilterAmenity("All"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDesks.map((desk, idx) => {
              const isFav = favorites.includes(desk.id);
              const href = `/desks/${desk.id}`;
              return (
                <motion.div
                  key={desk.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                >
                  <Link href={href} className="block h-full">
                    <div
                      className="group bg-white rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md cursor-pointer"
                      style={{ border: "1px solid oklch(90% .005 285)" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#FF5100")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "oklch(90% .005 285)")}
                    >
                      {/* Image */}
                      <div className="relative h-40 sm:h-44 overflow-hidden shrink-0">
                        <img src={desk.image} alt={desk.name}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${desk.status === "Maintenance" ? "grayscale opacity-70" : ""}`}
                        />
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: desk.zone === "Deep Work" ? "#001279" : "#FF5100" }}>
                            {desk.zone}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ background: desk.status === "Available" ? "#1A7A4A" : desk.status === "Reserved" ? "#CC2200" : "#D97706", color: "white" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />{desk.status}
                          </span>
                        </div>
                        <button
                          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(desk.id); }}
                          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                        </button>
                      </div>

                      {/* Body */}
                      <div className="p-3.5 flex-1 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm leading-tight" style={{ color: "#001279" }}>{desk.name}</h3>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0" style={{ background: "#F5F5F5", color: "#535060" }}>{desk.type}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {desk.amenities.slice(0, 2).map(am => (
                            <span key={am} className="text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ background: "#F5F7FF", color: "#535060" }}>
                              {am.toLowerCase().includes("monitor") && <Monitor className="w-2.5 h-2.5" />}
                              {am.toLowerCase().includes("power") && <BatteryCharging className="w-2.5 h-2.5" />}
                              {am.toLowerCase().includes("window") && <span className="text-[9px]">⊞</span>}
                              {am}
                            </span>
                          ))}
                          <span className="text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ background: "#F5F7FF", color: "#535060" }}>
                            <Wifi className="w-2.5 h-2.5" /> {desk.wifi}
                          </span>
                        </div>

                        <div className="mt-auto pt-2.5 border-t flex items-center justify-between" style={{ borderColor: "rgba(0,18,121,0.07)" }}>
                          <div>
                            <p className="text-[9px] font-medium uppercase tracking-wide" style={{ color: "#535060" }}>From</p>
                            <p className="font-bold text-sm" style={{ color: "#001279" }}>
                              {desk.priceHour} ILS<span className="text-[10px] font-normal" style={{ color: "#535060" }}>/hr</span>
                            </p>
                          </div>

                          {desk.status !== "Reserved" ? (
                            <span className="font-semibold" style={{ fontSize: "12px", color: "#FF5100" }}>
                              View Details →
                            </span>
                          ) : (
                            <button
                              onClick={e => { e.preventDefault(); e.stopPropagation(); setWaitlistTarget({ id: desk.id, name: desk.name, type: "desk" }); }}
                              className="text-[11px] font-semibold flex items-center gap-1"
                              style={{ color: "#FF5100" }}
                            >
                              <BellRing className="w-3 h-3" /> Waitlist
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
