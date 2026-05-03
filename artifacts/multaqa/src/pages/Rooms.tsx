import { useState } from "react";
import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { MapPin, Users, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

type AmenityFilter = "All" | "Whiteboard" | "TV Screen" | "Video Conf";
type TypeFilter = "All" | "Private Office" | "Meeting Room" | "Phone Booth";

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

export default function Rooms() {
  const { rooms, currentLocation, setCurrentLocation } = useAppContext();
  const [filterType, setFilterType] = useState<TypeFilter>("All");
  const [filterAmenity, setFilterAmenity] = useState<AmenityFilter>("All");

  const filteredRooms = rooms.filter(r =>
    r.location === currentLocation &&
    (filterType === "All" ||
      (filterType === "Private Office" && r.type.startsWith("Private Office")) ||
      r.type === filterType) &&
    (filterAmenity === "All" ||
      (filterAmenity === "Whiteboard" && r.equipment.some(e => e.toLowerCase().includes("whiteboard"))) ||
      (filterAmenity === "TV Screen" && r.equipment.some(e => e.toLowerCase().includes("display") || e.toLowerCase().includes("screen") || e.toLowerCase().includes("tv"))) ||
      (filterAmenity === "Video Conf" && r.equipment.some(e => e.toLowerCase().includes("video"))))
  );

  const typeLabel = (type: string) => {
    if (type === "Private Office - Solo") return "Solo Office";
    if (type === "Private Office - 2") return "Duo Office";
    if (type === "Private Office - Team 4") return "Team Office";
    return type;
  };

  return (
    <UserLayout>
      {/* Header + Filters */}
      <div className="w-full border-b" style={{ borderColor: "rgba(0,18,121,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#001279" }}>Browse Rooms</h1>
              <p className="text-sm" style={{ color: "#535060" }}>Professional spaces for meetings, calls, and focused team work.</p>
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

          {/* Filter bar */}
          <div className="w-full bg-white rounded-xl border p-3 sm:p-4 space-y-2.5" style={{ borderColor: "rgba(0,18,121,0.1)" }}>
            <div className="flex items-center flex-wrap gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" style={{ color: "#535060" }} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Type:</span>
              {(["All", "Private Office", "Meeting Room", "Phone Booth"] as const).map(t => (
                <Pill key={t} label={t} active={filterType === t} onClick={() => setFilterType(t)} />
              ))}
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Amenity:</span>
              {(["All", "Whiteboard", "TV Screen", "Video Conf"] as const).map(a => (
                <Pill key={a} label={a} active={filterAmenity === a} onClick={() => setFilterAmenity(a)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border" style={{ borderColor: "oklch(90% .005 285)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#001279" }}>No rooms found</h3>
            <p className="text-sm mb-5" style={{ color: "#535060" }}>Try adjusting your filters.</p>
            <Button variant="outline" onClick={() => { setFilterType("All"); setFilterAmenity("All"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
              >
                <Link href={`/rooms/${room.id}`} className="block h-full">
                  <div
                    className="group bg-white rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md cursor-pointer"
                    style={{ border: "1px solid oklch(90% .005 285)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#FF5100")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "oklch(90% .005 285)")}
                  >
                    <div className="relative h-44 sm:h-48 overflow-hidden shrink-0">
                      <img src={room.image} alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#FF5100" }}>
                          {typeLabel(room.type)}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-1"
                          style={{ background: room.status === "Available" ? "#1A7A4A" : room.status === "Reserved" ? "#CC2200" : "#D97706" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />{room.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <h3 className="font-bold text-base text-white drop-shadow leading-tight">{room.name}</h3>
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[10px] font-medium border border-white/20 shrink-0">
                          <Users className="w-3 h-3" /> {room.capacity}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1">
                        {room.equipment.slice(0, 3).map(eq => (
                          <span key={eq} className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: "#F5F7FF", color: "#001279" }}>
                            {eq}
                          </span>
                        ))}
                        {room.equipment.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#F5F5F5", color: "#535060" }}>
                            +{room.equipment.length - 3}
                          </span>
                        )}
                        {room.equipment.length === 0 && (
                          <span className="text-[10px] italic" style={{ color: "#535060" }}>Standard equipment</span>
                        )}
                      </div>

                      <div className="mt-auto pt-2.5 border-t flex items-center justify-between" style={{ borderColor: "oklch(90% .005 285)" }}>
                        <div>
                          <p className="text-[9px] font-medium uppercase tracking-wide" style={{ color: "#535060" }}>Rate</p>
                          <p className="font-bold text-sm" style={{ color: "#001279" }}>
                            {room.priceHour} ILS<span className="text-[10px] font-normal" style={{ color: "#535060" }}>/hr</span>
                          </p>
                        </div>
                        <span className="font-semibold" style={{ fontSize: "12px", color: room.status === "Available" ? "#FF5100" : "#535060" }}>
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
