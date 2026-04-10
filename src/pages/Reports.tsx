import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileDown, FileText } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import jsPDF from "jspdf";

interface User {
  role: "traffic_officer" | "agency_director" | "toll_operator";
  name: string;
}

interface ReportsProps {
  user: User;
}

interface Incident {
  id: string;
  type: string;
  camera: string;
  plate: string;
  timestamp: string;
  status: string;
}

interface WatchlistHit {
  id: string;
  plate: string;
  camera: string;
  timestamp: string;
}

interface Offender {
  plate: string;
  flags: number;
  cameras: string[];
}

const Reports = ({ user }: ReportsProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  });
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [watchlistHits, setWatchlistHits] = useState<WatchlistHit[]>([]);
  const [offenders, setOffenders] = useState<Offender[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockIncidents: Incident[] = [
      { id: "1", type: "Speeding", camera: "Ring Road Checkpoint", plate: "ABC123", timestamp: "2024-01-15T10:30:00Z", status: "Open" },
      { id: "2", type: "Wrong Lane", camera: "Benin City Center", plate: "XYZ789", timestamp: "2024-01-15T11:45:00Z", status: "Resolved" },
      { id: "3", type: "Watchlist Match", camera: "Airport Road", plate: "DEF456", timestamp: "2024-01-15T12:15:00Z", status: "Open" },
      { id: "4", type: "Speeding", camera: "Ring Road Checkpoint", plate: "GHI012", timestamp: "2024-01-15T13:00:00Z", status: "Resolved" },
      { id: "5", type: "Wrong Lane", camera: "Benin City Center", plate: "JKL345", timestamp: "2024-01-15T14:30:00Z", status: "Open" },
    ];

    const mockWatchlistHits: WatchlistHit[] = [
      { id: "1", plate: "DEF456", camera: "Airport Road", timestamp: "2024-01-15T12:15:00Z" },
      { id: "2", plate: "MNO678", camera: "Ring Road Checkpoint", timestamp: "2024-01-15T09:30:00Z" },
    ];

    const mockOffenders: Offender[] = [
      { plate: "ABC123", flags: 3, cameras: ["Ring Road Checkpoint", "Benin City Center"] },
      { plate: "XYZ789", flags: 2, cameras: ["Benin City Center", "Airport Road"] },
      { plate: "DEF456", flags: 5, cameras: ["Airport Road", "Ring Road Checkpoint"] },
    ];

    setIncidents(mockIncidents);
    setWatchlistHits(mockWatchlistHits);
    setOffenders(mockOffenders);
  }, []);

  const generatePDFReport = () => {
    setLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(204, 0, 0);
      doc.text("TrafficIQ V3 - Traffic Report", 20, 20);
      
      // Date range
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const dateRangeText = dateRange?.from && dateRange?.to
        ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
        : "All time";
      doc.text(`Period: ${dateRangeText}`, 20, 35);
      
      // Summary Statistics
      doc.setFontSize(14);
      doc.setTextColor(204, 0, 0);
      doc.text("Summary Statistics", 20, 50);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Vehicles Processed: ${incidents.length * 15}`, 20, 60);
      doc.text(`Total Incidents: ${incidents.length}`, 20, 70);
      doc.text(`Watchlist Hits: ${watchlistHits.length}`, 20, 80);
      doc.text(`Unique Offenders: ${offenders.length}`, 20, 90);
      
      // Incidents by Type
      doc.setFontSize(14);
      doc.setTextColor(204, 0, 0);
      doc.text("Incidents by Type", 20, 110);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const incidentsByType = incidents.reduce((acc, incident) => {
        acc[incident.type] = (acc[incident.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      let yPos = 120;
      Object.entries(incidentsByType).forEach(([type, count]) => {
        doc.text(`${type}: ${count}`, 20, yPos);
        yPos += 10;
      });
      
      // Incidents by Camera
      doc.setFontSize(14);
      doc.setTextColor(204, 0, 0);
      doc.text("Incidents by Camera", 20, yPos + 10);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      yPos += 20;
      const incidentsByCamera = incidents.reduce((acc, incident) => {
        acc[incident.camera] = (acc[incident.camera] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(incidentsByCamera).forEach(([camera, count]) => {
        doc.text(`${camera}: ${count}`, 20, yPos);
        yPos += 10;
      });
      
      // Top Repeat Offenders
      doc.setFontSize(14);
      doc.setTextColor(204, 0, 0);
      doc.text("Top Repeat Offenders", 20, yPos + 10);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      yPos += 20;
      offenders.sort((a, b) => b.flags - a.flags).slice(0, 5).forEach(offender => {
        doc.text(`${offender.plate}: ${offender.flags} flags`, 20, yPos);
        yPos += 10;
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Generated by TrafficIQ V3 - Edo State Traffic Management Authority", 20, 280);
      
      // Save the PDF
      doc.save(`traffic-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCSVReport = () => {
    setLoading(true);
    
    try {
      const headers = ["ID", "Type", "Camera", "Plate", "Timestamp", "Status"];
      const csvContent = [
        headers.join(","),
        ...incidents.map(incident => [
          incident.id,
          incident.type,
          incident.camera,
          incident.plate,
          incident.timestamp,
          incident.status
        ].join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `traffic-incidents-${format(new Date(), "yyyy-MM-dd")}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyStats = () => {
    const totalIncidents = incidents.length;
    const openIncidents = incidents.filter(i => i.status === "Open").length;
    const watchlistMatches = incidents.filter(i => i.type === "Watchlist Match").length;
    const uniqueCameras = [...new Set(incidents.map(i => i.camera))].length;
    
    return {
      totalIncidents,
      openIncidents,
      watchlistMatches,
      uniqueCameras,
      totalVehicles: totalIncidents * 15, // Estimated
      resolutionRate: totalIncidents > 0 ? ((totalIncidents - openIncidents) / totalIncidents * 100).toFixed(1) : "0"
    };
  };

  const stats = getWeeklyStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive traffic management reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Weekly Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.openIncidents} still open
            </p>
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Processed</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Estimated total
            </p>
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watchlist Hits</CardTitle>
            <FileDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.watchlistMatches}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Cases resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Export traffic data in PDF or CSV format for analysis and record-keeping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">PDF Report</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive report with summary statistics, incident breakdowns, and top offenders
              </p>
              <Button 
                onClick={generatePDFReport} 
                disabled={loading}
                className="w-full"
              >
                <FileDown className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Generate PDF Report"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">CSV Export</h4>
              <p className="text-sm text-muted-foreground">
                Raw incident data in CSV format for further analysis in spreadsheet applications
              </p>
              <Button 
                onClick={generateCSVReport} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Generate CSV Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">What's Included:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Total vehicles processed through the system</li>
                <li>• Incidents broken down by type and severity</li>
                <li>• Incident distribution across camera locations</li>
                <li>• Watchlist hits and security alerts</li>
                <li>• Top repeat offenders with flag counts</li>
                <li>• Date range filtering for targeted analysis</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Report Period:</h4>
              <p className="text-sm text-muted-foreground">
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}`
                  : "All available data"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
