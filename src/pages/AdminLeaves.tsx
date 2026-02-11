import { leavesApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function AdminLeaves() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: leaves, isLoading } = useQuery({
    queryKey: ["admin-leaves"],
    queryFn: () => leavesApi.adminGetAll(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      leavesApi.adminUpdateStatus(id, status),
    onSuccess: () => {
      toast({ title: "Leave updated!" });
      qc.invalidateQueries({ queryKey: ["admin-leaves"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: unknown) => toast({ title: "Error", description: (e as Error).message, variant: "destructive" }),
  });

  return (
    <div className="space-y-8 animate-in-fade">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Leave Requests</h1>
        <p className="text-muted-foreground mt-1">Approve or reject employee leave requests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !leaves?.length ? (
            <p className="text-sm text-muted-foreground">No leave requests found.</p>
          ) : (
            <div className="space-y-3">
              {leaves.map((leave: { id: string; user_id: string; status: string; leave_type: string; start_date: string; end_date: string; total_days: number; reason?: string; profiles: { full_name: string; email: string } }) => (
                <div
                  key={leave.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40 gap-3 transition-colors hover:bg-muted/60"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{leave.profiles.full_name}</span>
                      <Badge variant="outline" className={statusColors[leave.status]}>{leave.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="capitalize">{leave.leave_type}</span> · {format(new Date(leave.start_date), "MMM d")} - {format(new Date(leave.end_date), "MMM d, yyyy")} · {leave.total_days}d
                    </p>
                    {leave.reason && <p className="text-xs text-muted-foreground truncate">&quot;{leave.reason}&quot;</p>}
                    <p className="text-xs text-muted-foreground">{leave.profiles.email}</p>
                  </div>
                  {leave.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => updateMutation.mutate({ id: leave.id, status: "approved" })}
                        disabled={updateMutation.isPending}
                        className="rounded-xl"
                      >
                        <Check className="h-4 w-4 mr-1" />Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateMutation.mutate({ id: leave.id, status: "rejected" })}
                        disabled={updateMutation.isPending}
                        className="rounded-xl"
                      >
                        <X className="h-4 w-4 mr-1" />Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
