import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CalendarDays, DollarSign, Armchair } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function AdminOverview() {
  const { bookings, desks, rooms, currentLocation, setCurrentLocation } = useAppContext();
  
  // Calculate stats based on current location
  const locationBookings = bookings.filter(b => b.location === currentLocation);
  
  const today = format(new Date(), "yyyy-MM-dd");
  const bookingsToday = locationBookings.filter(b => b.date === today).length;
  
  const locationDesks = desks.filter(d => d.location === currentLocation);
  const locationRooms = rooms.filter(r => r.location === currentLocation);
  const totalSeats = locationDesks.length + locationRooms.length; // Simplified for prototype
  const occupiedSeats = locationDesks.filter(d => d.status === "Reserved").length + 
                        locationRooms.filter(r => r.status === "Reserved").length;
                        
  const unpaidBookings = locationBookings.filter(b => b.paymentStatus === "Unpaid");
  
  // Mock revenue
  const weeklyRevenue = locationBookings
    .filter(b => b.paymentStatus === "Paid")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Recent bookings (last 5)
  const recentBookings = [...locationBookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Admin.</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookings Today</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{bookingsToday}</div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Seats Occupied</CardTitle>
            <Armchair className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{occupiedSeats}<span className="text-lg text-muted-foreground font-normal">/{totalSeats}</span></div>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/20 shadow-sm bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Unpaid Cash</CardTitle>
            <Users className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{unpaidBookings.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{weeklyRevenue} <span className="text-lg text-muted-foreground font-normal">ILS</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary">Recent Bookings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User / Guest</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.length > 0 ? (
                recentBookings.map(booking => {
                  const item = booking.itemType === "desk" 
                    ? desks.find(d => d.id === booking.itemId) 
                    : rooms.find(r => r.id === booking.itemId);
                    
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.userName || booking.guestEmail}</TableCell>
                      <TableCell>{item?.name || booking.itemId}</TableCell>
                      <TableCell>{format(parseISO(booking.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`
                          ${booking.bookingStatus === "Upcoming" ? "border-primary text-primary" : 
                            booking.bookingStatus === "Completed" ? "border-success text-success" : 
                            "border-muted-foreground text-muted-foreground"}
                        `}>
                          {booking.bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          ${booking.paymentStatus === "Paid" ? "bg-success hover:bg-success" : "bg-warning hover:bg-warning text-white"} 
                          border-none
                        `}>
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No recent bookings found.
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
