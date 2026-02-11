import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CalendarDays, LogOut, User, LayoutDashboard, ClipboardList, CalendarCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = {
  employee: [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/leave", icon: ClipboardList, label: "Leave" },
    { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
  ],
  admin: [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/leaves", icon: ClipboardList, label: "Leave Requests" },
    { to: "/admin/attendance", icon: CalendarCheck, label: "Attendance" },
    { to: "/admin/employees", icon: User, label: "Employees" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const items = role === "admin" ? navItems.admin : navItems.employee;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Urban-style header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-foreground" />
              <span className="font-semibold text-lg tracking-tight">HR Harmony</span>
            </div>
            {role === "admin" && (
              <span className="text-xs font-medium bg-foreground/10 text-foreground px-2.5 py-1 rounded-full">
                Admin
              </span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-foreground bg-foreground/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.full_name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex border-t border-border/50 overflow-x-auto scrollbar-hide">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors min-w-0",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
