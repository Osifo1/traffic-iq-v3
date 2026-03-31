import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LiveFeed from "@/pages/LiveFeed";
import PlateLog from "@/pages/PlateLog";
import Analytics from "@/pages/Analytics";
import SettingsPage from "@/pages/Settings";
import Incidents from "@/pages/Incidents";
import Offenders from "@/pages/Offenders";
import Reports from "@/pages/Reports";
import MobileAlerts from "@/pages/MobileAlerts";
import NotFound from "@/pages/NotFound";

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

const queryClient = new QueryClient();

const App = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [manualIncidents, setManualIncidents] = useState<ManualIncident[]>([]);

  const handleLogin = (role: "traffic_officer" | "agency_director" | "toll_operator", name: string) => {
    setUser({ role, name });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Login onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
              <Route path="/" element={<Dashboard feeds={feeds} user={user} manualIncidents={manualIncidents} />} />
              <Route
                path="/live-feed"
                element={<LiveFeed feeds={feeds} setFeeds={setFeeds} user={user} manualIncidents={manualIncidents} setManualIncidents={setManualIncidents} />}
              />
              <Route path="/plate-log" element={<PlateLog user={user} />} />
              <Route path="/analytics" element={<Analytics user={user} />} />
              <Route path="/incidents" element={<Incidents user={user} manualIncidents={manualIncidents} />} />
              <Route path="/offenders" element={<Offenders user={user} />} />
              <Route path="/reports" element={<Reports user={user} />} />
              <Route path="/mobile-alerts" element={<MobileAlerts user={user} />} />
              <Route path="/settings" element={<SettingsPage user={user} />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;