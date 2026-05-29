// viewmodels/useEmployeeViewModel.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { getAccessToken } from "@/lib/auth";
import {
  fetchEmployees,
  fetchDepartments,
  createEmployee,
  createDepartment,
  deleteEmployee,
  updateEmployee, // ✅ new
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

// ✅ Edit form shape — mirrors UpdateUserDto fields
type EditForm = {
  firstName: string;
  lastName: string;
  contact: string;
  houseAddress: string;
  dateOfBirth: string;
  role: string;
  departmentId: string;
  email: string;
};

const EMPTY_EDIT_FORM: EditForm = {
  firstName: "",
  lastName: "",
  contact: "",
  houseAddress: "",
  dateOfBirth: "",
  role: "",
  departmentId: "",
  email: "",
};

export function useEmployeeViewModel() {
  // ─── Employee List ──────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
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

  // ─── Edit Employee Dialog ───────────────────────────────────────────────────
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_EDIT_FORM);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // ─── Create Department Dialog ───────────────────────────────────────────────
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [deptForm, setDeptForm] = useState<DepartmentFormState>(
    EMPTY_DEPARTMENT_FORM,
  );
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptError, setDeptError] = useState<string | null>(null);
  const [deptSuccess, setDeptSuccess] = useState(false);

  // ─── Delete State ────────────────────────────────────────────────────────────
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  // ─── Fetch Departments ───────────────────────────────────────────────────────
  const loadDepartments = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const data = await fetchDepartments(token);
      setDepartments(data);
    } catch (err) {
      console.error(
        "Failed to fetch departments:",
        err instanceof Error ? err.message : err,
      );
    }
  }, []);

  // ─── Fetch Employees ─────────────────────────────────────────────────────────
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

  // ─── Edit Employee ────────────────────────────────────────────────────────────
  // ✅ Open edit dialog and pre-populate form with existing employee data
  const handleEditOpen = (emp: Employee) => {
    setEditingEmployee(emp);
    setEditForm({
      firstName: emp.name.split(" ")[0] || "",
      lastName: emp.name.split(" ").slice(1).join(" ") || "",
      contact: emp.contact || "",
      houseAddress: emp.location || "",
      dateOfBirth: "", // not returned by list API — leave blank for user to fill if needed
      role: emp.role || "",
      departmentId: emp.departmentId || "",
      email: emp.email || "",
    });
    setEditError(null);
    setEditSuccess(false);
    setEditDialogOpen(true);
  };

  const handleEditOpenChange = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingEmployee(null);
      setEditForm(EMPTY_EDIT_FORM);
      setEditError(null);
      setEditSuccess(false);
    }
  };

  const handleEditFieldChange = (key: keyof EditForm, value: string) => {
    setEditForm((f) => ({ ...f, [key]: value }));
  };

  // ✅ Submit edit via PATCH /v1/users/:id
  const handleEditSubmit = async () => {
    if (!editingEmployee) return;
    const token = getAccessToken();
    if (!token) {
      setEditError("Not authenticated.");
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      await updateEmployee(token, editingEmployee.id, {
        firstName: editForm.firstName || undefined,
        lastName: editForm.lastName || undefined,
        contact: editForm.contact || undefined,
        houseAddress: editForm.houseAddress || undefined,
        dateOfBirth: editForm.dateOfBirth || undefined,
        role: editForm.role || undefined,
        departmentId: editForm.departmentId || undefined,
        email: editForm.email || undefined,
      });
      // ✅ Update local state so the card reflects changes immediately
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === editingEmployee.id
            ? {
                ...e,
                name: `${editForm.firstName} ${editForm.lastName}`.trim(),
                avatar:
                  `${editForm.firstName[0] || ""}${editForm.lastName[0] || ""}`.toUpperCase(),
                contact: editForm.contact,
                location: editForm.houseAddress,
                role: editForm.role,
                email: editForm.email,
                departmentId: editForm.departmentId,
                department:
                  departments.find((d) => d.id === editForm.departmentId)
                    ?.name || e.department,
              }
            : e,
        ),
      );
      setEditSuccess(true);
      setTimeout(() => handleEditOpenChange(false), 1500);
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Delete Employee ──────────────────────────────────────────────────────────
  const handleDeleteEmployee = async (email: string) => {
    if (!window.confirm(`Are you sure you want to remove ${email}?`)) return;
    const token = getAccessToken();
    if (!token) return;
    setDeletingEmail(email);
    try {
      await deleteEmployee(token, email);
      setEmployees((prev) => prev.filter((e) => e.email !== email));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete employee.");
    } finally {
      setDeletingEmail(null);
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
    // Edit Employee
    editDialogOpen,
    editingEmployee,
    editForm,
    editLoading,
    editError,
    editSuccess,
    handleEditOpen,
    handleEditOpenChange,
    handleEditFieldChange,
    handleEditSubmit,
    // Delete
    deletingEmail,
    handleDeleteEmployee,
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
