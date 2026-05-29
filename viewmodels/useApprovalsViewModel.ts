"use client";

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";
import {
  fetchAllLeaveRequests,
  deptApproveRequest,
  rejectRequest,
  addComment,
} from "@/services/approval.service";
import type { ApprovalRequest } from "@/models/approval.types";

export function useApprovalsViewModel() {
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }
    try {
      const data = await fetchAllLeaveRequests(token);
      setApprovalQueue(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSelectRequest = (req: ApprovalRequest) => {
    setSelectedRequest(req);
    setShowCommentBox(false);
    setCommentText("");
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    const token = getAccessToken();
    if (!token) {
      setError("Not authenticated.");
      setActionLoading(false);
      return;
    }
    try {
      await deptApproveRequest(token, id);
      await loadRequests();
      setSelectedRequest(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    setActionLoading(true);
    const token = getAccessToken();
    if (!token) {
      setError("Not authenticated.");
      setActionLoading(false);
      return;
    }
    try {
      await rejectRequest(token, id, reason);
      await loadRequests();
      setSelectedRequest(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComment = async (id: string) => {
    if (!commentText.trim()) return;
    setActionLoading(true);
    const token = getAccessToken();
    if (!token) {
      setError("Not authenticated.");
      setActionLoading(false);
      return;
    }
    try {
      await addComment(token, id, commentText);
      setCommentText("");
      setShowCommentBox(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = approvalQueue.filter(
    (r) => r.status === "PENDING",
  ).length;
  const conflictCount = approvalQueue.filter((r) => r.conflict).length;

  return {
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
  };
}
