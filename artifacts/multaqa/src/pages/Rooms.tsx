import { useState } from "react";
import { Link, useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, RoomType } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Rooms() {
  const { rooms, currentLocation, setCurrentLocation } = useAppContext();
  
  const [filterType, setFilterType] = useState<RoomType | "All">("All");
  
  const filteredRooms = rooms.filter(r => 
    r.location === currentLocation &&
    (filterType === "All" || r.type === filterType)
  );

  return (
    <UserLayout>
      <div className="bg-secondary text-white border-b border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-3">Browse Rooms</h1>
              <p className="text-white/80 max-w-lg">Professional spaces for meetings, calls, and focused team work in {currentLocation}.</p>
            </div>
            
            <div className="bg-white/10 p-1 rounded-lg border border-white/20 inline-flex">
              <button 
                onClick={() => setCurrentLocation("Nablus")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentLocation === "Nablus" ? "bg-white text-secondary shadow-sm" : "text-white/70 hover:text-white"}`}
              >
                Nablus
              </button>
              <button 
                onClick={() => setCurrentLocation("Ramallah")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentLocation === "Ramallah" ? "bg-white text-secondary shadow-sm" : "text-white/70 hover:text-white"}`}
              >
                Ramallah
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-white/80 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Filters:
            </span>
            
            <Select value={filterType} onValueChange={(val) => setFilterType(val as RoomType | "All")}>
              <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Room Types</SelectItem>
                <SelectItem value="Private Office">Private Office</SelectItem>
                <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                <SelectItem value="Phone Booth">Phone Booth</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 bg-background flex-1">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-24 bg-muted rounded-xl border border-border">
            <h3 className="text-xl font-bold text-secondary mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to see more options.</p>
            <Button variant="outline" onClick={() => setFilterType("All")}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, idx) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all hover:border-primary/30 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-muted">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-white hover:bg-primary border-none">
                      {room.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className={`font-semibold ${
                      room.status === "Available" ? "bg-success text-white hover:bg-success" : 
                      room.status === "Reserved" ? "bg-destructive text-white hover:bg-destructive" :
                      "bg-warning text-white hover:bg-warning"
                    }`}>
                      {room.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <h3 className="font-bold text-2xl text-white drop-shadow-md">{room.name}</h3>
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium border border-white/20">
                      <Users className="w-4 h-4" /> Up to {room.capacity}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.equipment.slice(0, 3).map(eq => (
                      <span key={eq} className="text-xs font-medium text-secondary bg-[#E8EBFF] px-2.5 py-1 rounded-md border border-[#001279]/10">
                        {eq}
                      </span>
                    ))}
                    {room.equipment.length > 3 && (
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                        +{room.equipment.length - 3} more
                      </span>
                    )}
                    {room.equipment.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">Standard equipment</span>
                    )}
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-medium tracking-wide">Rate</span>
                      <span className="font-bold text-secondary text-xl">{room.priceHour} ILS <span className="text-sm font-normal text-muted-foreground">/hr</span></span>
                    </div>
                    
                    <Link href={`/rooms/${room.id}`}>
                      <Button 
                        variant={room.status === "Available" ? "default" : "outline"} 
                        className={room.status === "Available" ? "bg-primary hover:bg-primary/90 text-white" : "border-border text-muted-foreground hover:bg-muted"}
                      >
                        {room.status === "Available" ? "View Details" : "View"}
                      </Button>
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
