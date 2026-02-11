import { useAuth } from "@/hooks/useAuth";
import { attendanceApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todayRecord } = useQuery({
    queryKey: ["today-attendance", user?.id, today],
    queryFn: () => attendanceApi.getMyToday(),
    enabled: !!user,
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ["attendance-history", user?.id],
    queryFn: () => attendanceApi.getMy(30),
    enabled: !!user,
  });

  const markMutation = useMutation({
    mutationFn: (status: "present" | "absent") => attendanceApi.mark(today, status),
    onSuccess: () => {
      toast({ title: "Attendance marked!" });
      qc.invalidateQueries({ queryKey: ["today-attendance"] });
      qc.invalidateQueries({ queryKey: ["attendance-history"] });
      qc.invalidateQueries({ queryKey: ["recent-attendance"] });
    },
    onError: (e: unknown) => toast({ title: "Error", description: (e as Error).message, variant: "destructive" }),
  });

  return (
    <div className="space-y-8 animate-in-fade">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground mt-1">Mark your daily attendance and view history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today — {format(new Date(), "EEEE, MMMM d, yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          {todayRecord ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/40">
              {todayRecord.status === "present" ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium capitalize">Marked as {todayRecord.status}</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={() => markMutation.mutate("present")}
                disabled={markMutation.isPending}
                className="rounded-xl h-11"
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Present
              </Button>
              <Button
                variant="outline"
                onClick={() => markMutation.mutate("absent")}
                disabled={markMutation.isPending}
                className="rounded-xl h-11"
              >
                <XCircle className="h-4 w-4 mr-1.5" />
                Absent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !history?.length ? (
            <p className="text-sm text-muted-foreground">No records yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((att) => (
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
  );
}
