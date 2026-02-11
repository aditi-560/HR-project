import { useState } from "react";
import { attendanceApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function AdminMonthlyReport() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [month, setMonth] = useState<string>(currentMonth.toString());
  const [year, setYear] = useState<string>(currentYear.toString());
  const [searchTerm, setSearchTerm] = useState("");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["admin-monthly-report", month, year, searchTerm],
    queryFn: () =>
      attendanceApi.adminGetMonthlyReport(parseInt(month), parseInt(year), searchTerm || undefined),
  });

  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return "text-emerald-600";
    if (percentage >= 75) return "text-amber-600";
    return "text-red-600";
  };

  const getPercentageBadge = (percentage: number) => {
    if (percentage >= 90) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (percentage >= 75) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-red-500/10 text-red-600 border-red-500/20";
  };

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Monthly Attendance Report</h1>
          <p className="text-muted-foreground mt-1">
            Overview of employee attendance for {MONTHS.find((m) => m.value === parseInt(month))?.label} {year}.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger id="month" className="h-11 rounded-xl">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value.toString()}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year" className="h-11 rounded-xl">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Employee
              </Label>
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Attendance Summary</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileBarChart className="h-4 w-4" />
            <span>{reportData?.totalEmployees || 0} Employees</span>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading report data...</div>
          ) : !reportData?.report.length ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileBarChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No records found for this period</p>
              <p className="text-sm mt-1">Try adjusting the filters.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-center">Total Days</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-right">Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.report.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="font-medium">{row.name}</div>
                        <div className="text-xs text-muted-foreground">{row.email}</div>
                      </TableCell>
                      <TableCell className="text-center">{row.totalDays}</TableCell>
                      <TableCell className="text-center text-emerald-600 font-medium">
                        {row.present}
                      </TableCell>
                      <TableCell className="text-center text-red-600 font-medium">
                        {row.absent}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={getPercentageBadge(row.percentage)}>
                          {row.percentage}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
