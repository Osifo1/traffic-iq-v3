import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  FileText,
  BarChart3,
  Settings,
  TrafficCone,
  AlertTriangle,
  UserX,
  FileDown,
  Smartphone,
  LogOut,
  User
} from "lucide-react";

interface User {
  role: "traffic_officer" | "agency_director" | "toll_operator";
  name: string;
}

interface AppSidebarProps {
  user: User;
  onLogout: () => void;
}

const AppSidebar = ({ user, onLogout }: AppSidebarProps) => {
  const location = useLocation();

  const getNavItems = () => {
    const baseItems = [
      { title: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["traffic_officer", "agency_director", "toll_operator"] },
    ];

    const roleSpecificItems = [
      { title: "Live Feed", path: "/live-feed", icon: Video, roles: ["traffic_officer", "agency_director", "toll_operator"] },
      { title: "Incidents", path: "/incidents", icon: AlertTriangle, roles: ["traffic_officer", "agency_director"] },
      { title: "Offenders", path: "/offenders", icon: UserX, roles: ["traffic_officer", "agency_director"] },
      { title: "Plate Log", path: "/plate-log", icon: FileText, roles: ["traffic_officer", "agency_director", "toll_operator"] },
      { title: "Analytics", path: "/analytics", icon: BarChart3, roles: ["traffic_officer", "agency_director"] },
      { title: "Reports", path: "/reports", icon: FileDown, roles: ["agency_director"] },
      { title: "Mobile Alerts", path: "/mobile-alerts", icon: Smartphone, roles: ["traffic_officer"] },
      { title: "Settings", path: "/settings", icon: Settings, roles: ["traffic_officer", "agency_director", "toll_operator"] },
    ];

    return [...baseItems, ...roleSpecificItems].filter(item => item.roles.includes(user.role));
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrafficCone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              TRAFFIC<span className="text-primary">IQ</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              V3.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {/* User Info */}
        <div className="bg-sidebar-accent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-sidebar-foreground" />
            <span className="text-xs font-semibold text-foreground">
              {user.name}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground capitalize">
            {user.role.replace('_', ' ')}
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        {/* Footer branding */}
        <div className="bg-sidebar-accent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary">ED</span>
            </div>
            <span className="text-xs font-semibold text-foreground">
              Edo State
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Edo State Traffic Management Authority (EDSTMA), Benin City
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;