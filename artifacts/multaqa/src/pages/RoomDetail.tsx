import { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft, Users, CheckCircle2, MapPin, Heart, BellRing, Star } from "lucide-react";
import { NotFound } from "@/pages/not-found";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function RoomDetail() {
  const [match, params] = useRoute("/rooms/:id");
  const [, setLocation] = useLocation();
  const { rooms, favorites, toggleFavorite, currentUser } = useAppContext();
  const [showWaitlist, setShowWaitlist] = useState(false);

  if (!match || !params.id) return <NotFound />;
  const room = rooms.find(r => r.id === params.id);
  if (!room) return <NotFound />;

  const handleBookClick = (e?: React.MouseEvent) => {
    if (!currentUser) {
      e?.preventDefault();
      localStorage.setItem("redirectAfterLogin", `/rooms/${room.id}`);
      setLocation("/login?message=Please log in to complete your booking.");
    }
  };

  const isFav = favorites.includes(room.id);

  const typeLabel = (type: string) => {
    if (type === "Private Office - Solo") return "Solo Office";
    if (type === "Private Office - 2") return "Duo Office";
    if (type === "Private Office - Team 4") return "Team Office";
    return type;
  };

  return (
    <UserLayout>
      {showWaitlist && (
        <WaitlistModal itemId={room.id} itemName={room.name} itemType="room" onClose={() => setShowWaitlist(false)} />
      )}

      {/* Back bar */}
      <div className="border-b py-4" style={{ borderColor: "oklch(90% .005 285)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <Link href="/rooms" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: "#535060" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
            onMouseLeave={e => (e.currentTarget.style.color = "#535060")}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all rooms
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image */}
            <div className="rounded-2xl overflow-hidden h-[220px] sm:h-[300px] relative" style={{ border: "1px solid oklch(90% .005 285)" }}>
              <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              <button
                onClick={() => toggleFavorite(room.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow border transition-all"
                style={isFav ? { background: "#FF5100", borderColor: "#FF5100" } : { background: "rgba(255,255,255,0.92)", borderColor: "rgba(255,255,255,0.3)" }}
              >
                <Heart className="w-4 h-4" style={isFav ? { fill: "white", color: "white" } : { color: "#535060" }} />
              </button>
              {isFav && (
                <div className="absolute top-3 left-3 text-white text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#FF5100" }}>
                  ★ Favourite
                </div>
              )}
            </div>

            {/* Title block */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#FF5100" }}>
                  {typeLabel(room.type)}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: room.status === "Available" ? "#1A7A4A" : room.status === "Reserved" ? "#CC2200" : "#D97706" }}>
                  {room.status}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                  style={{ background: "#F0F2FF", color: "#001279", borderColor: "oklch(90% .005 285)" }}>
                  <Users className="w-3 h-3" /> Up to {room.capacity} {room.capacity === 1 ? "person" : "people"}
                </div>
              </div>
              <h1 className="font-bold mb-1.5" style={{ fontSize: "clamp(20px, 3vw, 28px)", color: "#001279" }}>{room.name}</h1>
              <p className="flex items-center gap-1.5 text-[14px]" style={{ color: "#535060" }}>
                <MapPin className="w-3.5 h-3.5" /> Multaqa — {room.location}
              </p>
            </div>

            {/* Equipment */}
            <div className="border-t pt-6" style={{ borderColor: "oklch(90% .005 285)" }}>
              <h2 className="font-bold mb-4" style={{ fontSize: "18px", color: "#001279" }}>Included Equipment</h2>
              {room.equipment.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border" style={{ background: "oklch(97% .02 268)", borderColor: "oklch(90% .005 285)" }}>
                  {room.equipment.map(eq => (
                    <div key={eq} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(26,122,74,0.12)" }}>
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#1A7A4A" }} />
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: "#001279" }}>{eq}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] italic" style={{ color: "#535060" }}>Standard room setup.</p>
              )}
            </div>

            {/* About */}
            <div className="border-t pt-6" style={{ borderColor: "oklch(90% .005 285)" }}>
              <h2 className="font-bold mb-3" style={{ fontSize: "18px", color: "#001279" }}>About this space</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "#535060" }}>
                The {room.name} is a premium {typeLabel(room.type).toLowerCase()} designed for privacy and productivity.
                Whether you're hosting an important client meeting, running a team workshop, or need a quiet
                space for deep work, this room provides the professional environment you need in the heart of {room.location}.
              </p>
            </div>

            {/* Reviews */}
            <div className="border-t pt-6" style={{ borderColor: "oklch(90% .005 285)" }}>
              <h2 className="font-bold mb-4" style={{ fontSize: "18px", color: "#001279" }}>Reviews</h2>
              <div className="space-y-3">
                <div className="rounded-xl p-4 border" style={{ background: "oklch(97% .02 268)", borderColor: "oklch(90% .005 285)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <span className="text-[12px]" style={{ color: "#535060" }}>Oct 2025</span>
                  </div>
                  <p className="text-[14px] italic mb-2" style={{ color: "#001279" }}>"Great space for our team meeting. Perfect setup, loved the whiteboard and display!"</p>
                  <p className="text-[12px] font-medium" style={{ color: "#535060" }}>— Tala A.</p>
                </div>
                <div className="rounded-xl p-4 border" style={{ background: "oklch(97% .02 268)", borderColor: "oklch(90% .005 285)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <span className="text-[12px]" style={{ color: "#535060" }}>Nov 2025</span>
                  </div>
                  <p className="text-[14px] italic mb-2" style={{ color: "#001279" }}>"Soundproofed and professional — exactly what we needed for our client call."</p>
                  <p className="text-[12px] font-medium" style={{ color: "#535060" }}>— Omar S.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-5" style={{ border: "1px solid oklch(90% .005 285)" }}>
              <h3 className="font-bold mb-1" style={{ fontSize: "18px", color: "#001279" }}>Book {room.name}</h3>
              <p className="text-[12px] mb-5" style={{ color: "#535060" }}>Choose your duration to see available times.</p>

              <div className="mb-5 rounded-xl border p-3 space-y-0" style={{ background: "oklch(97% .02 268)", borderColor: "oklch(90% .005 285)" }}>
                {[
                  { label: "Per Hour", price: room.priceHour, note: "" },
                  ...(room.priceHalfDay ? [{ label: "Half Day", price: room.priceHalfDay, note: "4 hrs" }] : []),
                ].map((row, i, arr) => (
                  <div key={row.label} className={`flex justify-between items-center py-2.5 ${i < arr.length - 1 ? "border-b" : ""}`} style={{ borderColor: "oklch(90% .005 285)" }}>
                    <span className="text-[14px] font-medium" style={{ color: "#535060" }}>
                      {row.label} {row.note && <span className="text-[11px] opacity-70">({row.note})</span>}
                    </span>
                    <span className="font-bold text-[14px]" style={{ color: "#001279" }}>{row.price} ILS</span>
                  </div>
                ))}
              </div>

              {room.status === "Available" ? (
                <div className="flex flex-col gap-3">
                  <Link href={currentUser ? `/book/step1?item=${room.id}&type=room` : "/login"} onClick={handleBookClick}>
                    <button
                      className="w-full h-11 rounded-xl text-white text-[14px] font-semibold transition-colors"
                      style={{ background: "#FF5100" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#e04800")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
                    >
                      Book This Room
                    </button>
                  </Link>
                  <button
                    onClick={() => toggleFavorite(room.id)}
                    className="w-full h-10 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-2 transition-all"
                    style={isFav
                      ? { borderColor: "#FF5100", color: "#FF5100", background: "rgba(255,81,0,0.04)" }
                      : { borderColor: "oklch(90% .005 285)", color: "#535060" }
                    }
                    onMouseEnter={e => { if (!isFav) { e.currentTarget.style.borderColor = "#FF5100"; e.currentTarget.style.color = "#FF5100"; } }}
                    onMouseLeave={e => { if (!isFav) { e.currentTarget.style.borderColor = "oklch(90% .005 285)"; e.currentTarget.style.color = "#535060"; } }}
                  >
                    <Heart className="w-3.5 h-3.5" style={isFav ? { fill: "#FF5100", color: "#FF5100" } : {}} />
                    {isFav ? "Saved as Favourite" : "Save as Favourite"}
                  </button>
                </div>
              ) : room.status === "Reserved" ? (
                <div className="flex flex-col gap-3">
                  <div className="text-center py-2.5 rounded-xl border text-[13px] font-semibold" style={{ background: "rgba(204,34,0,0.06)", color: "#CC2200", borderColor: "rgba(204,34,0,0.2)" }}>
                    Currently Reserved
                  </div>
                  <button
                    className="w-full h-11 rounded-xl border text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors"
                    style={{ borderColor: "#FF5100", color: "#FF5100" }}
                    onClick={() => setShowWaitlist(true)}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,81,0,0.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <BellRing className="w-4 h-4" /> Join Waitlist
                  </button>
                  <button
                    onClick={() => toggleFavorite(room.id)}
                    className="w-full h-10 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-2"
                    style={isFav ? { borderColor: "#FF5100", color: "#FF5100", background: "rgba(255,81,0,0.04)" } : { borderColor: "oklch(90% .005 285)", color: "#535060" }}
                  >
                    <Heart className="w-3.5 h-3.5" style={isFav ? { fill: "#FF5100", color: "#FF5100" } : {}} />
                    {isFav ? "Saved as Favourite" : "Save as Favourite"}
                  </button>
                </div>
              ) : (
                <div className="text-center py-3 rounded-xl border text-[13px] font-semibold" style={{ background: "rgba(217,119,6,0.08)", color: "#D97706", borderColor: "rgba(217,119,6,0.25)" }}>
                  Under Maintenance
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
