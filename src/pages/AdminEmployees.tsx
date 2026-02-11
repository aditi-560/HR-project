import { usersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Employee {
  id: string;
  full_name: string;
  email: string;
  date_of_joining: string;
  user_roles?: { role: string }[];
  leave_balances?: { total_balance: number; used_balance: number }[];
}

export default function AdminEmployees() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["admin-employees"],
    queryFn: () => usersApi.adminGetAll() as Promise<Employee[]>,
  });

  return (
    <div className="space-y-8 animate-in-fade">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Employees</h1>
        <p className="text-muted-foreground mt-1">View all employee records.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !employees?.length ? (
            <p className="text-sm text-muted-foreground">No employees found.</p>
          ) : (
            <div className="space-y-3">
              {employees.map((emp) => {
                const role = emp.user_roles?.[0]?.role ?? "employee";
                const balance = emp.leave_balances?.[0];
                const remaining = (balance?.total_balance ?? 20) - (balance?.used_balance ?? 0);
                return (
                  <div
                    key={emp.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40 gap-2 transition-colors hover:bg-muted/60"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{emp.full_name}</span>
                        <Badge variant="outline" className={role === "admin" ? "bg-foreground/10 text-foreground border-foreground/20" : "bg-secondary text-secondary-foreground"}>
                          {role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                      <p className="text-xs text-muted-foreground">Joined: {format(new Date(emp.date_of_joining), "MMM d, yyyy")}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Leave: <span className="font-medium text-foreground">{remaining}</span> / {balance?.total_balance ?? 20} remaining
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
