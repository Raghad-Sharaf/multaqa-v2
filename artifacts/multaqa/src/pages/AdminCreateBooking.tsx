import { useState } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLayout } from "@/components/AdminLayout";
import { useAppContext, Booking } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus } from "lucide-react";
import { format, parseISO } from "date-fns";

const createBookingSchema = z.object({
  userName: z.string().min(2, "Name required"),
  guestEmail: z.string().email("Valid email required"),
  itemId: z.string().min(1, "Please select a space"),
  date: z.string().min(1, "Date required"),
  time: z.string().min(1, "Time required"),
  duration: z.enum(["1 Hour", "Half Day", "Full Day"]),
  paymentMethod: z.enum(["Cash"]),
  paymentStatus: z.enum(["Paid", "Unpaid"]),
});

export default function AdminCreateBooking() {
  const [, setLocation] = useLocation();
  const { desks, rooms, setBookings, currentLocation } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const availableItems = [
    ...desks.filter(d => d.location === currentLocation && d.status === "Available").map(d => ({ ...d, itemType: "desk" })),
    ...rooms.filter(r => r.location === currentLocation && r.status === "Available").map(r => ({ ...r, itemType: "room" }))
  ];

  const form = useForm<z.infer<typeof createBookingSchema>>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      userName: "",
      guestEmail: "",
      itemId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "9:00–10:00",
      duration: "1 Hour",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
    },
  });

  const selectedItemId = form.watch("itemId");
  const selectedDuration = form.watch("duration");
  
  const selectedItem = availableItems.find(i => i.id === selectedItemId);

  // Calculate price dynamically
  let calculatedPrice = 0;
  if (selectedItem) {
    if (selectedDuration === "1 Hour") calculatedPrice = selectedItem.priceHour;
    else if (selectedDuration === "Half Day") calculatedPrice = selectedItem.priceHalfDay || (selectedItem.priceHour * 4);
    // @ts-ignore
    else if (selectedDuration === "Full Day") calculatedPrice = selectedItem.priceFullDay || (selectedItem.priceHour * 8);
  }

  function onSubmit(values: z.infer<typeof createBookingSchema>) {
    setIsLoading(true);
    
    if (!selectedItem) return;

    setTimeout(() => {
      const newBooking: Booking = {
        id: `MQR-${Math.floor(10000 + Math.random() * 90000)}`,
        itemId: values.itemId,
        itemType: selectedItem.itemType as "desk" | "room",
        location: currentLocation,
        userName: values.userName,
        guestEmail: values.guestEmail,
        date: values.date,
        time: values.time,
        duration: values.duration,
        totalPrice: calculatedPrice,
        paymentMethod: values.paymentMethod,
        paymentStatus: values.paymentStatus,
        bookingStatus: "Upcoming",
        paymentDeadline: values.paymentStatus === "Unpaid" ? format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd") : undefined
      };
      
      setBookings(prev => [newBooking, ...prev]);
      
      toast({
        title: "Booking Created",
        description: `Booking ${newBooking.id} created for ${values.userName}.`,
        className: "bg-success text-white border-none",
      });
      
      setLocation("/admin/bookings");
    }, 800);
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link href="/admin/bookings" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-secondary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to bookings
        </Link>
        <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-primary" />
          Create Booking
        </h1>
        <p className="text-muted-foreground">Manually create a reservation for a walk-in or phone customer in {currentLocation}.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-border shadow-sm max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="font-bold text-lg border-b pb-2">Customer Details</h3>
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guestEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-lg border-b pb-2">Booking Details</h3>
                
                <FormField
                  control={form.control}
                  name="itemId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Space</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select available space" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableItems.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} ({item.itemType})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1 Hour">1 Hour</SelectItem>
                            <SelectItem value="Half Day">Half Day</SelectItem>
                            <SelectItem value="Full Day">Full Day</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="9:00–10:00">9:00–10:00</SelectItem>
                          <SelectItem value="10:00–11:00">10:00–11:00</SelectItem>
                          <SelectItem value="9:00–13:00">9:00–13:00 (Half)</SelectItem>
                          <SelectItem value="13:00–17:00">13:00–17:00 (Half)</SelectItem>
                          <SelectItem value="9:00–17:00">9:00–17:00 (Full)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-bold text-lg mb-4">Payment</h3>
              
              <div className="flex flex-col sm:flex-row gap-6 items-end">
                <div className="flex-1 space-y-4 w-full">
                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Paid">Paid (Cash Received)</SelectItem>
                            <SelectItem value="Unpaid">Unpaid (Pay Later)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-muted p-4 rounded-lg min-w-[200px] text-center border border-border">
                  <span className="text-sm text-muted-foreground block mb-1">Calculated Total</span>
                  <span className="text-3xl font-bold text-secondary">{calculatedPrice} ILS</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 mt-6 border-t border-border">
              <Link href="/admin/bookings">
                <Button type="button" variant="outline" className="w-32">Cancel</Button>
              </Link>
              <Button type="submit" className="w-40 bg-primary hover:bg-primary/90 text-white" disabled={isLoading || !selectedItem}>
                {isLoading ? "Creating..." : "Create Booking"}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
