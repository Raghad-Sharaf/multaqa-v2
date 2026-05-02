import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, Booking } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isPast, parseISO } from "date-fns";
import { MapPin, Calendar, Clock, Download, AlertCircle } from "lucide-react";

export default function MyReservations() {
  const { currentUser, bookings, desks, rooms, setBookings } = useAppContext();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!currentUser) {
      setLocation("/login");
    }
  }, [currentUser, setLocation]);

  if (!currentUser) return null;

  const userBookings = bookings.filter(b => b.userId === currentUser.id);
  
  // Sort by date descending
  const sortedBookings = [...userBookings].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const upcomingBookings = sortedBookings.filter(b => b.bookingStatus === "Upcoming");
  const pastBookings = sortedBookings.filter(b => b.bookingStatus === "Completed" || b.bookingStatus === "Cancelled");

  const handleCancel = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, bookingStatus: "Cancelled" } : b)
      );
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const item = booking.itemType === "desk" 
      ? desks.find(d => d.id === booking.itemId) 
      : rooms.find(r => r.id === booking.itemId);
      
    if (!item) return null;

    const isUpcoming = booking.bookingStatus === "Upcoming";
    const isCancelled = booking.bookingStatus === "Cancelled";

    return (
      <div className={`bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6 ${isCancelled ? 'opacity-60 grayscale' : ''}`}>
        <div className="flex flex-col md:flex-row">
          
          {/* Status Bar (Mobile Top, Desktop Left) */}
          <div className={`h-2 md:h-auto md:w-2 ${
            isCancelled ? 'bg-muted-foreground' :
            isUpcoming ? 'bg-primary' : 'bg-success'
          }`} />
          
          <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-32 md:h-full bg-muted rounded-lg overflow-hidden shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <h3 className="font-bold text-xl text-secondary">{item.name}</h3>
                    <Badge variant="outline" className="text-xs bg-muted border-border font-medium text-muted-foreground">
                      {booking.id}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="w-4 h-4" /> Multaqa — {booking.location}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Badge className={`
                    ${booking.paymentStatus === 'Paid' ? 'bg-success hover:bg-success' : 'bg-warning hover:bg-warning'} 
                    text-white border-none
                  `}>
                    {booking.paymentStatus}
                  </Badge>
                  <Badge variant="outline" className={`
                    ${isUpcoming ? 'border-primary text-primary' : 
                      isCancelled ? 'border-destructive text-destructive' : 'border-success text-success'}
                  `}>
                    {booking.bookingStatus}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border mb-4">
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Date</span>
                  <span className="font-medium text-secondary flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    {format(parseISO(booking.date), "MMM d, yyyy")}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Time</span>
                  <span className="font-medium text-secondary flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    {booking.time}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Duration</span>
                  <span className="font-medium text-secondary">{booking.duration}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Total</span>
                  <span className="font-bold text-secondary">{booking.totalPrice} ILS</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {isUpcoming && booking.paymentStatus === "Unpaid" ? (
                  <div className="text-sm font-medium text-warning flex items-center gap-1.5 bg-warning/10 px-3 py-1.5 rounded-md border border-warning/20">
                    <AlertCircle className="w-4 h-4" /> Cash due on-site by {format(parseISO(booking.paymentDeadline!), "MMM d, yyyy")}
                  </div>
                ) : (
                  <div></div> // Spacer
                )}

                <div className="flex gap-3 w-full sm:w-auto">
                  {!isCancelled && (
                    <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-secondary flex-1 sm:flex-none">
                      <Download className="w-4 h-4 mr-2" /> Receipt
                    </Button>
                  )}
                  {isUpcoming && (
                    <>
                      <Link href={`/my-reservations/modify/${booking.id}`}>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-accent flex-1 sm:flex-none">
                          Modify
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleCancel(booking.id)} className="border-destructive text-destructive hover:bg-destructive/10 flex-1 sm:flex-none">
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="bg-secondary text-white py-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-3xl font-bold mb-2">My Reservations</h1>
          <p className="text-white/70">Manage your upcoming bookings and view past history.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl flex-1">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-8 w-full max-w-md h-12 bg-muted/50 p-1 border border-border">
            <TabsTrigger value="upcoming" className="flex-1 h-full text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1 h-full text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Past & Cancelled ({pastBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-border shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground mb-6">Find your perfect desk or meeting room.</p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90 text-white">Browse Spaces</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-border shadow-sm">
                <p className="text-muted-foreground">No past bookings found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}
