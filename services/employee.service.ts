// services/employee.service.ts

import type {
  ApiUser,
  ApiDepartment,
  EmployeeFormState,
  DepartmentFormState,
  Employee,
} from "@/models/employee.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const headers = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  "ngrok-skip-browser-warning": "true",
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDob(dob?: string): string {
  if (!dob) return "";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return dob;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function normalizeStatus(raw?: string): string {
  if (!raw) return "active";
  const s = raw.toLowerCase();
  if (s.includes("leave")) return "on-leave";
  if (s.includes("inactive")) return "inactive";
  return "active";
}

function getSafeId(user: ApiUser, index: number): string {
  return (
    user?.id || user?._id || user?.userId || user?.email || `employee-${index}`
  );
}

export function mapApiUserToEmployee(user: ApiUser, index: number): Employee {
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  return {
    id: getSafeId(user, index),
    name: `${firstName} ${lastName}`.trim(),
    avatar: `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase(),
    email: user.email || "",
    contact: user.contact || "",
    role: user.role || "Employee",
    department: user.department?.name || user.departmentName || "",
    departmentId: user.department?.id || user.department?._id || "",
    location: user.houseAddress || user.address || "",
    status: normalizeStatus(user.status),
    dateofbirth: formatDob(user.dateOfBirth || user.dateofbirth),
  };
}

function extractUsersArray(data: unknown): ApiUser[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as ApiUser[];
  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of ["users", "data", "employees", "items"]) {
      if (Array.isArray(record[key])) return record[key] as ApiUser[];
    }
  }
  return [];
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export async function fetchEmployees(token: string): Promise<Employee[]> {
  const res = await fetch(`${BASE_URL}/v1/users`, {
    headers: headers(token),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to fetch employees");
  const users = extractUsersArray(data);
  return users.map((u, i) => mapApiUserToEmployee(u, i));
}

export async function fetchDepartments(
  token: string,
): Promise<ApiDepartment[]> {
  const res = await fetch(`${BASE_URL}/v1/department`, {
    headers: headers(token),
  });
  const data = await res.json().catch(() => null);
  let raw: ApiDepartment[] = [];
  if (Array.isArray(data)) raw = data;
  else if (Array.isArray(data?.data)) raw = data.data;
  return raw.map((d) => ({ ...d, id: d.id || d._id || "" }));
}

export async function createEmployee(
  token: string,
  form: EmployeeFormState,
  departments: ApiDepartment[],
): Promise<Employee> {
  const res = await fetch(`${BASE_URL}/v1/auth/register`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      contact: form.contact.trim(),
      departmentId: form.departmentId,
      role: form.role,
      houseAddress: form.houseAddress.trim(),
      dateOfBirth: form.dateOfBirth,
      email: form.workEmail.trim(),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to create employee");
  const deptName =
    departments.find((d) => d.id === form.departmentId)?.name || "";
  return {
    id: data?.id,
    name: `${form.firstName} ${form.lastName}`,
    avatar: `${form.firstName[0]}${form.lastName[0]}`,
    email: form.workEmail,
    contact: form.contact,
    role: form.role,
    department: deptName,
    departmentId: form.departmentId,
    location: form.houseAddress,
    status: "active",
    dateofbirth: form.dateOfBirth,
  };
}

export async function createDepartment(
  token: string,
  form: DepartmentFormState,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/department`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      name: form.name,
      description: form.description,
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message || "Failed to create department.",
    );
  }
}

// ✅ Delete employee via DELETE /v1/users/remove?email=<email>
// Backend RemoveUserCommand accepts email, firstName, or lastName as query params.
// We use email as it is the most unique identifier.
export async function deleteEmployee(
  token: string,
  email: string,
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/v1/users/remove?email=${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      headers: headers(token),
    },
  );
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete employee.");
  }
}

// ✅ Update employee via PATCH /v1/users/:id
export async function updateEmployee(
  token: string,
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    contact?: string;
    houseAddress?: string;
    dateOfBirth?: string;
    role?: string;
    departmentId?: string;
    email?: string;
  },
): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/users/${id}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  const responseData = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(responseData?.message || "Failed to update employee.");
  }
}
