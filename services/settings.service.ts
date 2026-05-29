const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function changePassword(
  token: string,
  oldPassword: string,
  newPassword: string,
): Promise<string> {
  const res = await fetch(`${BASE_URL}/v1/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) throw new Error(data?.message || "Failed to change password");
  return data?.message || "Password changed successfully!";
}
