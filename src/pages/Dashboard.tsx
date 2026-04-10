import { Car, CreditCard, Camera, AlertTriangle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { cameraFeeds } from "@/data/mockData";
import { useState, useCallback } from "react";
import { fetchStats } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner, ErrorState } from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";

const StatCard = ({
  label, value, icon: Icon, color,
}: {
  label: string; value: number | string; icon: React.ElementType; color: string;
}) => (
  <div className="glow-card p-3">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-2xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Open: "bg-amber/10 text-amber border-amber/20",
    Resolved: "bg-primary/10 text-primary border-primary/20",
    Flagged: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[status] || ""}`}>
      {status}
    </span>
  );
};

interface Feed {
  url: string;
  name: string;
  fileName: string;
}

interface ManualIncident {
  id: string;
  camera: string;
  incident_type: string;
  plate_text: string;
  notes: string;
  created_at: string;
  status: string;
}

interface User {
  role: "traffic_officer" | "agency_director" | "toll_operator";
  name: string;
}

interface DashboardProps {
  feeds: Feed[];
  user: User;
  manualIncidents: ManualIncident[];
}

const Dashboard = ({ feeds, user, manualIncidents }: DashboardProps) => {
  const [selectedCamera, setSelectedCamera] = useState("All Feeds");
  const fetcher = useCallback(() => fetchStats(), []);
  const { data: stats, loading, error, retry } = useApi(fetcher);

  if (loading) return <LoadingSpinner />;
  if (error || !stats) return <ErrorState message={error || "Failed to load"} onRetry={retry} />;

  const totalVehicles = stats.total_vehicles || 0;
  const activeCameras = stats.vehicles_per_feed ? Object.keys(stats.vehicles_per_feed).length : 0;
  const openIncidents = stats.open_incidents || 0;
  const watchlistHits = stats.watchlist_hits || 0;
  const vehicleCounts = stats.vehicles_by_type || {};

  // Build chart data from vehicles_by_type
  const chartData = Object.entries(vehicleCounts).map(([type, count]) => ({
    type,
    count: count as number,
  }));

  // Build recent plates from stats if available
  const recentPlates = stats.recent_plates || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good morning, {user.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user.role === "agency_director" 
              ? "City-wide traffic intelligence overview — Benin City"
              : user.role === "traffic_officer"
              ? "Your traffic intelligence dashboard — Benin City"
              : "Toll operations overview — Benin City"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-medium text-primary">LIVE</span>
        </div>
      </div>

      {/* Alert Banner for Watchlist Matches */}
      {watchlistHits > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                Active Watchlist Alert
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                {watchlistHits} watchlist match{watchlistHits > 1 ? 'es' : ''} detected. Immediate attention required.
              </p>
            </div>
            <Badge variant="destructive">
              {watchlistHits}
            </Badge>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Vehicles Detected" value={totalVehicles} icon={Car} color="bg-primary/10 text-primary" />
<StatCard label="Open Incidents" value={openIncidents} icon={AlertTriangle} color="bg-amber/10 text-amber" />
<StatCard label="Active Camera Feeds" value={activeCameras} icon={Camera} color="bg-primary/10 text-primary" />
<StatCard label="Watchlist Hits" value={watchlistHits} icon={CreditCard} color="bg-destructive/10 text-destructive" />
      </div>

      {/* Two columns: video + plate log */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Video feed */}
        <div className="lg:col-span-3 glow-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Live Camera Feed</h2>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="text-xs bg-muted border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All Feeds">All Feeds</option>
              <option value="Airport Road Feed">Airport Road Feed</option>
              <option value="Sapele Road Feed">Sapele Road Feed</option>
              <option value="Ring Road Checkpoint">Ring Road Checkpoint</option>
              <option value="Aduwawa Corridor">Aduwawa Corridor</option>
            </select>
          </div>
          {selectedCamera === "All Feeds" ? (
            <div className="grid grid-cols-2 gap-2">
              {feeds[0] && (
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <video
                    src={feeds[0].url}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-01
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    Airport Road Feed
                  </div>
                </div>
              )}
              {feeds[1] && (
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <video
                    src={feeds[1].url}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-02
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    Sapele Road Feed
                  </div>
                </div>
              )}
              {feeds[2] && (
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <video
                    src={feeds[2].url}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-03
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    Ring Road Checkpoint
                  </div>
                </div>
              )}
              {feeds[3] && (
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <video
                    src={feeds[3].url}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-04
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    Aduwawa Corridor
                  </div>
                </div>
              )}
              {!feeds[0] && (
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <Camera className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                      <p className="text-[10px] text-muted-foreground">Airport Road Feed</p>
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                        <span className="text-[9px] text-primary font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-01
                  </div>
                </div>
              )}
              {!feeds[1] && (
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <Camera className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                      <p className="text-[10px] text-muted-foreground">Sapele Road Feed</p>
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                        <span className="text-[9px] text-primary font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-02
                  </div>
                </div>
              )}
              {!feeds[2] && (
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <Camera className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                      <p className="text-[10px] text-muted-foreground">Ring Road Checkpoint</p>
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                        <span className="text-[9px] text-primary font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-03
                  </div>
                </div>
              )}
              {!feeds[3] && (
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <Camera className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                      <p className="text-[10px] text-muted-foreground">Aduwawa Corridor</p>
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                        <span className="text-[9px] text-primary font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-04
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
              {selectedCamera === "Airport Road Feed" && feeds[0] ? (
                <>
                  <video
                    src={feeds[0].url}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-01
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    Airport Road Feed
                  </div>
                </>
              ) : selectedCamera === "Airport Road Feed" && !feeds[0] ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">Airport Road Feed</p>
                    <p className="text-xs text-muted-foreground/60">No clip loaded for this feed</p>
                  </div>
                </div>
              ) : selectedCamera === "Sapele Road Feed" && feeds[1] ? (
                <>
                  <video
                    src={feeds[1].url}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-02
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    Sapele Road Feed
                  </div>
                </>
              ) : selectedCamera === "Sapele Road Feed" && !feeds[1] ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">Sapele Road Feed</p>
                    <p className="text-xs text-muted-foreground/60">No clip loaded for this feed</p>
                  </div>
                </div>
              ) : selectedCamera === "Ring Road Checkpoint" && feeds[2] ? (
                <>
                  <video
                    src={feeds[2].url}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-03
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    Ring Road Checkpoint
                  </div>
                </>
              ) : selectedCamera === "Ring Road Checkpoint" && !feeds[2] ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">Ring Road Checkpoint</p>
                    <p className="text-xs text-muted-foreground/60">No clip loaded for this feed</p>
                  </div>
                </div>
              ) : selectedCamera === "Aduwawa Corridor" && feeds[3] ? (
                <>
                  <video
                    src={feeds[3].url}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-04
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    Aduwawa Corridor
                  </div>
                </>
              ) : selectedCamera === "Aduwawa Corridor" && !feeds[3] ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">Aduwawa Corridor</p>
                    <p className="text-xs text-muted-foreground/60">No clip loaded for this feed</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Live Incident Feed */}
        <div className="lg:col-span-2 glow-card p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Live Incident Feed</h2>
          <p className="text-xs text-muted-foreground">
            Real-time alerts from active camera feeds
          </p>
          <div className="space-y-2">
            {manualIncidents.length > 0 ? (
              manualIncidents.slice().reverse().slice(0, 5).map((incident, i) => {
                const getBorderClass = (type: string) => {
                  switch (type) {
                    case "Watchlist Match": return "border-l-4 border-l-destructive";
                    case "Stall": return "border-l-4 border-l-orange-500";
                    case "Queue Jump": return "border-l-4 border-l-amber-500";
                    case "Wrong Way": return "border-l-4 border-l-amber-500";
                    case "Congestion": return "border-l-4 border-l-yellow-500";
                    default: return "border-l-4 border-l-border";
                  }
                };

                const getTimeAgo = (createdAt: string) => {
                  const now = new Date();
                  const incidentTime = new Date(createdAt);
                  const diffMinutes = Math.floor((now.getTime() - incidentTime.getTime()) / (1000 * 60));
                  
                  if (diffMinutes < 1) return "Just now";
                  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
                  return `${Math.floor(diffMinutes / 60)} hours ago`;
                };

                return (
                  <div key={incident.id} className={`glow-card p-3 border ${getBorderClass(incident.incident_type)}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-sm">{incident.incident_type}</div>
                        <div className="text-xs text-muted-foreground">{incident.camera}</div>
                        <div className="font-mono text-xs text-foreground mt-1">{incident.plate_text}</div>
                        <div className="text-xs text-muted-foreground">{getTimeAgo(incident.created_at)}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] text-green-400 font-medium">LIVE</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">No active incidents</p>
                  <p className="text-xs text-muted-foreground/60">Trigger an incident from Live Feed page</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detection chart */}
      {chartData.length > 0 && (
        <div className="glow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Vehicle Counts by Type
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="type" stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 50%, 10%)",
                  border: "1px solid hsl(222, 30%, 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line type="monotone" dataKey="count" stroke="hsl(160, 100%, 39%)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
