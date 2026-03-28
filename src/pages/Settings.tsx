import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus, X } from "lucide-react";

const SettingsPage = () => {
  const [confidence, setConfidence] = useState(85);
  const [cameras, setCameras] = useState([
    "Airport Road Feed", "Sapele Road Feed", "Ring Road Checkpoint", "Aduwawa Corridor",
  ]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [watchlist, setWatchlist] = useState(["BG6-5USJ", "KAN-555-KN"]);
  const [newPlate, setNewPlate] = useState("");

  const addPlate = () => {
    if (newPlate.trim() && !watchlist.includes(newPlate.trim())) {
      setWatchlist([...watchlist, newPlate.trim()]);
      setNewPlate("");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure detection parameters and manage watchlists</p>
      </div>

      {/* Confidence */}
      <div className="glow-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Confidence Threshold</h2>
        <p className="text-xs text-muted-foreground">Minimum confidence level for plate detection alerts</p>
        <div className="flex items-center gap-4">
          <input type="range" min={50} max={100} value={confidence} onChange={(e) => setConfidence(+e.target.value)} className="flex-1 accent-primary" />
          <span className="text-lg font-mono font-bold text-primary w-16 text-right">{confidence}%</span>
        </div>
      </div>

      {/* Camera names */}
      <div className="glow-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Camera Feed Names</h2>
        <div className="space-y-2">
          {cameras.map((cam, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
              <span className="text-xs text-muted-foreground w-16">CAM-{String(i + 1).padStart(2, "0")}</span>
              {editingIdx === i ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                    const updated = [...cameras];
                    updated[i] = editValue;
                    setCameras(updated);
                    setEditingIdx(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  autoFocus
                  className="flex-1 bg-muted border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <span
                  className="flex-1 text-sm text-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => { setEditingIdx(i); setEditValue(cam); }}
                >
                  {cam}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist */}
      <div className="glow-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Watchlist Plates</h2>
        <p className="text-xs text-muted-foreground">Flagged plates that trigger alerts on detection</p>
        <div className="flex gap-2">
          <input
            value={newPlate}
            onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && addPlate()}
            placeholder="Enter plate number..."
            className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button onClick={addPlate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {watchlist.map((plate) => (
            <div key={plate} className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-full px-3 py-1">
              <span className="text-xs font-mono font-medium text-destructive">{plate}</span>
              <button onClick={() => setWatchlist(watchlist.filter((p) => p !== plate))} className="text-destructive/60 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {watchlist.length === 0 && <p className="text-xs text-muted-foreground">No plates in watchlist</p>}
        </div>
      </div>

      {/* Export */}
      <div className="glow-card p-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Export Database</h2>
          <p className="text-xs text-muted-foreground">Download full detection database as CSV</p>
        </div>
        <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
