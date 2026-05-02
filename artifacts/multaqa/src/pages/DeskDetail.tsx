import { useState } from "react";
import { Link, useRoute } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <WaitlistModal
          itemId={desk.id}
          itemName={desk.name}
          itemType="desk"
          onClose={() => setShowWaitlist(false)}
        />
      )}

      <div className="bg-muted border-b border-border py-6">
        <div className="container mx-auto px-6">
          <Link href="/desks" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-secondary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all desks
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-[400px] relative">
              <img src={desk.image} alt={desk.name} className="w-full h-full object-cover" />
              {/* Favourite button overlay */}
              <button
                onClick={() => toggleFavorite(desk.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-all ${isFav ? "bg-primary border-primary" : "bg-white/90 border-white/20 hover:bg-white"}`}
                title={isFav ? "Remove from favourites" : "Save as favourite"}
              >
                <Heart className={`w-5 h-5 transition-colors ${isFav ? "fill-white text-white" : "text-muted-foreground"}`} />
              </button>
              {isFav && (
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  ★ Favourite
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge className={desk.zone === "Deep Work" ? "bg-secondary text-white hover:bg-secondary" : "bg-primary text-white hover:bg-primary"}>
                  {desk.zone === "Deep Work" ? "Deep Work Zone — No Talking" : "Calls Allowed Zone"}
                </Badge>
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border">{desk.type}</Badge>
                <Badge variant="outline" className={`font-semibold bg-white ${desk.status === "Available" ? "text-success border-success" : desk.status === "Reserved" ? "text-destructive border-destructive" : "text-warning border-warning"}`}>
                  {desk.status}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-secondary mb-2">{desk.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Multaqa — {desk.location}
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {desk.amenities.map(am => (
                  <div key={am} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-secondary font-medium">{am}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-success" />
                  <span className="text-secondary font-medium">{desk.wifi} Speed WiFi</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">Reviews</h2>
              <div className="space-y-6">
                <div className="bg-muted p-5 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-warning">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-sm text-muted-foreground">Oct 2025</span>
                  </div>
                  <p className="text-secondary italic mb-3">"Great WiFi here, stayed all day and got so much done. Very quiet zone."</p>
                  <p className="text-sm font-medium text-muted-foreground">— Khalid M.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-lg p-6">
              <h3 className="text-2xl font-bold text-secondary mb-6">Book {desk.name}</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Per Hour</span>
                  <span className="font-bold text-secondary">{desk.priceHour} ILS</span>
                </div>
                {desk.priceHalfDay && (
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Half Day <span className="text-xs">(4 hrs)</span></span>
                    <span className="font-bold text-secondary">{desk.priceHalfDay} ILS</span>
                  </div>
                )}
                {desk.priceFullDay && (
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Full Day <span className="text-xs">(8 hrs)</span></span>
                    <span className="font-bold text-secondary">{desk.priceFullDay} ILS</span>
                  </div>
                )}
              </div>

              {desk.status === "Available" ? (
                <div className="space-y-3">
                  <Link href={`/book/step1?item=${desk.id}&type=desk`}>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white text-base h-12">
                      Select Date & Time
                    </Button>
                  </Link>
                  <button
                    onClick={() => toggleFavorite(desk.id)}
                    className={`w-full h-10 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${isFav ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"}`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-primary" : ""}`} />
                    {isFav ? "Saved as Favourite" : "Save as Favourite"}
                  </button>
                </div>
              ) : desk.status === "Reserved" ? (
                <div className="space-y-3">
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center font-medium border border-destructive/20">
                    Currently Reserved
                  </div>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-12 border-primary text-primary hover:bg-primary/5 flex items-center gap-2"
                    onClick={() => setShowWaitlist(true)}
                  >
                    <BellRing className="w-4 h-4" /> Join Waitlist
                  </Button>
                  <button
                    onClick={() => toggleFavorite(desk.id)}
                    className={`w-full h-10 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${isFav ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-primary" : ""}`} />
                    {isFav ? "Saved as Favourite" : "Save as Favourite"}
                  </button>
                </div>
              ) : (
                <div className="bg-warning/10 text-warning p-4 rounded-lg text-center font-medium border border-warning/20">
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
