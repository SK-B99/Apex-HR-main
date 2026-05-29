import type { ApprovalRequest } from "@/models/approval.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const headers = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  "ngrok-skip-browser-warning": "true",
});

export async function fetchAllLeaveRequests(
  token: string,
): Promise<ApprovalRequest[]> {
  const res = await fetch(`${BASE_URL}/v1/leave-requests`, {
    headers: headers(token),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to load requests");
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function deptApproveRequest(
  token: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/leave-requests/${id}/dept-approve`, {
    method: "PATCH",
    headers: headers(token),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to approve");
}

export async function hrApproveRequest(
  token: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/leave-requests/${id}/hr-approve`, {
    method: "PATCH",
    headers: headers(token),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to approve");
}

export async function rejectRequest(
  token: string,
  id: string,
  reason: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/leave-requests/${id}/reject`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ reason }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to reject");
}

export async function addComment(
  token: string,
  id: string,
  comment: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/leave-requests/${id}/comment`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ comment }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to add comment");
}
