// components/leave-request/leave-request-cards.tsx

"use client";

import {
  CheckCircle2,
  ChevronRight,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useLeaveRequestViewModel } from "@/viewmodels/useLeaveRequestViewModel";
import { STATUS_CONFIG, TYPE_COLORS } from "@/models/leave-request.types";
import type { LeaveRequest } from "@/models/leave-request.types";

const STATUS_ICONS: Record<string, React.ElementType> = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  CANCELLED: XCircle,
};

export default function LeaveRequestCards() {
  const {
    requests,
    pending,
    approved,
    rejected,
    loading,
    error,
    handleCancel,
  } = useLeaveRequestViewModel();

  const renderRow = (req: LeaveRequest, showActions = false) => {
    const status = req.status ?? "PENDING";
    const statusInfo = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
    const StatusIcon = STATUS_ICONS[status] ?? Clock;

    return (
      <div
        key={req.id}
        className="hover:bg-muted/30 flex cursor-pointer items-center gap-4 p-4 transition-colors"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {/* ✅ Fixed: was req.employee — correct field is req.user per the model and API */}
            {req.user?.firstName?.[0]}
            {req.user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-foreground text-sm font-medium">
              {/* ✅ Fixed: was req.employee?.firstName/lastName */}
              {req.user?.firstName} {req.user?.lastName}
            </p>
            <span className="text-muted-foreground text-xs">
              {req.id?.slice(0, 8)}
            </span>
          </div>
          {/* ✅ Fixed: was req.employee?.role */}
          <p className="text-muted-foreground text-xs">{req.user?.role}</p>
        </div>

        <Badge
          variant="outline"
          className={`border-0 text-[10px] ${TYPE_COLORS[req.leavePolicy?.type ?? ""] || ""}`}
        >
          {/* ✅ Fixed: was req.leaveType (doesn't exist on model) — correct is req.leavePolicy?.type */}
          {req.leavePolicy?.type}
        </Badge>

        <div className="min-w-28 text-right">
          <p className="text-foreground text-sm">
            {new Date(req.startDate).toLocaleDateString()}
          </p>
          <p className="text-muted-foreground text-xs">
            to {new Date(req.endDate).toLocaleDateString()}
          </p>
        </div>

        <Badge
          variant="outline"
          className={`gap-1 text-[10px] ${statusInfo.className}`}
        >
          <StatusIcon className="size-3" />
          {statusInfo.label}
        </Badge>

        {showActions && status === "PENDING" ? (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10 h-7 px-2.5 text-xs"
            onClick={() => handleCancel(req.id)}
          >
            Cancel
          </Button>
        ) : (
          <ChevronRight className="text-muted-foreground size-4" />
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );

  if (error)
    return (
      <p className="text-destructive py-10 text-center text-sm">{error}</p>
    );

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">
          All{" "}
          <Badge variant="secondary" className="ml-1.5 h-5 text-[10px]">
            {requests.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending
          <Badge
            variant="secondary"
            className="bg-warning/15 text-warning-foreground ml-1.5 h-5 text-[10px]"
          >
            {pending.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>

      {[
        {
          value: "all",
          data: requests,
          actions: false,
          empty: "No requests found.",
        },
        {
          value: "pending",
          data: pending,
          actions: true,
          empty: "No pending requests.",
        },
        {
          value: "approved",
          data: approved,
          actions: false,
          empty: "No approved requests.",
        },
        {
          value: "rejected",
          data: rejected,
          actions: false,
          empty: "No rejected requests.",
        },
      ].map(({ value, data, actions, empty }) => (
        <TabsContent key={value} value={value}>
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y">
                {data.length === 0 ? (
                  <p className="text-muted-foreground py-10 text-center text-sm">
                    {empty}
                  </p>
                ) : (
                  data.map((r) => renderRow(r, actions))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
