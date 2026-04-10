import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import AppSidebar from "./AppSidebar";

interface User {
  role: "traffic_officer" | "agency_director" | "toll_operator";
  name: string;
}

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
}

const AppLayout = ({ user, onLogout }: AppLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      {/* Desktop Sidebar */}
      <AppSidebar user={user} onLogout={onLogout} isMobile={false} />
      
      {/* Mobile Sidebar */}
      <AppSidebar 
        user={user} 
        onLogout={onLogout} 
        isMobile={true} 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-6 p-6">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-sidebar border border-sidebar-border rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
