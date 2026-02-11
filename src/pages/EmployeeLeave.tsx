import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { leavesApi, type Leave } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function EmployeeLeave() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [leaveType, setLeaveType] = useState<string>("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const { data: leaves, isLoading } = useQuery({
    queryKey: ["my-leaves", user?.id],
    queryFn: () => leavesApi.getMy(),
    enabled: !!user,
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const totalDays = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;
      if (totalDays < 1) throw new Error("Invalid date range");
      if (editingLeave) {
        return leavesApi.update(editingLeave.id, { leave_type: leaveType, start_date: startDate, end_date: endDate, reason: reason || undefined });
      }
      return leavesApi.create({ leave_type: leaveType, start_date: startDate, end_date: endDate, reason: reason || undefined });
    },
    onSuccess: () => {
      toast({ title: editingLeave ? "Leave updated!" : "Leave applied!" });
      qc.invalidateQueries({ queryKey: ["my-leaves"] });
      qc.invalidateQueries({ queryKey: ["leave-balance"] });
      qc.invalidateQueries({ queryKey: ["recent-leaves"] });
      resetForm();
    },
    onError: (e: unknown) => toast({ title: "Error", description: (e as Error).message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leavesApi.delete(id),
    onSuccess: () => {
      toast({ title: "Leave cancelled" });
      qc.invalidateQueries({ queryKey: ["my-leaves"] });
      qc.invalidateQueries({ queryKey: ["recent-leaves"] });
    },
    onError: (e: unknown) => toast({ title: "Error", description: (e as Error).message, variant: "destructive" }),
  });

  const resetForm = () => {
    setOpen(false);
    setEditingLeave(null);
    setLeaveType("casual");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const openEdit = (leave: Leave) => {
    setEditingLeave(leave);
    setLeaveType(leave.leave_type);
    setStartDate(leave.start_date.split("T")[0]);
    setEndDate(leave.end_date.split("T")[0]);
    setReason(leave.reason || "");
    setOpen(true);
  };

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground mt-1">Apply and track your leave requests.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-10">
              <Plus className="h-4 w-4 mr-1.5" />
              Apply Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-border/60 shadow-soft-lg max-w-md">
            <DialogHeader>
              <DialogTitle>{editingLeave ? "Edit Leave" : "Apply for Leave"}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); applyMutation.mutate(); }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="rounded-xl" />
                </div>
              </div>
              {startDate && endDate && new Date(endDate) >= new Date(startDate) && (
                <p className="text-sm text-muted-foreground">
                  Total: {differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1} day(s)
                </p>
              )}
              <div className="space-y-2">
                <Label>Reason (optional)</Label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for leave..." className="rounded-xl min-h-[80px]" />
              </div>
              <Button type="submit" className="w-full rounded-xl h-11" disabled={applyMutation.isPending}>
                {applyMutation.isPending ? "Submitting..." : editingLeave ? "Update Leave" : "Submit Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !leaves?.length ? (
            <p className="text-sm text-muted-foreground">No leave requests found.</p>
          ) : (
            <div className="space-y-3">
              {leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40 gap-3 transition-colors hover:bg-muted/60"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium capitalize text-sm">{leave.leave_type} Leave</span>
                      <Badge variant="outline" className={statusColors[leave.status]}>{leave.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(leave.start_date), "MMM d")} - {format(new Date(leave.end_date), "MMM d, yyyy")} · {leave.total_days} day(s)
                    </p>
                    {leave.reason && <p className="text-xs text-muted-foreground">&quot;{leave.reason}&quot;</p>}
                  </div>
                  {leave.status === "pending" && (
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(leave)} className="rounded-xl">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(leave.id)} className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
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
