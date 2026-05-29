const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const headers = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  "ngrok-skip-browser-warning": "true",
});

export async function fetchMyLeaveRequests() {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/v1/leave-requests/my`, {
    headers: headers(token!),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to load requests");
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function submitLeaveRequest(form: {
  leavePolicyId: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  reason: string;
}) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/v1/leave-requests`, {
    method: "POST",
    headers: headers(token!),
    body: JSON.stringify(form),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to submit request");
  return data;
}

export async function cancelRequest(id: string) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/v1/leave-requests/${id}/cancel`, {
    method: "PATCH",
    headers: headers(token!),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to cancel request");
  return data;
}
