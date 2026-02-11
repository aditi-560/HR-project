import { useAuth } from "@/hooks/useAuth";
import { leaveBalanceApi, leavesApi, attendanceApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle, Clock, TrendingDown, XCircle } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const { data: balance } = useQuery({
    queryKey: ["leave-balance", user?.id],
    queryFn: () => leaveBalanceApi.getMy(),
    enabled: !!user,
  });

  const { data: recentLeaves } = useQuery({
    queryKey: ["recent-leaves", user?.id],
    queryFn: async () => {
      const leaves = await leavesApi.getMy();
      return leaves.slice(0, 5);
    },
    enabled: !!user,
  });

  const { data: recentAttendance } = useQuery({
    queryKey: ["recent-attendance", user?.id],
    queryFn: () => attendanceApi.getMy(7),
    enabled: !!user,
  });

  const remaining = (balance?.total_balance ?? 20) - (balance?.used_balance ?? 0);

  const statCards = [
    { title: "Total Leave", value: balance?.total_balance ?? 20, icon: CalendarDays, className: "bg-foreground/5" },
    { title: "Used", value: balance?.used_balance ?? 0, icon: TrendingDown, className: "bg-red-500/5" },
    { title: "Remaining", value: remaining, icon: CheckCircle, className: "bg-emerald-500/5" },
  ];

  return (
    <div className="space-y-8 animate-in-fade">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your summary.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 animate-in-stagger">
        {statCards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${card.className}`}>
                  <card.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentLeaves?.length ? (
              <p className="text-sm text-muted-foreground">No leave requests yet.</p>
            ) : (
              <div className="space-y-3">
                {recentLeaves.map((leave) => {
                  const Icon = statusIcons[leave.status];
                  return (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${leave.status === "approved" ? "text-emerald-600" : leave.status === "rejected" ? "text-red-600" : "text-amber-600"}`} />
                        <div>
                          <p className="text-sm font-medium capitalize">{leave.leave_type} Leave</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(leave.start_date), "MMM d")} - {format(new Date(leave.end_date), "MMM d, yyyy")} · {leave.total_days}d
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColors[leave.status]}>
                        {leave.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentAttendance?.length ? (
              <p className="text-sm text-muted-foreground">No attendance records yet.</p>
            ) : (
              <div className="space-y-2">
                {recentAttendance.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40 transition-colors hover:bg-muted/60"
                  >
                    <span className="text-sm font-medium">{format(new Date(att.date), "EEE, MMM d, yyyy")}</span>
                    <Badge
                      variant="outline"
                      className={att.status === "present" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}
                    >
                      {att.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
