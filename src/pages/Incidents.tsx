import { useState, useCallback } from "react";
import { AlertTriangle, CheckCircle, Clock, Filter, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchIncidents, updateIncident } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner, ErrorState } from "@/components/LoadingState";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Open: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Resolved: "bg-primary/10 text-primary border-primary/20",
    Acknowledged: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[status] || ""}`}>
      {status}
    </span>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    "Watchlist Match": "bg-destructive/10 text-destructive border-destructive/20",
    "Stall": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Queue Jump": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Congestion": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "Speeding": "bg-red-500/10 text-red-400 border-red-500/20",
    "Wrong Way": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[type] || "bg-muted text-muted-foreground border-border"}`}>
      {type}
    </span>
  );
};

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

interface IncidentsProps {
  user: User;
  manualIncidents: ManualIncident[];
}

const Incidents = ({ user, manualIncidents }: IncidentsProps) => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [cameraFilter, setCameraFilter] = useState("All");
  const [updating, setUpdating] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<{[key: number]: string}>({});
  const [showAssignDropdown, setShowAssignDropdown] = useState<number | null>(null);

  const officers = [
    "Okafor Emmanuel",
    "Iyamu Festus", 
    "Aigbe Collins",
    "Omoruyi Sandra"
  ];

  const fetcher = useCallback(
    () => fetchIncidents(
      statusFilter !== "All" ? statusFilter : undefined,
      cameraFilter !== "All" ? cameraFilter : undefined,
      typeFilter !== "All" ? typeFilter : undefined,
    ),
    [statusFilter, typeFilter, cameraFilter]
  );

  const { data: incidents, loading, error, retry } = useApi(fetcher);

  const handleResolve = async (id: number) => {
    setUpdating(id);
    try {
      await updateIncident(id, "Resolved", "Resolved by officer");
      retry();
    } catch (e) {
      alert("Failed to update incident.");
    } finally {
      setUpdating(null);
    }
  };

  const handleAcknowledge = async (id: number) => {
    setUpdating(id);
    try {
      await updateIncident(id, "Acknowledged", "Acknowledged by officer");
      retry();
    } catch (e) {
      alert("Failed to update incident.");
    } finally {
      setUpdating(null);
    }
  };

  const handleAssign = (incidentId: number, officerName: string) => {
    setAssignments(prev => ({ ...prev, [incidentId]: officerName }));
    setShowAssignDropdown(null);
  };

  const incidentList = Array.isArray(incidents) ? incidents : [];

  const openCount = incidentList.filter(i => i.status === "Open").length;
  const resolvedCount = incidentList.filter(i => i.status === "Resolved").length;
  const watchlistCount = incidentList.filter(i => i.incident_type === "Watchlist Match").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incidents</h1>
          <p className="text-sm text-muted-foreground">
            Manage and resolve traffic incidents across all Benin City camera feeds
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glow-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="text-xl font-bold text-foreground">{openCount}</p>
          </div>
        </div>
        <div className="glow-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Resolved</p>
            <p className="text-xl font-bold text-foreground">{resolvedCount}</p>
          </div>
        </div>
        <div className="glow-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Watchlist Hits</p>
            <p className="text-xl font-bold text-foreground">{watchlistCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glow-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Filters</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Types</option>
            <option value="Watchlist Match">Watchlist Match</option>
            <option value="Stall">Stall</option>
            <option value="Congestion">Congestion</option>
            <option value="Speeding">Speeding</option>
            <option value="Wrong Way">Wrong Way</option>
          </select>
          <select
            value={cameraFilter}
            onChange={(e) => setCameraFilter(e.target.value)}
            className="bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Cameras</option>
            <option value="Airport Road Feed">Airport Road Feed</option>
            <option value="Sapele Road Feed">Sapele Road Feed</option>
            <option value="Ring Road Checkpoint">Ring Road Checkpoint</option>
            <option value="Aduwawa Corridor">Aduwawa Corridor</option>
          </select>
        </div>
      </div>

      {/* Incidents table */}
      {loading ? <LoadingSpinner /> : error ? <ErrorState message={error} onRetry={retry} /> : (
        <div className="glow-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <span className="text-xs text-muted-foreground">
              Showing {incidentList.length} incidents
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Camera</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Plate</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Time</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Assigned</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Manual Incidents */}
                {manualIncidents.slice().reverse().map((incident, i) => (
                  <tr
                    key={incident.id}
                    className="border-b border-border/50 bg-destructive/5"
                  >
                    <td className="p-3 text-muted-foreground font-mono text-xs">
                      #{String(incident.id).padStart(4, "0")}
                    </td>
                    <td className="p-3">
                      <TypeBadge type={incident.incident_type} />
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{incident.camera}</td>
                    <td className="p-3 font-mono text-xs text-foreground">
                      {incident.plate_text}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground font-mono">
                      {incident.created_at ? new Date(incident.created_at).toLocaleString() : "N/A"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] text-green-400 font-medium">LIVE</span>
                        <Badge variant="destructive" className="ml-2 text-xs">LIVE</Badge>
                      </div>
                    </td>
                  </tr>
                ))}
                {incidentList.map((incident: any, i: number) => (
                  <tr
                    key={incident.id}
                    className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""} ${
                      incident.incident_type === "Watchlist Match" ? "border-l-2 border-l-destructive" : ""
                    }`}
                  >
                    <td className="p-3 text-muted-foreground font-mono text-xs">
                      #{String(incident.id).padStart(4, "0")}
                    </td>
                    <td className="p-3">
                      <TypeBadge type={incident.incident_type} />
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{incident.camera}</td>
                    <td className="p-3 font-mono text-xs text-foreground">
                      {incident.plate_text || "N/A"}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground font-mono">
                      {incident.created_at ? new Date(incident.created_at).toLocaleString() : "N/A"}
                    </td>
                    <td className="p-3">
                      {assignments[incident.id] ? (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          <User className="h-3 w-3 mr-1" />
                          {assignments[incident.id]}
                        </Badge>
                      ) : (
                        <span className="text-gray-500 text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {/* Assign Button */}
                        {incident.status === "Open" && !assignments[incident.id] && (
                          <div className="relative">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                              onClick={() => setShowAssignDropdown(
                                showAssignDropdown === incident.id ? null : incident.id
                              )}
                            >
                              <User className="w-3 h-3 mr-1" />
                              Assign
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                            
                            {/* Dropdown */}
                            {showAssignDropdown === incident.id && (
                              <div className="absolute top-full left-0 mt-1 w-40 bg-card border border-border rounded-md shadow-lg z-10">
                                {officers.map((officer) => (
                                  <button
                                    key={officer}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                                    onClick={() => handleAssign(incident.id, officer)}
                                  >
                                    {officer}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Existing Action Buttons */}
                        {incident.status === "Open" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            onClick={() => handleAcknowledge(incident.id)}
                            disabled={updating === incident.id}
                          >
                            Acknowledge
                          </Button>
                        )}
                        {incident.status !== "Resolved" && (
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleResolve(incident.id)}
                            disabled={updating === incident.id}
                          >
                            {updating === incident.id ? "..." : "Resolve"}
                          </Button>
                        )}
                        {incident.status === "Resolved" && (
                          <span className="text-xs text-primary flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {incidentList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No incidents match filters
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

export default Incidents;