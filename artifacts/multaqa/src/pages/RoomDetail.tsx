import { Link, useRoute } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, CheckCircle2, MapPin } from "lucide-react";
import { NotFound } from "@/pages/not-found";

export default function RoomDetail() {
  const [match, params] = useRoute("/rooms/:id");
  const { rooms } = useAppContext();
  
  if (!match || !params.id) return <NotFound />;
  
  const room = rooms.find(r => r.id === params.id);
  if (!room) return <NotFound />;

  return (
    <UserLayout>
      <div className="bg-secondary text-white border-b border-border py-6">
        <div className="container mx-auto px-6">
          <Link href="/rooms" className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all rooms
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-[450px]">
              <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge className="bg-primary text-white hover:bg-primary px-3 py-1 text-sm">
                  {room.type}
                </Badge>
                <Badge variant="outline" className={`font-semibold px-3 py-1 text-sm bg-white ${
                  room.status === "Available" ? "text-success border-success" : 
                  room.status === "Reserved" ? "text-destructive border-destructive" :
                  "text-warning border-warning"
                }`}>
                  {room.status}
                </Badge>
                <div className="flex items-center gap-2 bg-[#E8EBFF] text-secondary px-3 py-1 rounded-full text-sm font-semibold border border-[#001279]/10">
                  <Users className="w-4 h-4" /> Fits up to {room.capacity} people
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3 tracking-tight">{room.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" /> Multaqa — {room.location}
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">Included Equipment</h2>
              {room.equipment.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/50 p-6 rounded-xl border border-border">
                  {room.equipment.map(eq => (
                    <div key={eq} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-secondary font-medium">{eq}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Standard room setup.</p>
              )}
            </div>
            
            <div className="border-t border-border pt-8 pb-8">
              <h2 className="text-2xl font-bold text-secondary mb-4">About this space</h2>
              <p className="text-muted-foreground leading-relaxed">
                The {room.name} is a premium {room.type.toLowerCase()} designed for privacy and productivity. 
                Whether you're hosting an important client meeting, running a team workshop, or need a quiet 
                space for deep work, this room provides the professional environment you need in the heart of {room.location}.
              </p>
            </div>
          </div>

          {/* Sidebar / Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-xl p-8">
              <h3 className="text-2xl font-bold text-secondary mb-2">Book {room.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">Choose your duration to see available times.</p>
              
              <div className="bg-muted rounded-xl p-4 space-y-4 mb-8 border border-border">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Per Hour</span>
                  <span className="font-bold text-secondary text-lg">{room.priceHour} ILS</span>
                </div>
                {room.priceHalfDay && (
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Half Day <span className="text-xs opacity-70">(4 hrs)</span></span>
                    <span className="font-bold text-secondary text-lg">{room.priceHalfDay} ILS</span>
                  </div>
                )}
              </div>

              {room.status === "Available" ? (
                <div className="space-y-3">
                  <Link href={`/book/step1?item=${room.id}&type=room`}>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white text-lg h-14 shadow-md shadow-primary/20">
                      Select Date & Time
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full h-12 border-secondary/20 text-secondary hover:bg-[#E8EBFF] hover:border-secondary/40 font-medium">
                    Contact via WhatsApp
                  </Button>
                </div>
              ) : (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center font-bold border border-destructive/20 mb-4">
                  Currently {room.status}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}
