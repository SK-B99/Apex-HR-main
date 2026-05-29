// components/approvals/stat-cards.tsx
// (This is the full ApprovalsPage component used inside app/approvals/page.tsx)

"use client";

import {
  AlertTriangle,
  Clock,
  Check,
  X,
  MessageSquare,
  Calendar,
  Building2,
  User,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useApprovalsViewModel } from "@/viewmodels/useApprovalsViewModel";
import {
  APPROVAL_TYPE_COLORS,
  STEP_STATUS_COLORS,
} from "@/models/approval.types";

export default function ApprovalsPage() {
  const {
    approvalQueue,
    selectedRequest,
    loading,
    actionLoading,
    error,
    commentText,
    setCommentText,
    showCommentBox,
    setShowCommentBox,
    pendingCount,
    conflictCount,
    handleSelectRequest,
    handleApprove,
    handleReject,
    handleComment,
  } = useApprovalsViewModel();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-foreground text-lg font-semibold">Approvals</h2>
        <p className="text-muted-foreground text-sm">
          Review and action pending leave requests
        </p>
      </div>

      {/* Stats — ✅ responsive: 1 col on mobile, 3 on sm+ */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5 text-center">
          <div className="bg-warning/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-xl">
            <Clock className="text-warning h-4 w-4" />
          </div>
          <p className="text-foreground text-2xl font-semibold">
            {pendingCount}
          </p>
          <p className="text-muted-foreground text-sm">Awaiting your review</p>
        </Card>
        <Card className="p-5 text-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-xl">
            <AlertTriangle className="text-destructive h-4 w-4" />
          </div>
          <p className="text-foreground text-2xl font-semibold">
            {conflictCount}
          </p>
          <p className="text-muted-foreground text-sm">Conflict Warnings</p>
        </Card>
        <Card className="p-5 text-center">
          <div className="bg-primary/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-xl">
            <Clock className="text-primary h-4 w-4" />
          </div>
          <p className="text-foreground text-2xl font-semibold">—</p>
          <p className="text-muted-foreground text-sm">Average Response Time</p>
        </Card>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* Queue + Detail — ✅ stacks on mobile, side-by-side on lg+ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Queue */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <h3 className="text-muted-foreground mb-1 px-1 text-sm font-medium">
            Queue ({approvalQueue.length})
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="text-muted-foreground size-5 animate-spin" />
            </div>
          ) : approvalQueue.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center text-sm">
              No pending requests.
            </p>
          ) : (
            approvalQueue.map((req) => (
              <Card
                key={req.id}
                className={`hover:border-primary/30 cursor-pointer transition-all ${
                  selectedRequest?.id === req.id
                    ? "border-primary ring-primary/20 ring-1"
                    : ""
                }`}
                onClick={() => handleSelectRequest(req)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="mt-0.5 size-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {req.user?.firstName?.[0]}
                        {req.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-foreground text-sm font-semibold">
                          {req.user?.firstName} {req.user?.lastName}
                        </p>
                        {req.conflict && (
                          <AlertTriangle className="text-destructive size-4" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {req.user?.role}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0 text-[10px]"
                        >
                          {req.leavePolicy?.type}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {new Date(req.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <Card className="flex flex-col lg:col-span-3">
          {selectedRequest ? (
            <>
              <CardHeader className="border-b pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {selectedRequest.user?.firstName?.[0]}
                        {selectedRequest.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground font-semibold">
                        {selectedRequest.user?.firstName}{" "}
                        {selectedRequest.user?.lastName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {selectedRequest.user?.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {selectedRequest.id}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-5 pt-5">
                {selectedRequest.conflict && (
                  <div className="bg-destructive/10 border-destructive/20 flex items-start gap-2 rounded-lg border px-3 py-2.5">
                    <AlertTriangle className="text-destructive mt-0.5 size-4 shrink-0" />
                    <p className="text-destructive text-xs">
                      {selectedRequest.conflictDetails}
                    </p>
                  </div>
                )}

                {/* ✅ responsive: 1 col on mobile, 2 on sm+ */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Start Date",
                      value: new Date(
                        selectedRequest.startDate,
                      ).toLocaleDateString(),
                      icon: Calendar,
                    },
                    {
                      label: "End Date",
                      value: new Date(
                        selectedRequest.endDate,
                      ).toLocaleDateString(),
                      icon: Calendar,
                    },
                    {
                      label: "Duration",
                      value: `${selectedRequest.totalDays ?? "—"} day(s)`,
                      icon: Building2,
                    },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
                        <Icon className="text-muted-foreground size-4" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[11px]">
                          {label}
                        </p>
                        <p className="text-foreground text-sm font-medium">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
                      <User className="text-muted-foreground size-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px]">
                        Leave Type
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          APPROVAL_TYPE_COLORS[
                            selectedRequest.leavePolicy?.type ?? ""
                          ] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {selectedRequest.leavePolicy?.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                    Reason
                  </p>
                  <p className="text-foreground bg-muted/40 rounded-lg px-3 py-2.5 text-sm leading-relaxed">
                    {selectedRequest.reason}
                  </p>
                </div>

                {selectedRequest.workflow &&
                  selectedRequest.workflow.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-3 text-xs font-medium">
                        Approval Workflow
                      </p>
                      <div className="flex items-center gap-1">
                        {selectedRequest.workflow.map((step, i) => (
                          <div
                            key={i}
                            className="flex flex-1 items-center gap-1"
                          >
                            <div className="flex flex-1 flex-col items-center">
                              <div
                                className={`flex size-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                                  STEP_STATUS_COLORS[step.status]
                                }`}
                              >
                                {step.status === "completed" ? (
                                  <Check className="size-3.5" />
                                ) : (
                                  i + 1
                                )}
                              </div>
                              <p className="text-muted-foreground mt-1 text-center text-[10px]">
                                {step.step}
                              </p>
                              <p className="text-foreground w-full truncate px-1 text-center text-[10px] font-medium">
                                {step.user}
                              </p>
                            </div>
                            {i < selectedRequest.workflow!.length - 1 && (
                              <div
                                className={`mb-5 h-px flex-1 ${
                                  step.status === "completed"
                                    ? "bg-success"
                                    : "bg-border"
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {showCommentBox && (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCommentBox(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleComment(selectedRequest.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-auto flex items-center gap-2 border-t pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => setShowCommentBox((prev) => !prev)}
                  >
                    <MessageSquare className="size-3.5" />
                    Comment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 flex-1 gap-1.5"
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={actionLoading}
                  >
                    <X className="size-3.5" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="size-3.5" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
              <div className="bg-muted mb-3 flex size-12 items-center justify-center rounded-xl">
                <Clock className="text-muted-foreground size-5" />
              </div>
              <p className="text-foreground text-sm font-medium">
                No request selected
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Click a request from the queue to review it
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
