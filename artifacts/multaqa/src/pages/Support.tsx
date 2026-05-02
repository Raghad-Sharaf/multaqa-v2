import { useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MessageSquare, Clock, HelpCircle, AlertCircle, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = "booking" | "technical" | "complaint" | "general";

export default function Support() {
  const { currentUser, addSupportTicket, supportTickets } = useAppContext();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    const id = `TKT-${String(supportTickets.length + 3).padStart(3, "0")}`;
    addSupportTicket({ name, email, subject, message, category });
    setTicketId(id);
    setSubmitted(true);
  };

  const categoryLabels: Record<Category, string> = {
    booking: "Booking Issue",
    technical: "Technical Problem",
    complaint: "Complaint",
    general: "General Question",
  };

  const categoryColors: Record<Category, string> = {
    booking: "bg-primary/10 text-primary border-primary/20",
    technical: "bg-secondary/10 text-secondary border-secondary/20",
    complaint: "bg-destructive/10 text-destructive border-destructive/20",
    general: "bg-success/10 text-success border-success/20",
  };

  const statusColors: Record<string, string> = {
    open: "bg-warning/10 text-warning border-warning/30",
    "in-progress": "bg-primary/10 text-primary border-primary/30",
    resolved: "bg-success/10 text-success border-success/30",
  };

  return (
    <UserLayout>
      <div className="bg-secondary text-white py-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold">Customer Support</h1>
          </div>
          <p className="text-white/70">We're here to help. Submit a ticket and we'll respond within 24 hours.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
                    <h2 className="text-xl font-bold text-secondary mb-6">Submit a Ticket</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className="text-secondary font-medium">Full Name</Label>
                          <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Khalid Mansour" required className="h-11" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-secondary font-medium">Email Address</Label>
                          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="khalid@example.com" required className="h-11" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-secondary font-medium">Category</Label>
                        <Select value={category} onValueChange={v => setCategory(v as Category)}>
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="booking">Booking Issue</SelectItem>
                            <SelectItem value="technical">Technical Problem</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                            <SelectItem value="general">General Question</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="subject" className="text-secondary font-medium">Subject</Label>
                        <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of your issue" required className="h-11" />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="message" className="text-secondary font-medium">Message</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          placeholder="Please describe your issue in detail. Include your booking reference if applicable (e.g. MQR-12345)."
                          required
                          rows={6}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">{message.length}/1000 characters</p>
                      </div>

                      <Button type="submit" size="lg" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold">
                        Submit Ticket
                      </Button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center">
                    <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/20">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary mb-2">Ticket Submitted!</h2>
                    <p className="text-muted-foreground mb-4">
                      Your ticket <strong className="text-secondary">{ticketId}</strong> has been received.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg border border-success/20 text-sm font-medium mb-8">
                      <Clock className="w-4 h-4" /> We'll respond to <strong>{email}</strong> within 24 hours
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        onClick={() => { setSubmitted(false); setSubject(""); setMessage(""); }}
                        className="border-secondary text-secondary hover:bg-muted"
                      >
                        Submit Another Ticket
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Past tickets (if logged in) */}
            {currentUser && supportTickets.filter(t => t.email === currentUser.email).length > 0 && (
              <div className="mt-8 bg-white rounded-2xl border border-border shadow-sm p-8">
                <h3 className="text-lg font-bold text-secondary mb-6">Your Previous Tickets</h3>
                <div className="space-y-4">
                  {supportTickets.filter(t => t.email === currentUser.email).map(ticket => (
                    <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-secondary text-sm truncate">{ticket.subject}</span>
                          <Badge variant="outline" className={`text-xs ${categoryColors[ticket.category]} shrink-0`}>
                            {categoryLabels[ticket.category]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{ticket.id} · {new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs capitalize ${statusColors[ticket.status]} shrink-0`}>
                        {ticket.status.replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact info + FAQ */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <h3 className="font-bold text-secondary text-lg mb-5">Contact Us</h3>
              <div className="space-y-4">
                <a href="mailto:support@multaqa.ps" className="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  support@multaqa.ps
                </a>
                <a href="tel:+970599000000" className="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  +970 599 000 000
                </a>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  Sun–Thu, 9:00 AM – 6:00 PM
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <h3 className="font-bold text-secondary text-lg mb-5 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> FAQs
              </h3>
              <div className="space-y-4">
                {[
                  { q: "How do I cancel a booking?", a: "Go to My Reservations → find your booking → tap Cancel. Cancellations are free up to 2 hours before start." },
                  { q: "Can I book without an account?", a: "Yes! Just enter your email at checkout. Create an account later to manage your bookings." },
                  { q: "What if my slot is fully booked?", a: "Join the Waitlist from the desk or room page. We'll send you a booking link if a spot opens." },
                ].map(faq => (
                  <div key={faq.q} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-secondary text-sm mb-1.5">{faq.q}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg,#001279,#001D99)" }}>
              <AlertCircle className="w-6 h-6 text-primary mb-3" />
              <p className="font-bold text-sm mb-1">Response Time</p>
              <p className="text-white/70 text-sm">We aim to respond to all tickets within 24 hours during business days.</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
