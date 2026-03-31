import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Clock, Camera, Car } from "lucide-react";

interface User {
  role: "traffic_officer" | "agency_director" | "toll_operator";
  name: string;
}

interface MobileAlertsProps {
  user: User;
}

interface Incident {
  id: string;
  type: string;
  camera: string;
  plate: string;
  timestamp: string;
  status: string;
  description?: string;
}

const MobileAlerts = ({ user }: MobileAlertsProps) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockIncidents: Incident[] = [
      {
        id: "1",
        type: "Watchlist Match",
        camera: "Ring Road Checkpoint",
        plate: "ABC123",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: "Open",
        description: "Vehicle matches stolen vehicle database"
      },
      {
        id: "2",
        type: "Speeding",
        camera: "Benin City Center",
        plate: "XYZ789",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: "Open",
        description: "Vehicle traveling 85 km/h in 50 km/h zone"
      },
      {
        id: "3",
        type: "Wrong Lane",
        camera: "Airport Road",
        plate: "DEF456",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: "Open",
        description: "Vehicle detected in restricted lane"
      },
      {
        id: "4",
        type: "Watchlist Match",
        camera: "Stadium Road",
        plate: "GHI012",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: "Open",
        description: "Vehicle associated with traffic violations"
      },
      {
        id: "5",
        type: "Speeding",
        camera: "Ring Road Checkpoint",
        plate: "JKL345",
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        status: "Open",
        description: "Vehicle traveling 75 km/h in 60 km/h zone"
      }
    ];

    setIncidents(mockIncidents);
  }, []);

  const handleAcknowledge = async (incidentId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId 
            ? { ...incident, status: "Acknowledged" }
            : incident
        )
      );
      setLoading(false);
    }, 1000);
  };

  const handleResolve = async (incidentId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId 
            ? { ...incident, status: "Resolved" }
            : incident
        )
      );
      setLoading(false);
    }, 1000);
  };

  const getActiveAlertsCount = () => {
    return incidents.filter(incident => 
      incident.status === "Open" && 
      (incident.type === "Watchlist Match" || incident.type === "Speeding")
    ).length;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const incidentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - incidentTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "Watchlist Match":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "Speeding":
        return <Car className="h-6 w-6 text-amber-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-blue-500" />;
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case "Watchlist Match":
        return "border-red-500 bg-red-50 dark:bg-red-950/20";
      case "Speeding":
        return "border-amber-500 bg-amber-50 dark:bg-amber-950/20";
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-950/20";
    }
  };

  const activeAlertsCount = getActiveAlertsCount();

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header with Alert Banner */}
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Mobile Alerts</h1>
          <p className="text-sm text-foreground">
            Active traffic incidents requiring attention
          </p>
        </div>

        {/* Active Alerts Banner */}
        <Card className={`${activeAlertsCount > 0 ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-green-500 bg-green-50 dark:bg-green-950/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeAlertsCount > 0 ? (
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
                <div>
                  <h3 className="font-semibold text-red-900">
                    {activeAlertsCount > 0 ? `${activeAlertsCount} Active Alerts` : "All Clear"}
                  </h3>
                  <p className="text-sm text-gray-900">
                    {activeAlertsCount > 0 
                      ? "Requires immediate attention" 
                      : "No active alerts at this time"}
                  </p>
                </div>
              </div>
              <Badge variant={activeAlertsCount > 0 ? "destructive" : "default"}>
                {activeAlertsCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incident Cards */}
      <div className="space-y-4">
        {incidents
          .filter(incident => incident.status === "Open" || incident.status === "Acknowledged")
          .map((incident) => (
            <Card 
              key={incident.id} 
              className={`${getIncidentColor(incident.type)} border-2 transition-all duration-200 hover:shadow-lg`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getIncidentIcon(incident.type)}
                    <div>
                      <CardTitle className="text-lg text-red-900">{incident.type}</CardTitle>
                      <CardDescription className="text-sm text-gray-800">
                        {incident.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={incident.status === "Open" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {incident.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Incident Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-gray-700" />
                    <span className="text-gray-900">Camera:</span>
                    <span className="font-medium text-gray-800">{incident.camera}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-700" />
                    <span className="text-gray-900">Plate:</span>
                    <span className="font-mono font-medium text-gray-800">{incident.plate}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 col-span-2">
                    <Clock className="h-4 w-4 text-gray-700" />
                    <span className="text-gray-900">Time:</span>
                    <span className="font-medium text-gray-800">{formatTimeAgo(incident.timestamp)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {incident.status === "Open" && (
                    <Button
                      onClick={() => handleAcknowledge(incident.id)}
                      disabled={loading}
                      variant="outline"
                      className="flex-1 h-12 text-base"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Acknowledge
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => handleResolve(incident.id)}
                    disabled={loading}
                    className="flex-1 h-12 text-base"
                    variant={incident.status === "Open" ? "default" : "secondary"}
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    {incident.status === "Open" ? "Resolve" : "Mark Resolved"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Empty State */}
      {incidents.filter(incident => incident.status === "Open" || incident.status === "Acknowledged").length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear</h3>
            <p className="text-sm text-gray-800">
              No active incidents requiring attention at this time.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      <div className="text-center text-sm text-foreground pt-4">
        <p>Showing Open and Watchlist Match incidents</p>
        <p className="text-xs mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default MobileAlerts;
