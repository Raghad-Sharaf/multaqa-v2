import { AdminLayout } from "@/components/AdminLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, PowerOff, CheckCircle2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSeats() {
  const { desks, setDesks, currentLocation, setCurrentLocation } = useAppContext();
  const { toast } = useToast();
  
  const locationDesks = desks.filter(d => d.location === currentLocation);

  const toggleMaintenance = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Maintenance" ? "Available" : "Maintenance";
    
    setDesks(prev => prev.map(d => d.id === id ? { ...d, status: newStatus as any } : d));
    
    toast({
      title: newStatus === "Maintenance" ? "Desk Blocked" : "Desk Restored",
      description: `Desk has been marked as ${newStatus.toLowerCase()}.`,
      variant: newStatus === "Maintenance" ? "destructive" : "default",
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Seat Management</h1>
          <p className="text-muted-foreground">Manage physical desks, availability, and maintenance.</p>
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

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary">Desks in {currentLocation} ({locationDesks.length})</h2>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add New Desk
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Desk Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationDesks.length > 0 ? (
                locationDesks.map(desk => (
                  <TableRow key={desk.id}>
                    <TableCell className="font-bold text-secondary">{desk.name}</TableCell>
                    <TableCell>{desk.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${desk.zone === "Deep Work" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-primary/10 text-primary border-primary/20"}
                      `}>
                        {desk.zone}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`
                        ${desk.status === "Available" ? "bg-success hover:bg-success text-white border-none" : 
                          desk.status === "Reserved" ? "bg-warning hover:bg-warning text-white border-none" :
                          "bg-destructive hover:bg-destructive text-white border-none"} 
                      `}>
                        {desk.status === "Maintenance" ? (
                          <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> Maintenance</span>
                        ) : desk.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {desk.status === "Maintenance" ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-xs border-success text-success hover:bg-success hover:text-white"
                            onClick={() => toggleMaintenance(desk.id, desk.status)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Restore
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-xs border-destructive text-destructive hover:bg-destructive hover:text-white"
                            onClick={() => toggleMaintenance(desk.id, desk.status)}
                            disabled={desk.status === "Reserved"}
                          >
                            <PowerOff className="w-3 h-3 mr-1.5" /> Block
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="h-8 text-xs">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No desks found in this location.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
