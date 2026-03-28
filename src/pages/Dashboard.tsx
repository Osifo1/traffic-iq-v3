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
  <div className="glow-card p-5">
    <div className="flex items-center justify-between mb-3">
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

interface User {
  role: "traffic_officer" | "agency_director" | "toll_operator";
  name: string;
}

interface DashboardProps {
  feeds: Feed[];
  user: User;
}

const Dashboard = ({ feeds, user }: DashboardProps) => {
  const [selectedCamera, setSelectedCamera] = useState(cameraFeeds[0].name);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <option value="__all__">All Feeds</option>
              {cameraFeeds.map((f) => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>
          {selectedCamera === "__all__" ? (
            <div className="grid grid-cols-2 gap-2">
              {cameraFeeds.map((feed) => (
                <div key={feed.id} className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <Camera className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                      <p className="text-[10px] text-muted-foreground">{feed.name}</p>
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                        <span className="text-[9px] text-primary font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
                    CAM-{String(feed.id).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border border-border">
  {feeds.length > 0 ? (
  <div className="grid grid-cols-2 gap-1 w-full h-full">
    {feeds.filter(Boolean).slice(0, 4).map((feed, i) => (
      <div key={i} className="relative overflow-hidden">
        <video
          src={feed.url}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1 left-1 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[8px] font-mono text-primary">
          {feed.name}
        </div>
        <div className="absolute top-1 right-1 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] text-primary">Live</span>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center space-y-2">
      <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto" />
      <p className="text-sm text-muted-foreground">No feeds loaded</p>
      <p className="text-xs text-muted-foreground/60">
        Upload clips on the Live Feed page
      </p>
    </div>
  </div>
)}
</div>
          )}
        </div>

        {/* Plate log */}
        <div className="lg:col-span-2 glow-card p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Real-Time Plate Log</h2>
          <div className="overflow-auto max-h-[400px] scrollbar-thin">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">Plate</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Camera</th>
                  <th className="text-right py-2 font-medium">Conf.</th>
                </tr>
              </thead>
              <tbody>
                {recentPlates.length > 0 ? recentPlates.slice(0, 8).map((entry: any, i: number) => (
                  <tr
                    key={i}
                    className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/30" : ""}`}
                  >
                    <td className="py-2 font-mono font-medium text-foreground">{entry.canonical_plate || entry.plate}</td>
                    <td className="py-2 text-muted-foreground">{entry.vehicle_type || entry.vehicleType}</td>
                    <td className="py-2 text-muted-foreground">{entry.camera}</td>
                    <td className="py-2 text-right">
                      <span className={(entry.best_confidence || entry.confidence) > 90 ? "text-primary" : "text-amber"}>
                        {((entry.best_confidence || entry.confidence) * 1).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No recent plates</td></tr>
                )}
              </tbody>
            </table>
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
