import { useState } from "react";
import { Link, useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext, Booking } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ArrowLeft, Info, CheckCircle2 } from "lucide-react";

export default function BookingStep2() {
  const [, setLocation] = useLocation();
  const { desks, rooms, bookingDraft, setBookingDraft, currentUser, setBookings } = useAppContext();
  const [guestEmail, setGuestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  if (!bookingDraft || !bookingDraft.itemId) {
    setLocation("/");
    return null;
  }

  const item = bookingDraft.itemType === "desk" 
    ? desks.find(d => d.id === bookingDraft.itemId) 
    : rooms.find(r => r.id === bookingDraft.itemId);
    
  if (!item) return null;

  const handleConfirm = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newBooking: Booking = {
        id: `MQR-${Math.floor(10000 + Math.random() * 90000)}`,
        itemId: item.id,
        itemType: bookingDraft.itemType as "desk" | "room",
        location: bookingDraft.location!,
        userId: currentUser?.id,
        guestEmail: currentUser ? currentUser.email : guestEmail,
        date: bookingDraft.date!,
        time: bookingDraft.time!,
        duration: bookingDraft.duration!,
        totalPrice: bookingDraft.totalPrice!,
        paymentMethod: "Cash",
        paymentStatus: "Unpaid",
        bookingStatus: "Upcoming",
        paymentDeadline: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
      };
      
      setBookings(prev => [newBooking, ...prev]);
      setBookingDraft(newBooking); // temporarily hold complete booking to show on confirmation
      setLocation("/book/confirmation");
    }, 1000);
  };

  const isEmailValid = currentUser || (guestEmail && guestEmail.includes("@"));

  return (
    <UserLayout>
      <div className="bg-muted border-b border-border py-4">
        <div className="container mx-auto px-6">
          <Link href={`/book/step1?item=${item.id}&type=${bookingDraft.itemType}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-secondary mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Date & Time
          </Link>
          
          <div className="flex items-center justify-center max-w-xl mx-auto">
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
              <span className="font-bold text-secondary text-sm">Date & Time</span>
            </div>
            <div className="h-px bg-border flex-1 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary border-none text-white flex items-center justify-center font-bold text-sm">2</div>
              <span className="font-bold text-secondary text-sm">Review</span>
            </div>
            <div className="h-px bg-border flex-1 mx-4"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-muted border border-muted-foreground text-muted-foreground flex items-center justify-center font-bold text-sm">3</div>
              <span className="font-bold text-muted-foreground text-sm">Done</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl flex flex-col md:flex-row gap-10">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6">Review your booking</h2>
            
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-secondary">{item.name}</h3>
                  <p className="text-muted-foreground">{bookingDraft.itemType === "desk" ? "Coworking Desk" : "Meeting Room"} • {item.location}</p>
                </div>
              </div>
              
              <div className="p-6 bg-muted/20">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block mb-1">Date</span>
                    <span className="font-medium text-secondary">{format(new Date(bookingDraft.date!), "EEEE, MMM d, yyyy")}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block mb-1">Time</span>
                    <span className="font-medium text-secondary">{bookingDraft.time}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block mb-1">Duration</span>
                    <span className="font-medium text-secondary">{bookingDraft.duration}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block mb-1">Total Price</span>
                    <span className="font-bold text-primary text-xl">{bookingDraft.totalPrice} ILS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-secondary mb-4">Guest Details</h2>
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              {currentUser ? (
                <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-secondary">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
                </div>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-secondary font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="We'll send your confirmation here" 
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="h-12 bg-muted/30"
                  />
                  <p className="text-xs text-muted-foreground mt-2">No account required. You can create one later to manage your bookings.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-secondary mb-4">Payment Method</h2>
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-start gap-4 p-4 rounded-lg border-2 border-primary bg-accent/20">
                <div className="w-5 h-5 rounded-full border-4 border-primary mt-0.5 shrink-0"></div>
                <div>
                  <h4 className="font-bold text-secondary text-lg">Pay with Cash</h4>
                  <p className="text-muted-foreground mt-1 mb-2">Pay on-site when you arrive.</p>
                  <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-3 py-1.5 rounded-md text-sm font-medium border border-warning/20">
                    <Info className="w-4 h-4" /> 
                    Payment due by {format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: CTA */}
        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-lg p-6 flex flex-col">
            <h3 className="font-bold text-xl text-secondary mb-6 pb-4 border-b border-border">Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium text-secondary">{bookingDraft.totalPrice} ILS</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Taxes</span>
                <span className="font-medium text-secondary">Included</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-secondary font-bold">Total Due</span>
                <span className="font-bold text-primary text-2xl">{bookingDraft.totalPrice} ILS</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-medium shadow-md shadow-primary/20 mb-4"
              disabled={!isEmailValid || isLoading}
              onClick={handleConfirm}
            >
              {isLoading ? "Confirming..." : "Confirm Booking"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground px-4">
              Free cancellation up to 2 hours before your booking starts.
            </p>
          </div>
        </div>
        
      </div>
    </UserLayout>
  );
}
