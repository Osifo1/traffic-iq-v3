import { Outlet } from "react-router-dom";
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
  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <AppSidebar user={user} onLogout={onLogout} />
      <main className="ml-64 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
