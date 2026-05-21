import type { RegisterTenantPayload } from "@/models/tenant.types";

export async function registerTenant(
  payload: RegisterTenantPayload,
): Promise<void> {
  const response = await fetch(
    "https://hermit-jogger-equinox.ngrok-free.dev/v1/auth/register-tenant",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create account");
  }
}
