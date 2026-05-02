import { AdminLayout } from "@/components/AdminLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO, differenceInDays } from "date-fns";
import { DollarSign, CheckCircle2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUnpaidCash() {
  const { bookings, setBookings, desks, rooms } = useAppContext();
  const { toast } = useToast();
  
  // Get unpaid cash bookings and sort by urgency (deadline proximity)
  const unpaidBookings = bookings
    .filter(b => b.paymentStatus === "Unpaid" && b.paymentMethod === "Cash" && b.bookingStatus !== "Cancelled")
    .sort((a, b) => {
      if (!a.paymentDeadline) return 1;
      if (!b.paymentDeadline) return -1;
      return new Date(a.paymentDeadline).getTime() - new Date(b.paymentDeadline).getTime();
    });

  const handleMarkPaid = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus: "Paid" } : b));
    toast({
      title: "Payment Recorded",
      description: `Booking ${id} has been marked as paid.`,
      className: "bg-success text-white border-none",
    });
  };

  const handleSendReminder = (id: string) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to guest for booking ${id}.`,
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-destructive" />
          Unpaid Cash Bookings
        </h1>
        <p className="text-muted-foreground">Track and collect pending cash payments from users on-site.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-destructive/5">
          <h2 className="text-xl font-bold text-destructive">Pending Collection: {unpaidBookings.length}</h2>
          <div className="text-lg font-bold text-secondary">
            Total: {unpaidBookings.reduce((sum, b) => sum + b.totalPrice, 0)} ILS
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Space</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpaidBookings.length > 0 ? (
                unpaidBookings.map(booking => {
                  const item = booking.itemType === "desk" 
                    ? desks.find(d => d.id === booking.itemId) 
                    : rooms.find(r => r.id === booking.itemId);
                    
                  // Calculate days remaining
                  const today = new Date();
                  const deadlineDate = booking.paymentDeadline ? parseISO(booking.paymentDeadline) : null;
                  const daysRemaining = deadlineDate ? differenceInDays(deadlineDate, today) : 99;
                  
                  const isOverdue = daysRemaining < 0;
                  const isUrgent = daysRemaining >= 0 && daysRemaining <= 1;
                    
                  return (
                    <TableRow key={booking.id} className={isOverdue ? "bg-destructive/5" : isUrgent ? "bg-warning/5" : ""}>
                      <TableCell className="font-medium text-xs">{booking.id}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{booking.userName || "Guest"}</div>
                        <div className="text-xs text-muted-foreground">{booking.guestEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{item?.name || booking.itemId}</div>
                        <div className="text-xs text-muted-foreground">{booking.location}</div>
                      </TableCell>
                      <TableCell>
                        {format(parseISO(booking.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-bold">
                        {booking.totalPrice} ILS
                      </TableCell>
                      <TableCell>
                        {booking.paymentDeadline ? (
                          <div className="flex flex-col">
                            <span className="text-sm">{format(parseISO(booking.paymentDeadline), "MMM d, yyyy")}</span>
                            <Badge variant="outline" className={`w-fit mt-1 text-[10px] ${
                              isOverdue ? "border-destructive text-destructive" : 
                              isUrgent ? "border-warning text-warning" : "border-success text-success"
                            }`}>
                              {isOverdue ? "Overdue" : isUrgent ? "Due Soon" : `${daysRemaining} days left`}
                            </Badge>
                          </div>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-xs"
                            onClick={() => handleSendReminder(booking.id)}
                          >
                            <Bell className="w-3 h-3 mr-1.5" /> Remind
                          </Button>
                          <Button 
                            size="sm" 
                            className="h-8 text-xs bg-success hover:bg-success/90 text-white"
                            onClick={() => handleMarkPaid(booking.id)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Mark Paid
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      </div>
                      <p className="text-secondary font-medium">All cash bookings are paid!</p>
                      <p className="text-muted-foreground text-sm">No pending collections at this time.</p>
                    </div>
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
