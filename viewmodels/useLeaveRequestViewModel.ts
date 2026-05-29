// viewmodels/useLeaveRequestViewModel.ts

"use client";

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";
import {
  fetchMyLeaveRequests,
  submitLeaveRequest,
  cancelRequest,
} from "@/services/leave-request.service";
import { fetchDepartments } from "@/services/employee.service";
import type {
  LeaveRequest,
  LeaveRequestFormState,
} from "@/models/leave-request.types";
import { EMPTY_LEAVE_REQUEST_FORM } from "@/models/leave-request.types";
import type { ApiDepartment } from "@/models/employee.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export function useLeaveRequestViewModel() {
  // ─── Request List ────────────────────────────────────────────────────────────
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Policies ────────────────────────────────────────────────────────────────
  const [policies, setPolicies] = useState<
    { id: string; name: string; type: string }[]
  >([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);

  // ─── Departments ─────────────────────────────────────────────────────────────
  // ✅ Fetched on dialog open — used as workaround since JWT has no departmentId
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // ─── New Request Dialog ──────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<LeaveRequestFormState>(
    EMPTY_LEAVE_REQUEST_FORM,
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Filters ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  // ─── Load Requests ───────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchMyLeaveRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // ─── Load Policies ───────────────────────────────────────────────────────────
  const loadPolicies = async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoadingPolicies(true);
    try {
      const res = await fetch(`${BASE_URL}/v1/leave-policies/my-policies`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setPolicies(Array.isArray(data) ? data : (data?.data ?? []));
      }
    } catch (err) {
      console.error("Failed to load policies", err);
    } finally {
      setLoadingPolicies(false);
    }
  };

  // ─── Load Departments ─────────────────────────────────────────────────────────
  // ✅ GET /v1/department is open to all roles — safe to call for any user
  // We fetch this when the dialog opens so the user can pick their department
  const loadDepartments = async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoadingDepartments(true);
    try {
      const data = await fetchDepartments(token);
      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments", err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ─── Cancel Request ──────────────────────────────────────────────────────────
  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this request?")) return;
    try {
      await cancelRequest(id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel");
    }
  };

  // ─── Submit New Request ──────────────────────────────────────────────────────
  const resetForm = () => {
    setForm(EMPTY_LEAVE_REQUEST_FORM);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (open) {
      loadPolicies();
      loadDepartments(); // ✅ fetch departments when dialog opens
    }
    if (!open) resetForm();
  };

  const handleSubmit = async () => {
    if (
      !form.leavePolicyId ||
      !form.startDate ||
      !form.endDate ||
      !form.reason.trim()
    ) {
      setSubmitError("All fields are required.");
      return;
    }

    // ✅ Validate department is selected — required by backend SubmitLeaveRequestDto
    if (!form.departmentId) {
      setSubmitError("Please select your department.");
      return;
    }

    if (form.reason.trim().length < 10) {
      setSubmitError("Reason must be at least 10 characters.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setSubmitError("Not authenticated.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    try {
      await submitLeaveRequest({
        leavePolicyId: form.leavePolicyId,
        departmentId: form.departmentId, // ✅ now comes from user selection
        startDate: form.startDate,
        endDate: form.endDate,
        isHalfDay: form.isHalfDay,
        reason: form.reason,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        handleDialogOpenChange(false);
        load();
      }, 1500);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const pending = requests.filter((r) => r.status === "PENDING");
  const approved = requests.filter((r) => r.status === "APPROVED");
  const rejected = requests.filter((r) => r.status === "REJECTED");

  return {
    // List
    requests,
    pending,
    approved,
    rejected,
    loading,
    error,
    handleCancel,
    // Policies
    policies,
    loadingPolicies,
    // Departments
    departments, // ✅ exposed for the form select
    loadingDepartments,
    // New Request
    dialogOpen,
    form,
    setForm,
    submitLoading,
    submitError,
    submitSuccess,
    handleDialogOpenChange,
    handleSubmit,
    // Filters
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterDepartment,
    setFilterDepartment,
  };
}
