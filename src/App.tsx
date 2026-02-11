import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import Auth from "@/pages/Auth";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import EmployeeLeave from "@/pages/EmployeeLeave";
import EmployeeAttendance from "@/pages/EmployeeAttendance";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLeaves from "@/pages/AdminLeaves";
import AdminAttendance from "@/pages/AdminAttendance";
import AdminEmployees from "@/pages/AdminEmployees";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" /></div>;
  if (role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function DashboardRouter() {
  const { role } = useAuth();
  return role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" /></div>;
  if (user) return <Navigate to="/" replace />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute><EmployeeLeave /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><EmployeeAttendance /></ProtectedRoute>} />
            <Route path="/admin/leaves" element={<ProtectedRoute><AdminRoute><AdminLeaves /></AdminRoute></ProtectedRoute>} />
            <Route path="/admin/attendance" element={<ProtectedRoute><AdminRoute><AdminAttendance /></AdminRoute></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute><AdminRoute><AdminEmployees /></AdminRoute></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
