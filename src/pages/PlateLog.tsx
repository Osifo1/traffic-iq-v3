import { useState, useMemo, useCallback } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPlates } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner, ErrorState } from "@/components/LoadingState";

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

interface User {
  role: "traffic_officer" | "agency_director" | "toll_operator";
  name: string;
}

interface PlateLogProps {
  user: User;
}

const PlateLog = ({ user }: PlateLogProps) => {
  const [search, setSearch] = useState("");
  const [cameraFilter, setCameraFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [confidenceThreshold, setConfidenceThreshold] = useState(0);

  const fetcher = useCallback(() => fetchPlates(), []);
  const { data: allPlates, loading, error, retry } = useApi(fetcher);

  const plates = Array.isArray(allPlates) ? allPlates : [];

  const filtered = useMemo(() => {
    return plates.filter((e: any) => {
      if (search && !((e.plate_text || "").toLowerCase().includes(search.toLowerCase()))) return false;
      if (cameraFilter !== "All" && e.camera !== cameraFilter) return false;
      if (typeFilter !== "All" && e.vehicle_type !== typeFilter) return false;
      if ((e.confidence || 0) < confidenceThreshold / 100) return false;
      return true;
    });
  }, [plates, search, cameraFilter, typeFilter, confidenceThreshold]);

  const cameras = useMemo(() => {
    const set = new Set(plates.map((p: any) => p.camera).filter(Boolean));
    return Array.from(set) as string[];
  }, [plates]);

  const vehicleTypes = useMemo(() => {
    const set = new Set(plates.map((p: any) => p.vehicle_type).filter(Boolean));
    return Array.from(set) as string[];
  }, [plates]);

  const exportCSV = () => {
    const headers = "Plate,Vehicle Type,Camera,Timestamp,Confidence\n";
    const rows = filtered.map((e: any) =>
      `${e.plate_text},${e.vehicle_type},${e.camera},${e.timestamp},${e.confidence}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plate_log_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plate Log</h1>
          <p className="text-sm text-muted-foreground">
            Searchable database of all detected plates across all camera feeds
          </p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="glow-card p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search plates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select value={cameraFilter} onChange={(e) => setCameraFilter(e.target.value)} className="bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="All">All Cameras</option>
            {cameras.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="All">All Types</option>
            {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Confidence ≥ {confidenceThreshold}%
            </span>
            <input
              type="range" min={0} max={100}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(+e.target.value)}
              className="flex-1 accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : error ? <ErrorState message={error} onRetry={retry} /> : (
        <div className="glow-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <span className="text-xs text-muted-foreground">
              Showing {filtered.length} of {plates.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Plate Number</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Vehicle Type</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Camera Feed</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Timestamp</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Confidence</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry: any, i: number) => (
                  <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                    <td className="p-3 text-muted-foreground">#{String(i + 1).padStart(4, "0")}</td>
                    <td className="p-3 font-mono font-medium text-foreground">{entry.plate_text}</td>
                    <td className="p-3 text-muted-foreground">{entry.vehicle_type}</td>
                    <td className="p-3 text-muted-foreground">{entry.camera}</td>
                    <td className="p-3 text-muted-foreground font-mono">{entry.timestamp}</td>
                    <td className="p-3">
                      <span className={(entry.confidence || 0) > 0.9 ? "text-primary" : "text-amber"}>
                        {((entry.confidence || 0) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={entry.status || "Detected"} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No entries match filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlateLog;