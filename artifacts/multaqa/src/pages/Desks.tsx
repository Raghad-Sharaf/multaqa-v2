import { useState } from "react";
import { Link } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, Zone, DeskType } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Wifi, Monitor, BatteryCharging } from "lucide-react";
import { motion } from "framer-motion";

export default function Desks() {
  const { desks, currentLocation, setCurrentLocation } = useAppContext();
  
  const [filterZone, setFilterZone] = useState<Zone | "All">("All");
  const [filterType, setFilterType] = useState<DeskType | "All">("All");
  
  const filteredDesks = desks.filter(d => 
    d.location === currentLocation &&
    (filterZone === "All" || d.zone === filterZone) &&
    (filterType === "All" || d.type === filterType)
  );

  return (
    <UserLayout>
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">Browse Desks</h1>
              <p className="text-muted-foreground">Find a spot to focus or collaborate in {currentLocation}.</p>
            </div>
            
            <div className="bg-white p-1 rounded-lg border border-border inline-flex">
              <button 
                onClick={() => setCurrentLocation("Nablus")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentLocation === "Nablus" ? "bg-secondary text-white shadow-sm" : "text-muted-foreground hover:text-secondary"}`}
              >
                Nablus
              </button>
              <button 
                onClick={() => setCurrentLocation("Ramallah")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentLocation === "Ramallah" ? "bg-secondary text-white shadow-sm" : "text-muted-foreground hover:text-secondary"}`}
              >
                Ramallah
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-border shadow-sm">
            <span className="text-sm font-medium text-secondary flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Filters:
            </span>
            
            <Select value={filterZone} onValueChange={(val) => setFilterZone(val as Zone | "All")}>
              <SelectTrigger className="w-[180px] bg-muted/50">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Zones</SelectItem>
                <SelectItem value="Deep Work">Deep Work</SelectItem>
                <SelectItem value="Calls Allowed">Calls Allowed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={(val) => setFilterType(val as DeskType | "All")}>
              <SelectTrigger className="w-[180px] bg-muted/50">
                <SelectValue placeholder="Desk Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Flex Desk">Flex Desk</SelectItem>
                <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                <SelectItem value="Dedicated Desk">Dedicated Desk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {filteredDesks.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-border">
            <h3 className="text-xl font-bold text-secondary mb-2">No desks found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to see more options.</p>
            <Button variant="outline" onClick={() => { setFilterZone("All"); setFilterType("All"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesks.map((desk, idx) => (
              <motion.div 
                key={desk.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-primary/30 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img 
                    src={desk.image} 
                    alt={desk.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${desk.status === "Maintenance" ? "grayscale opacity-80" : ""}`}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={
                      desk.zone === "Deep Work" 
                        ? "bg-secondary text-white hover:bg-secondary" 
                        : "bg-primary text-white hover:bg-primary"
                    }>
                      {desk.zone}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className={`bg-white font-semibold ${
                      desk.status === "Available" ? "text-success border-success" : 
                      desk.status === "Reserved" ? "text-destructive border-destructive" :
                      "text-warning border-warning"
                    }`}>
                      {desk.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-secondary">{desk.name}</h3>
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{desk.type}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2 mb-6">
                    {desk.amenities.slice(0, 2).map(am => (
                      <span key={am} className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                        {am === "Power outlets" && <BatteryCharging className="w-3 h-3" />}
                        {am === "External monitor" && <Monitor className="w-3 h-3" />}
                        {am}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                      <Wifi className="w-3 h-3" /> {desk.wifi} WiFi
                    </span>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-medium">Starting from</span>
                      <span className="font-bold text-secondary text-lg">{desk.priceHour} ILS <span className="text-sm font-normal text-muted-foreground">/hr</span></span>
                    </div>
                    
                    <Link href={`/desks/${desk.id}`}>
                      <Button 
                        variant={desk.status === "Available" ? "default" : "outline"} 
                        className={desk.status === "Available" ? "bg-primary hover:bg-primary/90 text-white" : "border-border text-muted-foreground hover:bg-muted"}
                      >
                        {desk.status === "Available" ? "View Details" : "View"}
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
