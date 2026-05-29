// viewmodels/useEmployeeViewModel.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { getAccessToken } from "@/lib/auth";
import {
  fetchEmployees,
  fetchDepartments,
  createEmployee,
  createDepartment,
} from "@/services/employee.service";
import type {
  Employee,
  ApiDepartment,
  EmployeeFormState,
  DepartmentFormState,
} from "@/models/employee.types";
import {
  EMPTY_EMPLOYEE_FORM,
  EMPTY_DEPARTMENT_FORM,
} from "@/models/employee.types";

export function useEmployeeViewModel() {
  // ─── Employee List ──────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ✅ false = user got a 403 on /v1/users — show restricted state, not error
  const [canViewEmployees, setCanViewEmployees] = useState(true);

  // ─── Filters ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // ─── Add Employee Dialog ────────────────────────────────────────────────────
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employeeForm, setEmployeeForm] =
    useState<EmployeeFormState>(EMPTY_EMPLOYEE_FORM);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const [employeeSuccess, setEmployeeSuccess] = useState(false);

  // ─── Create Department Dialog ───────────────────────────────────────────────
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [deptForm, setDeptForm] = useState<DepartmentFormState>(
    EMPTY_DEPARTMENT_FORM,
  );
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptError, setDeptError] = useState<string | null>(null);
  const [deptSuccess, setDeptSuccess] = useState(false);

  // ─── Fetch Departments ───────────────────────────────────────────────────────
  // ✅ GET /v1/department is open to ALL roles — always safe to call
  // Extracted into its own named function so it can be called after creating a dept
  const loadDepartments = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const data = await fetchDepartments(token);
      setDepartments(data);
    } catch (err) {
      // ✅ Log with detail so we can see if BASE_URL or token is the issue
      console.error(
        "Failed to fetch departments:",
        err instanceof Error ? err.message : err,
      );
    }
  }, []);

  // ─── Fetch Employees ─────────────────────────────────────────────────────────
  // ✅ GET /v1/users is restricted to HR_ADMIN and TENANT_ADMIN only
  const loadEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    setFetchError(null);
    const token = getAccessToken();
    if (!token) {
      setFetchError("Not authenticated.");
      setLoadingEmployees(false);
      return;
    }
    try {
      const data = await fetchEmployees(token);
      setEmployees(data);
      setCanViewEmployees(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      // ✅ 403/permission errors are silently swallowed — show restricted UI
      const isPermissionError =
        message.toLowerCase().includes("permission") ||
        message.toLowerCase().includes("forbidden") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("403");

      if (isPermissionError) {
        setCanViewEmployees(false);
        setEmployees([]);
      } else {
        setFetchError(message);
      }
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, [loadEmployees, loadDepartments]);

  // ─── Filtered Employees ──────────────────────────────────────────────────────
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      !searchQuery ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || emp.departmentId === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || emp.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departmentOptions = [
    { value: "all", label: "All Departments" },
    ...departments.map((d) => ({
      value: d.id || "",
      label: d.name || "Unnamed",
    })),
  ];

  // ─── Add Employee ────────────────────────────────────────────────────────────
  const setEmployeeField =
    (key: keyof EmployeeFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setEmployeeForm((f) => ({ ...f, [key]: e.target.value }));

  const handleEmployeeOpenChange = (open: boolean) => {
    setEmployeeDialogOpen(open);
    if (!open) {
      setEmployeeForm(EMPTY_EMPLOYEE_FORM);
      setEmployeeError(null);
      setEmployeeSuccess(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasEmpty = Object.values(employeeForm).some(
      (v) => !v || v.toString().trim() === "",
    );
    if (hasEmpty) {
      setEmployeeError("All fields are required.");
      return;
    }
    const token = getAccessToken();
    if (!token) {
      setEmployeeError("Access token not found.");
      return;
    }
    setEmployeeLoading(true);
    setEmployeeError(null);
    try {
      const newEmployee = await createEmployee(
        token,
        employeeForm,
        departments,
      );
      setEmployees((prev) => [newEmployee, ...prev]);
      setEmployeeSuccess(true);
      setTimeout(() => handleEmployeeOpenChange(false), 1500);
    } catch (err) {
      setEmployeeError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setEmployeeLoading(false);
    }
  };

  // ─── Create Department ───────────────────────────────────────────────────────
  const setDeptField =
    (key: keyof DepartmentFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDeptForm((f) => ({ ...f, [key]: e.target.value }));

  const handleDeptOpenChange = (open: boolean) => {
    setDeptDialogOpen(open);
    if (!open) {
      setDeptForm(EMPTY_DEPARTMENT_FORM);
      setDeptError(null);
      setDeptSuccess(false);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name.trim() || !deptForm.description.trim()) {
      setDeptError("All required fields must be filled.");
      return;
    }
    const token = getAccessToken();
    if (!token) {
      setDeptError("Access token not found.");
      return;
    }
    setDeptLoading(true);
    setDeptError(null);
    try {
      await createDepartment(token, deptForm);
      setDeptSuccess(true);
      // ✅ Re-fetch departments so the new one appears immediately in the list
      // Previously this was missing — the count stayed at 0 after creation
      await loadDepartments();
      setTimeout(() => handleDeptOpenChange(false), 1500);
    } catch (err) {
      setDeptError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setDeptLoading(false);
    }
  };

  return {
    // List
    employees,
    filteredEmployees,
    departments,
    departmentOptions,
    loadingEmployees,
    fetchError,
    canViewEmployees,
    // Filters
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedStatus,
    setSelectedStatus,
    // Add Employee
    employeeDialogOpen,
    employeeForm,
    employeeLoading,
    employeeError,
    employeeSuccess,
    setEmployeeField,
    setEmployeeDepartment: (v: string) =>
      setEmployeeForm((f) => ({ ...f, departmentId: v })),
    setEmployeeRole: (v: string) => setEmployeeForm((f) => ({ ...f, role: v })),
    handleEmployeeOpenChange,
    handleAddEmployee,
    // Create Department
    deptDialogOpen,
    deptForm,
    deptLoading,
    deptError,
    deptSuccess,
    setDeptField,
    handleDeptOpenChange,
    handleCreateDepartment,
  };
}
