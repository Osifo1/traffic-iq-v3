import { useCallback, useState } from "react";
import { UserX, MapPin, Clock, Flag, X, Plus } from "lucide-react";
import { fetchOffenders, addToWatchlist } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner, ErrorState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  role: "traffic_officer" | "agency_director" | "toll_operator";
  name: string;
}

interface OffendersProps {
  user: User;
}

const Offenders = ({ user }: OffendersProps) => {
  const fetcher = useCallback(() => fetchOffenders(20), []);
  const { data: offenders, loading, error, retry } = useApi(fetcher);
  const [selectedOffender, setSelectedOffender] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const offenderList = Array.isArray(offenders) ? offenders : [];

  const handleAddToWatchlist = async () => {
    if (!selectedOffender) return;
    
    setAddingToWatchlist(true);
    try {
      await addToWatchlist(
        selectedOffender.plate_text,
        "Repeat offender flagged from Offenders page",
        "EDSTMA Officer"
      );
      setSuccessMessage(`${selectedOffender.plate_text} added to watchlist successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      alert("Failed to add to watchlist. Please try again.");
    } finally {
      setAddingToWatchlist(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Repeat Offenders</h1>
        <p className="text-sm text-muted-foreground">
          Vehicles flagged multiple times across Benin City camera feeds
        </p>
      </div>

      {/* Summary */}
      <div className="glow-card p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
          <UserX className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Repeat Offenders</p>
          <p className="text-xl font-bold text-foreground">{offenderList.length}</p>
        </div>
      </div>

      {/* Offenders table */}
      {loading ? <LoadingSpinner /> : error ? <ErrorState message={error} onRetry={retry} /> : (
        <div className="glow-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <span className="text-xs text-muted-foreground">
              Showing {offenderList.length} repeat offenders ranked by flag count
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Rank</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Plate Number</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Flag Count</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Cameras Seen</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">First Seen</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Last Seen</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody>
                {offenderList.map((offender: any, i: number) => {
                  const risk = offender.flag_count >= 10 ? "High"
                    : offender.flag_count >= 5 ? "Medium" : "Low";
                  const riskStyle = getRiskColor(risk);

                  return (
                    <tr
                      key={i}
                      className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
                      onClick={() => {
                        setSelectedOffender(offender);
                        setNotes("");
                        setSuccessMessage("");
                      }}
                    >
                      <td className="p-3 text-muted-foreground font-mono text-xs">
                        #{String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="p-3 font-mono font-bold text-foreground">
                        {offender.plate_text}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3 h-3 text-destructive" />
                          <span className="font-bold text-destructive">
                            {offender.flag_count}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{offender.cameras}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {offender.first_seen
                            ? new Date(offender.first_seen).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground font-mono">
                        {offender.last_seen
                          ? new Date(offender.last_seen).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${riskStyle}`}>
                          {risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {offenderList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No repeat offenders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Offender Detail Modal */}
      {selectedOffender && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-red-500 bg-card">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {selectedOffender.plate_text}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-sm px-3 py-1 ${getRiskColor(
                        selectedOffender.flag_count >= 10 ? "High" : selectedOffender.flag_count >= 5 ? "Medium" : "Low"
                      )}`}>
                        {selectedOffender.flag_count >= 10 ? "High" : selectedOffender.flag_count >= 5 ? "Medium" : "Low"} Risk
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOffender(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Flag Count */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Flag className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Flag Count</p>
                  <p className="text-xl font-bold text-foreground">{selectedOffender.flag_count}</p>
                </div>
              </div>

              {/* Cameras Seen */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Cameras Seen</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOffender.cameras.split(", ").map((camera: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {camera.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">First Seen</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedOffender.first_seen
                        ? new Date(selectedOffender.first_seen).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Seen</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedOffender.last_seen
                        ? new Date(selectedOffender.last_seen).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Officer Notes</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add officer comments about this offender..."
                  className="w-full h-24 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-500 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddToWatchlist}
                  disabled={addingToWatchlist}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {addingToWatchlist ? "Adding..." : "Add to Watchlist"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedOffender(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Offenders;