import { useState } from "react";
import { attendanceApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, Search, Users, UserMinus, UserCheck } from "lucide-react";

const ABSENT_REASONS = [
  "Not in the environment",
  "Marked accidentally present",
  "Other",
] as const;

type AttendanceRecord = {
  id: string;
  profiles: { full_name: string; email: string };
  status: "present" | "absent";
  reason?: string | null;
};

export default function AdminAttendance() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [filterDate, setFilterDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filterName, setFilterName] = useState("");
  const [absentDialog, setAbsentDialog] = useState<{ id: string; name: string } | null>(null);
  const [absentReason, setAbsentReason] = useState<string>("");
  const [absentOtherText, setAbsentOtherText] = useState("");
  const [presentConfirm, setPresentConfirm] = useState<{ id: string; name: string } | null>(null);

  const { data: records, isLoading } = useQuery({
    queryKey: ["admin-attendance", filterDate, filterName],
    queryFn: () => attendanceApi.adminGetAll({ date: filterDate, name: filterName || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: "present" | "absent"; reason?: string }) =>
      attendanceApi.adminUpdate(id, status, reason),
    onSuccess: (_, { status }) => {
      toast({ title: status === "absent" ? "Marked absent" : "Marked present" });
      qc.invalidateQueries({ queryKey: ["admin-attendance", filterDate, filterName] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      setAbsentDialog(null);
      setPresentConfirm(null);
      setAbsentReason("");
      setAbsentOtherText("");
    },
    onError: (e: unknown) =>
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" }),
  });

  const handleMarkAbsent = () => {
    if (!absentDialog) return;
    const reason = absentReason === "Other" ? absentOtherText.trim() : absentReason;
    if (!reason) {
      toast({ title: "Please select or enter a reason", variant: "destructive" });
      return;
    }
    updateMutation.mutate({ id: absentDialog.id, status: "absent", reason });
  };

  const handleMarkPresent = () => {
    if (!presentConfirm) return;
    updateMutation.mutate({ id: presentConfirm.id, status: "present" });
  };

  const filtered = (records ?? []) as AttendanceRecord[];
  const presentCount = filtered.filter((a) => a.status === "present").length;
  const absentCount = filtered.filter((a) => a.status === "absent").length;

  return (
    <div className="space-y-8 animate-in-fade">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Attendance Records</h1>
        <p className="text-muted-foreground mt-1">View and filter attendance data by date and employee.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Date</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="filter-date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Select Date
                </Label>
                <Input
                  id="filter-date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="filter-name" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search by Employee Name
                </Label>
                <Input
                  id="filter-name"
                  placeholder="Search by name or email..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            Attendance for {format(new Date(filterDate), "EEEE, MMMM d, yyyy")}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
            {filtered.length > 0 && (
              <span className="text-emerald-600">({presentCount} present, {absentCount} absent)</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading attendance...</p>
          ) : !filtered.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No attendance records found</p>
              <p className="text-sm mt-1">
                {filterName ? "Try a different search or date." : `No one has marked attendance for ${format(new Date(filterDate), "MMM d, yyyy")}.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((att) => (
                <div
                  key={att.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/40 border border-border/40 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{att.profiles.full_name}</p>
                    <p className="text-xs text-muted-foreground">{att.profiles.email}</p>
                    {att.status === "absent" && att.reason && (
                      <p className="text-xs text-muted-foreground mt-1 italic">Reason: {att.reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={att.status === "present" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}
                    >
                      {att.status}
                    </Badge>
                    {att.status === "present" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => {
                          setAbsentReason("");
                          setAbsentOtherText("");
                          setAbsentDialog({ id: att.id, name: att.profiles.full_name });
                        }}
                        disabled={updateMutation.isPending}
                      >
                        <UserMinus className="h-4 w-4 mr-1" /> Mark Absent
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setPresentConfirm({ id: att.id, name: att.profiles.full_name })}
                        disabled={updateMutation.isPending}
                      >
                        <UserCheck className="h-4 w-4 mr-1" /> Mark Present
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!absentDialog} onOpenChange={(o) => !o && setAbsentDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Absent</DialogTitle>
            <DialogDescription>
              {absentDialog && `Mark ${absentDialog.name} as absent. Select a reason (required).`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select value={absentReason} onValueChange={setAbsentReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {ABSENT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {absentReason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="reason-other">Custom reason</Label>
                <Input
                  id="reason-other"
                  placeholder="Enter reason..."
                  value={absentOtherText}
                  onChange={(e) => setAbsentOtherText(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAbsentDialog(null)}>Cancel</Button>
            <Button onClick={handleMarkAbsent} disabled={updateMutation.isPending || !absentReason || (absentReason === "Other" && !absentOtherText.trim())}>
              Mark Absent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!presentConfirm} onOpenChange={(o) => !o && setPresentConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Present</AlertDialogTitle>
            <AlertDialogDescription>
              {presentConfirm && `Are you sure you want to mark ${presentConfirm.name} as present?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMarkPresent} disabled={updateMutation.isPending}>
              Mark Present
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
