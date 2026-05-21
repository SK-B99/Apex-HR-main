import { CheckCircle2, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const pendingRequests = [
  {
    id: 1,
    name: "Rose",
    role: "Educational Content Creator",
    dates: "Apr 3 - Apr 7",
    days: 5,
    type: "Annual",
    avatar: "AC",
  },
  {
    id: 2,
    name: "Sammy",
    role: "Project Manager",
    dates: "Apr 10 - Apr 11",
    days: 2,
    type: "Sick",
    avatar: "MP",
  },
  {
    id: 3,
    name: "Nadine",
    role: "Backend Engineer",
    dates: "Apr 14",
    days: 1,
    type: "Personal",
    avatar: "JW",
  },
];

const upcomingAbsences = [
  {
    id: 1,
    name: "Efu dohwedohwe",
    dates: "Feb 20 - Feb 21",
    type: "Annual",
    avatar: "LW",
  },
  { id: 2, name: "Eti Gelengele", dates: "Feb 22", type: "Sick", avatar: "PS" },
  {
    id: 3,
    name: "Nan Konhwion",
    dates: "Feb 24 - Feb 28",
    type: "Annual",
    avatar: "TB",
  },
];

export default function PendingUpcoming() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Pending Requests */}
      <Card className="sm:col-span-1 lg:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Pending</CardTitle>
              <CardDescription>Requests awaiting your review</CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0"
            >
              {pendingRequests.length} Pending{" "}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-card hover:bg-muted/50 flex items-center gap-4 rounded-xl border p-4 transition-colors"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {req.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground text-sm font-medium">
                      {req.name}
                    </p>
                    <Badge
                      variant="outline"
                      className="px-1.5 py-1 text-[10px]"
                    >
                      {req.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">{req.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-medium">
                    {req.dates}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {req.days} day{req.days > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-emerald-600 px-3 text-xs text-emerald-700 hover:bg-emerald-300 hover:text-emerald-600"
                  >
                    <CheckCircle2 className="mr-1 size-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-7 px-2.5 text-xs"
                  >
                    <XCircle className="mr-1 size-3.5" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Absences */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Upcoming</CardTitle>
              <CardDescription>Absences upcoming</CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0"
            >
              {upcomingAbsences.length} Upcoming{" "}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {upcomingAbsences.map((absence) => (
              <div
                key={absence.id}
                className="bg-card hover:bg-muted/50 flex items-center gap-4 rounded-xl border p-4 transition-colors"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {absence.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="text-foreground text-sm font-medium">
                      {absence.name}
                    </p>
                    <Badge
                      variant="outline"
                      className="px-1.5 py-1 text-[10px]"
                    >
                      {absence.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {absence.dates}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
