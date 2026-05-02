import { useState } from "react";
import { Link, useRoute } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft, Wifi, CheckCircle2, Star, MapPin, Heart, BellRing } from "lucide-react";
import { NotFound } from "@/pages/not-found";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function DeskDetail() {
  const [match, params] = useRoute("/desks/:id");
  const { desks, favorites, toggleFavorite } = useAppContext();
  const [showWaitlist, setShowWaitlist] = useState(false);

  if (!match || !params.id) return <NotFound />;
  const desk = desks.find(d => d.id === params.id);
  if (!desk) return <NotFound />;

  const isFav = favorites.includes(desk.id);

  return (
    <UserLayout>
      {showWaitlist && (
        <WaitlistModal itemId={desk.id} itemName={desk.name} itemType="desk" onClose={() => setShowWaitlist(false)} />
      )}

      {/* Back bar */}
      <div className="border-b py-4" style={{ borderColor: "rgba(0,18,121,0.07)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <Link href="/desks" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: "#535060" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FF5100")}
            onMouseLeave={e => (e.currentTarget.style.color = "#535060")}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all desks
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image */}
            <div className="rounded-2xl overflow-hidden border h-[220px] sm:h-[300px] relative" style={{ borderColor: "rgba(0,18,121,0.09)" }}>
              <img src={desk.image} alt={desk.name} className="w-full h-full object-cover" />
              <button
                onClick={() => toggleFavorite(desk.id)}
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
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: desk.zone === "Deep Work" ? "#001279" : "#FF5100" }}>
                  {desk.zone === "Deep Work" ? "Deep Work Zone" : "Calls Allowed"}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border" style={{ color: "#535060", borderColor: "rgba(0,18,121,0.18)" }}>
                  {desk.type}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                  style={{
                    color: desk.status === "Available" ? "#1A7A4A" : desk.status === "Reserved" ? "#CC2200" : "#D97706",
                    borderColor: desk.status === "Available" ? "#1A7A4A" : desk.status === "Reserved" ? "#CC2200" : "#D97706",
                  }}>
                  {desk.status}
                </span>
              </div>
              <h1 className="font-bold mb-1.5" style={{ fontSize: "clamp(20px, 3vw, 28px)", color: "#001279" }}>{desk.name}</h1>
              <p className="flex items-center gap-1.5 text-[14px]" style={{ color: "#535060" }}>
                <MapPin className="w-3.5 h-3.5" /> Multaqa — {desk.location}
              </p>
            </div>

            {/* Amenities */}
            <div className="border-t pt-6" style={{ borderColor: "rgba(0,18,121,0.07)" }}>
              <h2 className="font-bold mb-4" style={{ fontSize: "18px", color: "#001279" }}>Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {desk.amenities.map(am => (
                  <div key={am} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#1A7A4A" }} />
                    <span className="text-[14px] font-medium" style={{ color: "#001279" }}>{am}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 shrink-0" style={{ color: "#1A7A4A" }} />
                  <span className="text-[14px] font-medium" style={{ color: "#001279" }}>{desk.wifi} Speed WiFi</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t pt-6" style={{ borderColor: "rgba(0,18,121,0.07)" }}>
              <h2 className="font-bold mb-4" style={{ fontSize: "18px", color: "#001279" }}>Reviews</h2>
              <div className="rounded-xl p-4 border" style={{ background: "oklch(97% .02 268)", borderColor: "rgba(0,18,121,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <span className="text-[12px]" style={{ color: "#535060" }}>Oct 2025</span>
                </div>
                <p className="text-[14px] italic mb-2" style={{ color: "#001279" }}>"Great WiFi here, stayed all day and got so much done. Very quiet zone."</p>
                <p className="text-[12px] font-medium" style={{ color: "#535060" }}>— Khalid M.</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border shadow-lg p-5" style={{ borderColor: "rgba(0,18,121,0.1)" }}>
              <h3 className="font-bold mb-1" style={{ fontSize: "18px", color: "#001279" }}>Book {desk.name}</h3>
              <p className="text-[12px] mb-5" style={{ color: "#535060" }}>Choose your session length.</p>

              <div className="mb-5 space-y-0">
                {[
                  { label: "Per Hour", price: desk.priceHour, note: "" },
                  ...(desk.priceHalfDay ? [{ label: "Half Day", price: desk.priceHalfDay, note: "4 hrs" }] : []),
                  ...(desk.priceFullDay ? [{ label: "Full Day", price: desk.priceFullDay, note: "8 hrs" }] : []),
                ].map((row, i, arr) => (
                  <div key={row.label} className={`flex justify-between items-center py-2.5 ${i < arr.length - 1 ? "border-b" : ""}`} style={{ borderColor: "rgba(0,18,121,0.07)" }}>
                    <span className="text-[14px]" style={{ color: "#535060" }}>
                      {row.label} {row.note && <span className="text-[11px] opacity-70">({row.note})</span>}
                    </span>
                    <span className="font-bold text-[14px]" style={{ color: "#001279" }}>{row.price} ILS</span>
                  </div>
                ))}
              </div>

              {desk.status === "Available" ? (
                <div className="flex flex-col gap-3">
                  <Link href={`/book/step1?item=${desk.id}&type=desk`}>
                    <button
                      className="w-full h-11 rounded-xl text-white text-[14px] font-semibold transition-colors"
                      style={{ background: "#FF5100" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#e04800")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#FF5100")}
                    >
                      Book This Desk
                    </button>
                  </Link>
                  <button
                    onClick={() => toggleFavorite(desk.id)}
                    className="w-full h-10 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-2 transition-all"
                    style={isFav
                      ? { borderColor: "#FF5100", color: "#FF5100", background: "rgba(255,81,0,0.04)" }
                      : { borderColor: "rgba(0,18,121,0.18)", color: "#535060" }
                    }
                    onMouseEnter={e => { if (!isFav) { e.currentTarget.style.borderColor = "#FF5100"; e.currentTarget.style.color = "#FF5100"; } }}
                    onMouseLeave={e => { if (!isFav) { e.currentTarget.style.borderColor = "rgba(0,18,121,0.18)"; e.currentTarget.style.color = "#535060"; } }}
                  >
                    <Heart className="w-3.5 h-3.5" style={isFav ? { fill: "#FF5100", color: "#FF5100" } : {}} />
                    {isFav ? "Saved as Favourite" : "Save as Favourite"}
                  </button>
                </div>
              ) : desk.status === "Reserved" ? (
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
                    onClick={() => toggleFavorite(desk.id)}
                    className="w-full h-10 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-2"
                    style={isFav ? { borderColor: "#FF5100", color: "#FF5100", background: "rgba(255,81,0,0.04)" } : { borderColor: "rgba(0,18,121,0.18)", color: "#535060" }}
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
