import { statsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarCheck, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => statsApi.adminGet(),
  });

  const cards = [
    { title: "Total Employees", value: stats?.totalEmployees ?? 0, icon: Users, className: "bg-foreground/5" },
    { title: "Pending Leaves", value: stats?.pendingLeaves ?? 0, icon: Clock, className: "bg-amber-500/5" },
    { title: "Today's Attendance", value: stats?.todayAttendance ?? 0, icon: CalendarCheck, className: "bg-emerald-500/5" },
  ];

  return (
    <div className="space-y-8 animate-in-fade">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of employee data.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 animate-in-stagger">
        {cards.map((card) => (
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
    </div>
  );
}
