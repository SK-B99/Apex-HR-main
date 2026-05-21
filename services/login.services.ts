import type { LoginPayload, LoginResponse } from "@/models/login.types";

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(
    "https://hermit-jogger-equinox.ngrok-free.dev/v1/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Email or password is incorrect");
  }

  return data;
}

export async function forgotPassword(email: string): Promise<string> {
  const response = await fetch(
    "https://hermit-jogger-equinox.ngrok-free.dev/v1/auth/forgot-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send reset email");
  }

  return data.message || "Password reset link has been sent to your email.";
}
