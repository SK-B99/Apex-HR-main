// components/team-calendar/leave-calendar.tsx

"use client";

import { useState } from "react";
import { ResponsiveSelect } from "../ui/select";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";

// ─── Static demo data (replace with API data when backend is ready) ───────────

const teamMembers = [
  {
    name: "Kwame Asante",
    role: "Frontend Developer",
    avatar: "KA",
    department: "Software Engineering",
  },
  {
    name: "Yaw Darko",
    role: "SAP Consultant",
    avatar: "YD",
    department: "SAP",
  },
  {
    name: "Akosua Frimpong",
    role: "Project Manager",
    avatar: "AF",
    department: "Project Management",
  },
  {
    name: "Adwoa Sarpong",
    role: "Content Creator",
    avatar: "AS",
    department: "Educational Content Creation",
  },
  {
    name: "Kojo Amponsah",
    role: "HR Specialist",
    avatar: "KA",
    department: "Human Resource",
  },
];

const absences: Record<string, { start: number; end: number; type: string }[]> =
  {
    "Kwame Asante": [{ start: 3, end: 7, type: "Annual" }],
    "Yaw Darko": [{ start: 17, end: 21, type: "Annual" }],
    "Akosua Frimpong": [{ start: 10, end: 14, type: "Annual" }],
    "Adwoa Sarpong": [{ start: 19, end: 19, type: "Sick" }],
    "Kojo Amponsah": [{ start: 25, end: 25, type: "Personal" }],
  };

// ─── Colour map per leave type ────────────────────────────────────────────────
const typeColors: Record<string, string> = {
  Annual: "bg-chart-1/70",
  Sick: "bg-chart-5/70",
  Personal: "bg-chart-3/70",
};

// ─── Calendar config ──────────────────────────────────────────────────────────
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Days in each month for 2026 (non-leap year)
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function LeaveCalendar() {
  // ✅ Track month index (0 = Jan … 11 = Dec) and year for navigation
  const [monthIndex, setMonthIndex] = useState(4); // default: May
  const [year, setYear] = useState(2026);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const daysInMonth = DAYS_IN_MONTH[monthIndex];
  const currentMonthLabel = `${MONTHS[monthIndex]} ${year}`;

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const handlePrev = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  // ─── Department filter ───────────────────────────────────────────────────────
  const departmentOptions = [
    { label: "All Departments", value: "all" },
    ...[...new Set(teamMembers.map((m) => m.department))].map((d) => ({
      label: d,
      value: d.toLowerCase(),
    })),
  ];

  const filteredMembers =
    selectedDepartment === "all"
      ? teamMembers
      : teamMembers.filter(
          (m) => m.department.toLowerCase() === selectedDepartment,
        );

  // ─── Conflict detection (>20% of dept absent on same day) ───────────────────
  const conflictDays = new Set<number>();
  for (let day = 1; day <= daysInMonth; day++) {
    const depts = [...new Set(teamMembers.map((m) => m.department))];
    for (const dept of depts) {
      const deptMembers = teamMembers.filter((m) => m.department === dept);
      const absent = deptMembers.filter((m) =>
        absences[m.name]?.some((a) => day >= a.start && day <= a.end),
      ).length;
      if (deptMembers.length > 0 && absent / deptMembers.length > 0.2) {
        conflictDays.add(day);
      }
    }
  }

  // ─── Day numbers array ───────────────────────────────────────────────────────
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ─── Helper: get leave type for a member on a specific day ──────────────────
  function getLeaveType(memberName: string, day: number): string | null {
    const leaves = absences[memberName] ?? [];
    const leave = leaves.find((a) => day >= a.start && day <= a.end);
    return leave?.type ?? null;
  }

  return (
    <main>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            Team Calendar
          </h2>
          <p className="text-muted-foreground text-sm">
            Visualize team availability and upcoming leave
          </p>
        </div>
        {/* ✅ Responsive: full width on mobile, fixed on sm+ */}
        <div className="w-full sm:w-48">
          <ResponsiveSelect
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={departmentOptions}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="bg-chart-1/70 size-3 rounded-full" />
          <span className="text-muted-foreground text-xs">Annual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="bg-chart-5/70 size-3 rounded-full" />
          <span className="text-muted-foreground text-xs">Sick</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="bg-chart-3/70 size-3 rounded-full" />
          <span className="text-muted-foreground text-xs">Personal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="border-destructive/50 bg-destructive/10 size-3 rounded-sm border-2" />
          <span className="text-muted-foreground text-xs">Conflict</span>
        </div>
      </div>

      <Card>
        {/* Calendar nav */}
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrev}>
                <ChevronLeftIcon className="size-4" />
              </Button>
              <p className="text-foreground min-w-32 text-center text-sm font-medium">
                {currentMonthLabel}
              </p>
              <Button variant="outline" size="sm" onClick={handleNext}>
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              <AlertTriangle className="mr-1 size-3.5" />
              {conflictDays.size} conflict day
              {conflictDays.size !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {/* ✅ Horizontally scrollable on mobile so the calendar doesn't squash */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-xs">
              <thead>
                <tr>
                  {/* Name column header */}
                  <th className="text-muted-foreground w-36 py-2 pr-3 text-left font-medium">
                    Team Member
                  </th>
                  {/* Day number headers */}
                  {dayNumbers.map((day) => (
                    <th
                      key={day}
                      className={`w-6 py-2 text-center font-medium ${
                        conflictDays.has(day)
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.name} className="border-t">
                    {/* Member name + avatar */}
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-foreground truncate font-medium">
                            {member.name.split(" ")[0]}{" "}
                            {/* first name only to save space */}
                          </p>
                          <p className="text-muted-foreground truncate text-[10px]">
                            {member.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Day cells */}
                    {dayNumbers.map((day) => {
                      const leaveType = getLeaveType(member.name, day);
                      const isConflict = conflictDays.has(day);

                      return (
                        <td
                          key={day}
                          className={`h-8 text-center align-middle ${
                            isConflict ? "bg-destructive/5" : ""
                          }`}
                        >
                          {leaveType ? (
                            // ✅ Coloured dot for leave days
                            <div
                              className={`mx-auto size-4 rounded-sm ${typeColors[leaveType] ?? "bg-muted"}`}
                              title={leaveType}
                            />
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No team members in this department.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
