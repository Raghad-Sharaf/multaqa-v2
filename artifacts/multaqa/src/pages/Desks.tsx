import { useState } from "react";
import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, Zone, DeskType } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, Monitor, BatteryCharging, Heart, BellRing, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { WaitlistModal } from "@/components/WaitlistModal";

type AmenityFilter = "All" | "Window" | "Monitor" | "Standing Desk";

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-1 rounded-full text-sm font-medium border transition-all whitespace-nowrap"
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

      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-4">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: "#001279" }}>Browse Desks</h1>
            <p className="text-sm" style={{ color: "#535060" }}>Find your perfect spot. Available now.</p>
          </div>

          {/* Location switcher */}
          <div
            className="inline-flex items-center gap-1 p-1 rounded-xl border bg-white"
            style={{ borderColor: "rgba(0,18,121,0.15)" }}
          >
            <span className="pl-2 pr-1"><MapPin className="w-4 h-4" style={{ color: "#535060" }} /></span>
            {(["Nablus", "Ramallah"] as const).map(loc => (
              <button
                key={loc}
                onClick={() => setCurrentLocation(loc)}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                style={
                  currentLocation === loc
                    ? { background: "#001279", color: "white" }
                    : { color: "#535060" }
                }
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div
          className="bg-white rounded-xl border p-4 space-y-3 mb-8"
          style={{ borderColor: "rgba(0,18,121,0.1)" }}
        >
          <div className="flex items-center flex-wrap gap-2">
            <SlidersHorizontal className="w-4 h-4 shrink-0" style={{ color: "#535060" }} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Zone:</span>
            {(["All", "Deep Work", "Calls Allowed"] as const).map(z => (
              <Pill key={z} label={z} active={filterZone === z} onClick={() => setFilterZone(z)} />
            ))}
            <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block" />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Type:</span>
            {(["All", "Flex Desk", "Hot Desk", "Dedicated Desk"] as const).map(t => (
              <Pill key={t} label={t} active={filterType === t} onClick={() => setFilterType(t as DeskType | "All")} />
            ))}
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Amenity:</span>
            {(["All", "Window", "Monitor", "Standing Desk"] as const).map(a => (
              <Pill key={a} label={a} active={filterAmenity === a} onClick={() => setFilterAmenity(a)} />
            ))}
            {favorites.length > 0 && (
              <span className="ml-auto text-xs font-medium flex items-center gap-1" style={{ color: "#FF5100" }}>
                <Heart className="w-3.5 h-3.5 fill-current" /> {favorites.length} favourited
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
        {filteredDesks.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border" style={{ borderColor: "rgba(0,18,121,0.1)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#001279" }}>No desks found</h3>
            <p className="text-sm mb-6" style={{ color: "#535060" }}>Try adjusting your filters to see more options.</p>
            <Button variant="outline" onClick={() => { setFilterZone("All"); setFilterType("All"); setFilterAmenity("All"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDesks.map((desk, idx) => {
              const isFav = favorites.includes(desk.id);
              return (
                <motion.div
                  key={desk.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: idx * 0.04 }}
                  className="group bg-white rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ borderColor: "rgba(0,18,121,0.09)" }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-muted shrink-0">
                    <img
                      src={desk.image} alt={desk.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${desk.status === "Maintenance" ? "grayscale opacity-70" : ""}`}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: desk.zone === "Deep Work" ? "#001279" : "#FF5100" }}
                      >{desk.zone}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white"
                        style={{
                          color: desk.status === "Available" ? "#1A7A4A" : desk.status === "Reserved" ? "#CC1A00" : "#D97706",
                          borderColor: desk.status === "Available" ? "#1A7A4A" : desk.status === "Reserved" ? "#CC1A00" : "#D97706",
                        }}
                      >{desk.status}</span>
                    </div>
                    <button
                      onClick={e => { e.preventDefault(); toggleFavorite(desk.id); }}
                      className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current text-red-500" : "text-gray-400"}`} />
                    </button>
                    {isFav && (
                      <div className="absolute bottom-2.5 left-2.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5" style={{ background: "#FF5100" }}>
                        ★ Favourite
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base" style={{ color: "#001279" }}>{desk.name}</h3>
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md shrink-0"
                        style={{ background: "#F5F5F5", color: "#535060" }}
                      >{desk.type}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {desk.amenities.slice(0, 2).map(am => (
                        <span key={am} className="text-[11px] flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: "#F5F7FF", color: "#535060" }}>
                          {am.toLowerCase().includes("monitor") && <Monitor className="w-3 h-3" />}
                          {am.toLowerCase().includes("power") && <BatteryCharging className="w-3 h-3" />}
                          {am}
                        </span>
                      ))}
                      <span className="text-[11px] flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: "#F5F7FF", color: "#535060" }}>
                        <Wifi className="w-3 h-3" /> {desk.wifi}
                      </span>
                    </div>

                    <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(0,18,121,0.07)" }}>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#535060" }}>From</p>
                        <p className="font-bold" style={{ color: "#001279" }}>
                          {desk.priceHour} ILS <span className="text-xs font-normal" style={{ color: "#535060" }}>/hr</span>
                        </p>
                      </div>

                      {desk.status === "Available" ? (
                        <Link href={`/desks/${desk.id}`}>
                          <button
                            className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white transition-colors"
                            style={{ background: "#FF5100" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#e04800")}
                            onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
                          >
                            View Details
                          </button>
                        </Link>
                      ) : desk.status === "Reserved" ? (
                        <button
                          onClick={() => setWaitlistTarget({ id: desk.id, name: desk.name, type: "desk" })}
                          className="text-sm font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors"
                          style={{ color: "#FF5100", borderColor: "#FF5100" }}
                        >
                          <BellRing className="w-3.5 h-3.5" /> Waitlist
                        </button>
                      ) : (
                        <Link href={`/desks/${desk.id}`}>
                          <button className="text-sm font-medium px-3 py-1.5 rounded-lg border" style={{ color: "#535060", borderColor: "rgba(0,0,0,0.15)" }}>
                            View
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
