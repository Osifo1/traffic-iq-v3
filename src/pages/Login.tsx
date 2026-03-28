import { useState } from "react";
import { Shield, UserCheck, CreditCard } from "lucide-react";

interface LoginProps {
  onLogin: (role: "traffic_officer" | "agency_director" | "toll_operator", name: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const roles = [
    {
      id: "traffic_officer",
      title: "Traffic Officer",
      icon: Shield,
      description: "Monitor and manage traffic incidents",
      demoCredentials: { username: "officer", password: "officer123" },
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600"
    },
    {
      id: "agency_director",
      title: "Agency Director",
      icon: UserCheck,
      description: "Full system access and reporting",
      demoCredentials: { username: "director", password: "director123" },
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600"
    },
    {
      id: "toll_operator",
      title: "Toll Operator",
      icon: CreditCard,
      description: "Manage toll operations and plate logs",
      demoCredentials: { username: "toll", password: "toll123" },
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    }
  ];

  const handleRoleSelect = (role: typeof roles[0]) => {
    setSelectedRole(role.id);
    setCredentials(role.demoCredentials);
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    const role = roles.find(r => r.id === selectedRole);
    if (!role) {
      setError("Invalid role selected");
      return;
    }

    if (credentials.username === role.demoCredentials.username && 
        credentials.password === role.demoCredentials.password) {
      onLogin(selectedRole as "traffic_officer" | "agency_director" | "toll_operator", 
               role.title);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-grid-pattern">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                TRAFFIC<span className="text-primary">IQ</span>
              </h1>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                V3.0 - Edo State
              </p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Edo State Traffic Management Authority
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Select Your Role</h2>
          <div className="space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                    selectedRole === role.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${role.color} ${role.hoverColor} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{role.title}</h3>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        {selectedRole && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Login</h3>
            
            {/* Demo Credentials Display */}
            <div className="bg-secondary/50 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
              <p className="text-sm text-foreground">
                Username: <span className="font-mono bg-background px-2 py-1 rounded">{credentials.username}</span>
              </p>
              <p className="text-sm text-foreground">
                Password: <span className="font-mono bg-background px-2 py-1 rounded">{credentials.password}</span>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
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
      </div>
    </div>
  );
};

export default Login;
