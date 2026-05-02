import { useState } from "react";
import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, RoomType } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { MapPin, Users, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

type AmenityFilter = "All" | "Whiteboard" | "TV Screen" | "Video Conf";

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

export default function Rooms() {
  const { rooms, currentLocation, setCurrentLocation } = useAppContext();

  const [filterType, setFilterType] = useState<RoomType | "All">("All");
  const [filterAmenity, setFilterAmenity] = useState<AmenityFilter>("All");

  const filteredRooms = rooms.filter(r =>
    r.location === currentLocation &&
    (filterType === "All" || r.type === filterType) &&
    (filterAmenity === "All" ||
      (filterAmenity === "Whiteboard" && r.equipment.some(e => e.toLowerCase().includes("whiteboard"))) ||
      (filterAmenity === "TV Screen" && r.equipment.some(e => e.toLowerCase().includes("tv") || e.toLowerCase().includes("screen"))) ||
      (filterAmenity === "Video Conf" && r.equipment.some(e => e.toLowerCase().includes("video"))))
  );

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-4">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: "#001279" }}>Browse Rooms</h1>
            <p className="text-sm" style={{ color: "#535060" }}>Professional spaces for meetings, calls, and focused team work.</p>
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
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Type:</span>
            {(["All", "Private Office", "Meeting Room", "Phone Booth"] as const).map(t => (
              <Pill key={t} label={t} active={filterType === t} onClick={() => setFilterType(t as RoomType | "All")} />
            ))}
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#001279" }}>Amenity:</span>
            {(["All", "Whiteboard", "TV Screen", "Video Conf"] as const).map(a => (
              <Pill key={a} label={a} active={filterAmenity === a} onClick={() => setFilterAmenity(a)} />
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border" style={{ borderColor: "rgba(0,18,121,0.1)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#001279" }}>No rooms found</h3>
            <p className="text-sm mb-6" style={{ color: "#535060" }}>Try adjusting your filters to see more options.</p>
            <Button variant="outline" onClick={() => { setFilterType("All"); setFilterAmenity("All"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.04 }}
                className="group bg-white rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderColor: "rgba(0,18,121,0.09)" }}
              >
                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#FF5100" }}>
                      {room.type}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{
                        background: room.status === "Available" ? "#1A7A4A" : room.status === "Reserved" ? "#CC1A00" : "#D97706",
                      }}
                    >{room.status}</span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                    <h3 className="font-bold text-lg text-white drop-shadow">{room.name}</h3>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs font-medium border border-white/20">
                      <Users className="w-3.5 h-3.5" /> {room.capacity}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {room.equipment.slice(0, 3).map(eq => (
                      <span key={eq} className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: "#F5F7FF", color: "#001279" }}>
                        {eq}
                      </span>
                    ))}
                    {room.equipment.length > 3 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "#F5F5F5", color: "#535060" }}>
                        +{room.equipment.length - 3}
                      </span>
                    )}
                    {room.equipment.length === 0 && (
                      <span className="text-[11px] italic" style={{ color: "#535060" }}>Standard equipment</span>
                    )}
                  </div>

                  <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(0,18,121,0.07)" }}>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#535060" }}>Rate</p>
                      <p className="font-bold text-lg" style={{ color: "#001279" }}>
                        {room.priceHour} ILS <span className="text-xs font-normal" style={{ color: "#535060" }}>/hr</span>
                      </p>
                    </div>

                    <Link href={`/rooms/${room.id}`}>
                      <button
                        className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white transition-colors"
                        style={{ background: room.status === "Available" ? "#FF5100" : "#535060" }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        {room.status === "Available" ? "View Details" : "View"}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
