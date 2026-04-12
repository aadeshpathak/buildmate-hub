import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard, Package, CalendarCheck, MessageSquare, FileText, Settings, LogOut,
  TrendingUp, Users, IndianRupee, Truck, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMachines } from "@/hooks/useMachines";
import { Machine } from "@/data/machines";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

type Tab = "overview" | "machines" | "bookings" | "messages" | "settings";

const sidebarItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "machines", label: "Machines", icon: <Package className="w-5 h-5" /> },
  { id: "bookings", label: "Bookings", icon: <CalendarCheck className="w-5 h-5" /> },
  { id: "messages", label: "Messages", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

const mockBookings = [
  { id: "B001", machine: "ARGO 2000 Self-Loading Concrete Mixer", customer: "Rajesh Kumar", date: "2026-04-05", days: 3, total: 28800, status: "pending" },
  { id: "B002", machine: "CRB 45 Batching Plant", customer: "Priya Sharma", date: "2026-04-03", days: 7, total: 224000, status: "confirmed" },
  { id: "B003", machine: "Transit Mixer 9 cu.m", customer: "Amit Patel", date: "2026-04-01", days: 2, total: 35200, status: "completed" },
  { id: "B004", machine: "Concrete Pump 50 cu.m/hr", customer: "Sanjay Verma", date: "2026-04-06", days: 14, total: 392000, status: "pending" },
  { id: "B005", machine: "D6 Bulldozer", customer: "Meena Gupta", date: "2026-03-28", days: 5, total: 100000, status: "completed" },
];

const mockMessages = [
  { id: 1, user: "Rajesh Kumar", message: "I want to book the JCB 3CX for next week", time: "10 min ago", unread: true },
  { id: 2, user: "Priya Sharma", message: "Can I extend my crane rental by 2 days?", time: "1 hr ago", unread: true },
  { id: 3, user: "Amit Patel", message: "Invoice received. Thanks!", time: "3 hrs ago", unread: false },
  { id: 4, user: "Sanjay Verma", message: "Need tower crane specs for my project", time: "5 hrs ago", unread: false },
];

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend?: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground mt-1">{value}</p>
        {trend && <p className="text-xs mt-1 text-green-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trend}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
    </div>
  </motion.div>
);

const statusColor = (s: string) => {
  if (s === "confirmed") return "bg-green-500/10 text-green-400 border-green-500/20";
  if (s === "pending") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  return "bg-muted text-muted-foreground border-border";
};

const AdminDashboard = () => {
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { machines, loading: machinesLoading } = useMachines();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  // Force debug logging
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isMobile ? (
        // Mobile Layout with Bottom Tab Bar
        <>
          {/* Main Content */}
          <main className="flex-1 pb-20">
            <header className="h-14 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-center px-4 sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-base font-display font-bold text-foreground">Equipment Hub</h1>
                  <p className="text-xs text-muted-foreground">Manage your fleet</p>
                </div>
              </div>
              <div className="ml-auto">
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">Admin</Badge>
              </div>
            </header>

            <div className="p-4">
              {tab === "overview" && <OverviewTab />}
              {tab === "machines" && <MachinesTab machines={machines} loading={machinesLoading} />}
              {tab === "bookings" && <BookingsTab isMobile={isMobile} />}
              {tab === "messages" && <MessagesTab />}
              {tab === "settings" && <SettingsTab />}
            </div>
          </main>

          {/* Bottom Tab Bar */}
          <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-bottom"
          >
            <div className="flex items-center justify-around px-2 py-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                    tab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-colors ${
                    tab === item.id ? "bg-primary/20" : ""
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.nav>
        </>
      ) : (
        // Desktop Layout with Sidebar
        <>
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 border-r border-border bg-card flex flex-col fixed h-full z-40`}
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-primary-foreground text-lg">BR</span>
              </div>
              {sidebarOpen && <span className="font-display text-lg font-bold text-foreground">Admin</span>}
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    tab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.icon}
                  {sidebarOpen && item.label}
                </button>
              ))}
            </nav>

            <div className="p-3 border-t border-border">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-5 h-5" />
                {sidebarOpen && "Logout"}
              </button>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-display font-bold text-foreground">Equipment Hub</h1>
                  <p className="text-xs text-muted-foreground">Manage your construction fleet</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary/30 text-primary">Admin</Badge>
              </div>
            </header>

            <div className="p-6">
              {tab === "overview" && <OverviewTab />}
              {tab === "machines" && <MachinesTab machines={machines} loading={machinesLoading} />}
              {tab === "bookings" && <BookingsTab isMobile={isMobile} />}
              {tab === "messages" && <MessagesTab />}
              {tab === "settings" && <SettingsTab />}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

const OverviewTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<IndianRupee className="w-5 h-5" />} label="Total Revenue" value="₹9,20,000" trend="+12% this month" />
      <StatCard icon={<CalendarCheck className="w-5 h-5" />} label="Active Bookings" value="23" trend="+3 today" />
      <StatCard icon={<Truck className="w-5 h-5" />} label="Machines Listed" value={String(machines.length)} />
      <StatCard icon={<Users className="w-5 h-5" />} label="Total Customers" value="1,247" trend="+28 this week" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <h3 className="font-display font-bold text-foreground mb-4">Recent Bookings</h3>
        <div className="space-y-3">
          {mockBookings.slice(0, 3).map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="text-sm font-medium text-foreground">{b.machine}</p>
                <p className="text-xs text-muted-foreground">{b.customer} · {b.days} days</p>
              </div>
              <Badge className={statusColor(b.status)}>{b.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display font-bold text-foreground mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {mockMessages.slice(0, 3).map((m) => (
            <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {m.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{m.user}</p>
                  {m.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{m.message}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{m.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MachinesTab = ({ machines, loading }: { machines: Machine[]; loading: boolean }) => {
  const [error, setError] = useState<string | null>(null);

  // Simulate error handling
  useEffect(() => {
    if (!loading && machines.length === 0) {
      // Check if it's an actual error vs empty state
      setError(null);
    }
  }, [loading, machines]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Input placeholder="Search machines..." className="w-full sm:max-w-xs bg-secondary border-border" />
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Machine
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mb-4"
          />
          <p className="text-muted-foreground text-sm">Loading your equipment...</p>
          <p className="text-xs text-muted-foreground mt-1">Please wait</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-6 h-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium mb-2">Failed to load machines</p>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : machines.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium mb-2">No machines found</p>
          <p className="text-sm text-muted-foreground">Add your first machine to get started</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Machine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((m, index) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-border hover:bg-secondary/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={m.image} alt={m.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-foreground text-sm">{m.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{m.category}</TableCell>
                  <TableCell className="text-foreground text-sm font-medium">₹{m.pricePerDay.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{m.location}</TableCell>
                  <TableCell>
                    <Badge className={m.available ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                      {m.available ? "Available" : "Rented"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
};

const BookingsTab = ({ isMobile }: { isMobile: boolean }) => {

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <Button variant="outline" className="border-border text-foreground gap-2 whitespace-nowrap"><Clock className="w-4 h-4" /> Pending (2)</Button>
        <Button variant="outline" className="border-border text-muted-foreground gap-2 whitespace-nowrap"><CheckCircle className="w-4 h-4" /> Confirmed (1)</Button>
        <Button variant="outline" className="border-border text-muted-foreground gap-2 whitespace-nowrap"><XCircle className="w-4 h-4" /> Completed (2)</Button>
      </div>

      {isMobile ? (
        // Mobile card layout
        <div className="space-y-3">
          {mockBookings.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded">{b.id}</span>
                    <Badge className={statusColor(b.status)}>{b.status}</Badge>
                  </div>
                  <h4 className="font-medium text-foreground text-sm leading-tight mb-1">{b.machine}</h4>
                  <p className="text-xs text-muted-foreground">{b.customer}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Date</span>
                  <span className="font-medium text-foreground">{b.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Duration</span>
                  <span className="font-medium text-foreground">{b.days} days</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block">Total</span>
                  <span className="font-bold text-foreground text-sm">₹{b.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {b.status === "pending" && (
                  <>
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-xs">Approve</Button>
                    <Button size="sm" variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10 text-xs">Reject</Button>
                  </>
                )}
                {b.status !== "pending" && (
                  <Button variant="outline" size="sm" className="w-full text-xs"><FileText className="w-3 h-3 mr-1" />View Invoice</Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Desktop table layout
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Booking ID</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((b) => (
                <TableRow key={b.id} className="border-border">
                  <TableCell className="font-mono text-sm text-primary">{b.id}</TableCell>
                  <TableCell className="text-foreground text-sm">{b.machine}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{b.customer}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{b.date}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{b.days} days</TableCell>
                  <TableCell className="text-foreground font-medium text-sm">₹{b.total.toLocaleString()}</TableCell>
                  <TableCell><Badge className={statusColor(b.status)}>{b.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {b.status === "pending" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" className="h-7 bg-green-600 hover:bg-green-700 text-xs">Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 border-destructive text-destructive hover:bg-destructive/10 text-xs">Reject</Button>
                      </div>
                    )}
                    {b.status !== "pending" && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground"><FileText className="w-3 h-3 mr-1" />Invoice</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

const MessagesTab = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-display font-bold text-foreground">User Messages</h2>
    <div className="space-y-3">
      {mockMessages.map((m) => (
        <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
            {m.user.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground text-sm">{m.user}</span>
              {m.unread && <Badge className="bg-primary/20 text-primary text-[10px] px-1.5">New</Badge>}
              <span className="text-xs text-muted-foreground ml-auto">{m.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{m.message}</p>
          </div>
          <Button size="sm" variant="outline" className="border-border text-sm shrink-0">Reply</Button>
        </motion.div>
      ))}
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="glass-card p-6 max-w-lg space-y-6">
    <h2 className="text-lg font-display font-bold text-foreground">Admin Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Business Name</label>
        <Input defaultValue="BuildRent" className="bg-secondary border-border" />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Contact Email</label>
        <Input defaultValue="admin@buildrent.in" className="bg-secondary border-border" />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Change Admin Password</label>
        <Input type="password" placeholder="New password" className="bg-secondary border-border" />
      </div>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
    </div>
  </div>
);

export default AdminDashboard;
