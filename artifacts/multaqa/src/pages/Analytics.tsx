import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";

const ORANGE = "#FF5100";
const NAVY = "#001279";
const GREEN = "#1A7A4A";

const monthlyRevenue = [
  { month: "Nov", revenue: 2100, bookings: 14 },
  { month: "Dec", revenue: 1800, bookings: 11 },
  { month: "Jan", revenue: 3200, bookings: 22 },
  { month: "Feb", revenue: 4100, bookings: 29 },
  { month: "Mar", revenue: 3800, bookings: 26 },
  { month: "Apr", revenue: 5200, bookings: 35 },
  { month: "May", revenue: 4600, bookings: 31 },
];

const occupancyByDay = [
  { day: "Sun", nablus: 42, ramallah: 35 },
  { day: "Mon", nablus: 78, ramallah: 65 },
  { day: "Tue", nablus: 85, ramallah: 72 },
  { day: "Wed", nablus: 90, ramallah: 80 },
  { day: "Thu", nablus: 82, ramallah: 74 },
  { day: "Fri", nablus: 30, ramallah: 22 },
  { day: "Sat", nablus: 55, ramallah: 48 },
];

const popularSeats = [
  { name: "Desk A-1", bookings: 42 },
  { name: "Desk A-5", bookings: 38 },
  { name: "Meeting R-2", bookings: 35 },
  { name: "Desk A-3", bookings: 31 },
  { name: "Focus R-1", bookings: 28 },
  { name: "Desk A-2", bookings: 24 },
];

const dropOffFunnel = [
  { stage: "Browse Desks", users: 1240 },
  { stage: "View Detail", users: 820 },
  { stage: "Start Booking", users: 490 },
  { stage: "Step 2 Review", users: 370 },
  { stage: "Confirmed", users: 310 },
];

const peakHoursData: { hour: string; Mon: number; Tue: number; Wed: number; Thu: number; Fri: number }[] = [
  { hour: "8–9", Mon: 20, Tue: 25, Wed: 30, Thu: 22, Fri: 10 },
  { hour: "9–10", Mon: 55, Tue: 70, Wed: 75, Thu: 60, Fri: 20 },
  { hour: "10–11", Mon: 80, Tue: 90, Wed: 95, Thu: 85, Fri: 35 },
  { hour: "11–12", Mon: 85, Tue: 92, Wed: 98, Thu: 88, Fri: 40 },
  { hour: "12–13", Mon: 60, Tue: 65, Wed: 70, Thu: 62, Fri: 30 },
  { hour: "13–14", Mon: 50, Tue: 58, Wed: 65, Thu: 55, Fri: 25 },
  { hour: "14–15", Mon: 75, Tue: 80, Wed: 88, Thu: 78, Fri: 30 },
  { hour: "15–16", Mon: 70, Tue: 78, Wed: 85, Thu: 72, Fri: 28 },
  { hour: "16–17", Mon: 45, Tue: 50, Wed: 55, Thu: 48, Fri: 18 },
  { hour: "17–18", Mon: 25, Tue: 30, Wed: 35, Thu: 28, Fri: 12 },
];

function heatColor(val: number) {
  if (val >= 90) return "#001279";
  if (val >= 70) return "#001D99";
  if (val >= 50) return "#FF5100";
  if (val >= 30) return "#FF8052";
  return "#FFDDD1";
}

export default function Analytics() {
  const { currentLocation, setCurrentLocation, bookings } = useAppContext();
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap" | "funnel">("overview");

  const locationBookings = bookings.filter(b => b.location === currentLocation);
  const totalRevenue = locationBookings.filter(b => b.paymentStatus === "Paid").reduce((s, b) => s + b.totalPrice, 0);
  const avgOccupancy = currentLocation === "Nablus" ? 72 : 61;

  const days: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri")[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-1">Analytics & Reporting</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Data powered by
            <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs font-medium text-secondary border border-border">
              <span className="text-[10px]">GA</span> Google Analytics
            </span>
            <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs font-medium text-secondary border border-border">
              ◈ Microsoft Clarity
            </span>
          </p>
        </div>
        <div className="bg-white p-1 rounded-lg border border-border inline-flex">
          {(["Nablus", "Ramallah"] as const).map(loc => (
            <button key={loc} onClick={() => setCurrentLocation(loc)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentLocation === loc ? "bg-secondary text-white shadow-sm" : "text-muted-foreground hover:text-secondary"}`}>
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue (May)", value: `${totalRevenue} ILS`, icon: <DollarSign className="w-4 h-4" />, color: "text-success" },
          { label: "Avg Occupancy Rate", value: `${avgOccupancy}%`, icon: <BarChart3 className="w-4 h-4" />, color: "text-primary" },
          { label: "Total Bookings (May)", value: String(locationBookings.length), icon: <Users className="w-4 h-4" />, color: "text-secondary" },
          { label: "MoM Growth", value: "+14%", icon: <TrendingUp className="w-4 h-4" />, color: "text-success" },
        ].map(kpi => (
          <Card key={kpi.label} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.label}</CardTitle>
              <span className={kpi.color}>{kpi.icon}</span>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["overview", "heatmap", "funnel"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-secondary text-white" : "bg-white border border-border text-muted-foreground hover:text-secondary"}`}>
            {tab === "heatmap" ? "Peak Hours Heatmap" : tab === "funnel" ? "Drop-off Funnel" : "Overview Charts"}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-secondary mb-1">Monthly Revenue (ILS)</h3>
            <p className="text-xs text-muted-foreground mb-6">Last 7 months</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyRevenue} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#535060" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#535060" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v} ILS`, "Revenue"]} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Bar dataKey="revenue" fill={ORANGE} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-secondary mb-1">Occupancy Rate by Day (%)</h3>
            <p className="text-xs text-muted-foreground mb-6">Nablus vs Ramallah — this week</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={occupancyByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#535060" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#535060" }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="nablus" name="Nablus" stroke={NAVY} strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ramallah" name="Ramallah" stroke={ORANGE} strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Seats */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 lg:col-span-2">
            <h3 className="font-bold text-secondary mb-1">Most Popular Spaces</h3>
            <p className="text-xs text-muted-foreground mb-6">By total bookings — all time</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={popularSeats} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#535060" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12, fill: "#535060" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [v, "Bookings"]} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Bar dataKey="bookings" radius={[0, 4, 4, 0]}>
                  {popularSeats.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? ORANGE : i < 3 ? NAVY : "#535060"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "heatmap" && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <h3 className="font-bold text-secondary mb-1">Peak Hours Heatmap</h3>
          <p className="text-xs text-muted-foreground mb-8">Occupancy % by hour and weekday — darker = more occupied</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4 w-20">Hour</th>
                  {days.map(d => (
                    <th key={d} className="text-center text-xs font-semibold text-muted-foreground pb-3 px-2">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peakHoursData.map(row => (
                  <tr key={row.hour}>
                    <td className="text-xs text-muted-foreground font-medium py-1.5 pr-4">{row.hour}</td>
                    {days.map(d => {
                      const val = row[d];
                      return (
                        <td key={d} className="px-1.5 py-1.5">
                          <div
                            className="w-full h-10 rounded-md flex items-center justify-center text-xs font-bold transition-all"
                            style={{ background: heatColor(val), color: val >= 50 ? "white" : "#535060" }}
                            title={`${val}%`}
                          >
                            {val}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <span className="text-xs text-muted-foreground">Low</span>
            {["#FFDDD1","#FF8052","#FF5100","#001D99","#001279"].map(c => (
              <div key={c} className="w-8 h-3 rounded" style={{ background: c }} />
            ))}
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
      )}

      {activeTab === "funnel" && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <h3 className="font-bold text-secondary mb-1">Booking Drop-off Funnel</h3>
          <p className="text-xs text-muted-foreground mb-8">How many users complete each stage — this month</p>
          <div className="space-y-4 max-w-xl mx-auto">
            {dropOffFunnel.map((stage, i) => {
              const pct = Math.round((stage.users / dropOffFunnel[0].users) * 100);
              const dropOff = i > 0 ? dropOffFunnel[i - 1].users - stage.users : 0;
              return (
                <div key={stage.stage}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-1 pl-4">
                      <div className="w-0.5 h-4 bg-border mx-auto" />
                      <span className="text-xs text-destructive font-medium">-{dropOff} dropped ({Math.round((dropOff / dropOffFunnel[i-1].users) * 100)}%)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-32 shrink-0">
                      <p className="text-xs font-semibold text-secondary">{stage.stage}</p>
                      <p className="text-lg font-bold text-secondary">{stage.users}</p>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-3 transition-all"
                        style={{ width: `${pct}%`, background: i === 0 ? NAVY : i < 3 ? ORANGE : GREEN }}
                      >
                        <span className="text-white text-xs font-bold">{pct}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 p-5 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm font-bold text-secondary mb-1">Insight</p>
            <p className="text-sm text-muted-foreground">The biggest drop-off (25%) occurs between Step 1 and Step 2. Consider simplifying the date/time picker or adding a time-slot recommendation to reduce friction.</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
