import { Upload, Play, X, Camera, AlertTriangle, ShieldAlert, Car, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

const CAMERA_NAMES = [
  "Airport Road Feed",
  "Sapele Road Feed",
  "Ring Road Checkpoint",
  "Aduwawa Corridor",
];

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

interface LiveFeedProps {
  feeds: Feed[];
  setFeeds: (feeds: Feed[]) => void;
  user: User;
  manualIncidents: ManualIncident[];
  setManualIncidents: (incidents: ManualIncident[]) => void;
}

const LiveFeed = ({ feeds, setFeeds, user, manualIncidents, setManualIncidents }: LiveFeedProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number>(0);

  const handleFileSelect = (file: File, slot: number) => {
    if (!file || file.type !== "video/mp4") {
      alert("Please select a valid MP4 file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const newFeeds = [...feeds];
    newFeeds[slot] = {
      url,
      name: CAMERA_NAMES[slot],
      fileName: file.name,
    };
    setFeeds(newFeeds);
    setSelectedIndex(slot);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file, uploadingSlot);
    e.target.value = "";
  };

  const handleRemoveFeed = (index: number) => {
    const newFeeds = [...feeds];
    newFeeds[index] = undefined as any;
    setFeeds(newFeeds.filter((_, i) => i !== index || newFeeds[i]));
    const cleanFeeds = [...feeds];
    cleanFeeds[index] = undefined as any;
    setFeeds(cleanFeeds);
    if (selectedIndex === index) setSelectedIndex(0);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slot: number) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file, slot);
  };

  const activeFeed = feeds[selectedIndex];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Feed</h1>
        <p className="text-sm text-muted-foreground">
          Upload up to 4 camera feeds and monitor simultaneously
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4"
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main video player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glow-card overflow-hidden">
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              {activeFeed ? (
                <video
                  key={activeFeed.url}
                  src={activeFeed.url}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-muted-foreground/10 flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground">No feed selected</p>
                  <p className="text-xs text-muted-foreground/60">
                    Upload a clip to one of the camera slots
                  </p>
                </div>
              )}
              {activeFeed && (
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-[10px] font-mono text-primary">
                  TRAFFICIQ V2 • {activeFeed.name}
                </div>
              )}
            </div>
          </div>

          {/* 4 camera thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {CAMERA_NAMES.map((name, i) => {
              const feed = feeds[i];
              return (
                <div
                  key={i}
                  className={`glow-card relative overflow-hidden cursor-pointer transition-all ${
                    selectedIndex === i ? "border-primary/60 bg-primary/5" : ""
                  }`}
                  onClick={() => feed && setSelectedIndex(i)}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                  onDragLeave={() => setDragOver(null)}
                >
                  <div className={`aspect-video flex flex-col items-center justify-center gap-1 relative ${
                    dragOver === i ? "bg-primary/10" : ""
                  }`}>
                    {feed ? (
                      <>
                        <video
                          src={feed.url}
                          muted
                          autoPlay
                          loop
                          className="w-full h-full object-cover absolute inset-0"
                        />
                        <div className="absolute inset-0 bg-background/30" />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveFeed(i); }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center z-10"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="absolute bottom-1 left-1 right-1 z-10">
                          <p className="text-[8px] text-white font-medium truncate px-1">{name}</p>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[8px] text-primary">Live</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-muted-foreground/40" />
                        <span className="text-[9px] text-muted-foreground text-center px-1 leading-tight">
                          {name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadingSlot(i);
                            fileInputRef.current?.click();
                          }}
                          className="text-[8px] text-primary underline"
                        >
                          Upload
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload panel */}
        <div className="space-y-4">
          <div className="glow-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Camera Feed Manager
            </h2>
            <p className="text-xs text-muted-foreground">
              Upload MP4 clips to each camera slot. Click a slot thumbnail to make it the main feed.
            </p>

            {CAMERA_NAMES.map((name, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{name}</span>
                  {feeds[i] && (
                    <button
                      onClick={() => handleRemoveFeed(i)}
                      className="text-[10px] text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {feeds[i] ? (
                  <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded px-2 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] text-primary truncate">{feeds[i].fileName}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setUploadingSlot(i);
                      fileInputRef.current?.click();
                    }}
                    className="w-full border border-dashed border-border rounded px-3 py-2 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors text-left"
                  >
                    + Click to upload MP4
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active feeds summary */}
          <div className="glow-card p-4 space-y-2">
            <h3 className="text-xs font-semibold text-foreground">Feed Status</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Active Feeds</span>
              <span className="text-xs font-mono text-primary">
                {feeds.filter(Boolean).length} / 4
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(feeds.filter(Boolean).length / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Manual Incident Triggers */}
          <div className="glow-card p-5 space-y-4 border-red-500/20">
            <h2 className="text-sm font-semibold text-foreground">
              Manual Incident Triggers
            </h2>
            <p className="text-xs text-muted-foreground">
              Tap to simulate live CV detections
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Queue Jump Button */}
              <div className="relative">
                <Button
                  onClick={() => {
                    const newIncident = {
                      id: Date.now().toString(),
                      camera: "Airport Road Feed",
                      incident_type: "Queue Jump",
                      plate_text: "EDO-GWA-234",
                      notes: "Vehicle jumped traffic queue at main intersection",
                      created_at: new Date().toISOString(),
                      status: "Open"
                    };
                    setManualIncidents(prev => [...prev, newIncident]);
                    setTimeout(() => {
                      const btn = document.getElementById('queue-jump-btn');
                      if (btn) {
                        const originalText = btn.textContent;
                        btn.textContent = "Triggered!";
                        setTimeout(() => {
                          btn.textContent = originalText;
                        }, 2000);
                      }
                    }, 0);
                  }}
                  className="w-full bg-amber-500 text-foreground hover:bg-amber-600 transition-colors"
                  id="queue-jump-btn"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Queue Jump
                </Button>
              </div>

              {/* Watchlist Plate Button */}
              <div className="relative">
                <Button
                  onClick={() => {
                    const newIncident = {
                      id: Date.now().toString(),
                      camera: "Ring Road Checkpoint",
                      incident_type: "Watchlist Match",
                      plate_text: "EYGINBG",
                      notes: "Flagged plate detected passing Ring Road Checkpoint",
                      created_at: new Date().toISOString(),
                      status: "Open"
                    };
                    setManualIncidents(prev => [...prev, newIncident]);
                    setTimeout(() => {
                      const btn = document.getElementById('watchlist-plate-btn');
                      if (btn) {
                        const originalText = btn.textContent;
                        btn.textContent = "Triggered!";
                        setTimeout(() => {
                          btn.textContent = originalText;
                        }, 2000);
                      }
                    }, 0);
                  }}
                  className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  id="watchlist-plate-btn"
                >
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Watchlist Plate
                </Button>
              </div>

              {/* Stalled Vehicle Button */}
              <div className="relative">
                <Button
                  onClick={() => {
                    const newIncident = {
                      id: Date.now().toString(),
                      camera: "Sapele Road Feed",
                      incident_type: "Stall",
                      plate_text: "EDO-KJA-567",
                      notes: "Vehicle stalled blocking outer lane for 12 seconds",
                      created_at: new Date().toISOString(),
                      status: "Open"
                    };
                    setManualIncidents(prev => [...prev, newIncident]);
                    setTimeout(() => {
                      const btn = document.getElementById('stalled-vehicle-btn');
                      if (btn) {
                        const originalText = btn.textContent;
                        btn.textContent = "Triggered!";
                        setTimeout(() => {
                          btn.textContent = originalText;
                        }, 2000);
                      }
                    }, 0);
                  }}
                  className="w-full bg-orange-500 text-foreground hover:bg-orange-600 transition-colors"
                  id="stalled-vehicle-btn"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Stalled Vehicle
                </Button>
              </div>

              {/* Wrong Way Button */}
              <div className="relative">
                <Button
                  onClick={() => {
                    const newIncident = {
                      id: Date.now().toString(),
                      camera: "Aduwawa Corridor",
                      incident_type: "Wrong Way",
                      plate_text: "EDO-BCA-891",
                      notes: "Vehicle detected moving against traffic flow",
                      created_at: new Date().toISOString(),
                      status: "Open"
                    };
                    setManualIncidents(prev => [...prev, newIncident]);
                    setTimeout(() => {
                      const btn = document.getElementById('wrong-way-btn');
                      if (btn) {
                        const originalText = btn.textContent;
                        btn.textContent = "Triggered!";
                        setTimeout(() => {
                          btn.textContent = originalText;
                        }, 2000);
                      }
                    }, 0);
                  }}
                  className="w-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                  id="wrong-way-btn"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Wrong Way
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;