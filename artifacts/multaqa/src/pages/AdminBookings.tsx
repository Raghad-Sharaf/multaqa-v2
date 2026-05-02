import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Search, Filter, Eye, XCircle, CheckCircle } from "lucide-react";

export default function AdminBookings() {
  const { bookings, setBookings, desks, rooms } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState<string>("All");
  const [filterPayment, setFilterPayment] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  
  const filteredBookings = bookings.filter(b => {
    const matchSearch = (b.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
                        (b.userName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (b.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase()));
                        
    const matchLocation = filterLocation === "All" || b.location === filterLocation;
    const matchPayment = filterPayment === "All" || b.paymentStatus === filterPayment;
    const matchStatus = filterStatus === "All" || b.bookingStatus === filterStatus;
    
    return matchSearch && matchLocation && matchPayment && matchStatus;
  });

  const handleCancel = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, bookingStatus: "Cancelled" } : b));
  };

  const handleMarkPaid = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus: "Paid" } : b));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2">All Bookings</h1>
        <p className="text-muted-foreground">Manage and view all reservations across locations.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Locations</SelectItem>
                <SelectItem value="Nablus">Nablus</SelectItem>
                <SelectItem value="Ramallah">Ramallah</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="px-3" onClick={() => {
              setSearchTerm(""); setFilterLocation("All"); setFilterPayment("All"); setFilterStatus("All");
            }}>
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Space</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => {
                  const item = booking.itemType === "desk" 
                    ? desks.find(d => d.id === booking.itemId) 
                    : rooms.find(r => r.id === booking.itemId);
                    
                  return (
                    <TableRow key={booking.id} className={booking.bookingStatus === "Cancelled" ? "opacity-50" : ""}>
                      <TableCell className="font-medium text-xs">{booking.id}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{booking.userName || "Guest"}</div>
                        <div className="text-xs text-muted-foreground">{booking.guestEmail}</div>
                      </TableCell>
                      <TableCell>{item?.name || booking.itemId}</TableCell>
                      <TableCell>{booking.location}</TableCell>
                      <TableCell>
                        <div className="text-sm">{format(parseISO(booking.date), "MMM d, yyyy")}</div>
                        <div className="text-xs text-muted-foreground">{booking.time}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          ${booking.paymentStatus === "Paid" ? "bg-success hover:bg-success" : "bg-warning hover:bg-warning text-white"} 
                          border-none text-xs
                        `}>
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`
                          text-xs
                          ${booking.bookingStatus === "Upcoming" ? "border-primary text-primary" : 
                            booking.bookingStatus === "Completed" ? "border-success text-success" : 
                            "border-muted-foreground text-muted-foreground"}
                        `}>
                          {booking.bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {booking.paymentStatus === "Unpaid" && booking.bookingStatus !== "Cancelled" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 px-2 border-success text-success hover:bg-success hover:text-white"
                              onClick={() => handleMarkPaid(booking.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {booking.bookingStatus === "Upcoming" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 px-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
                              onClick={() => handleCancel(booking.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No bookings found matching your filters.
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
