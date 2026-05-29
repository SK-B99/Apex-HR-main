"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { changePassword } from "@/services/settings.service";

export function useSettingsViewModel() {
  const router = useRouter();

  // ─── Change Password ─────────────────────────────────────────────────────────
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ─── UI Toggle (from settings/page.tsx) ─────────────────────────────────────
  const [showChangePswdForm, setShowChangePswdForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const message = await changePassword(token, oldPassword, newPassword);
      setSuccess(message);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    // Change Password
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    loading,
    error,
    success,
    handleSubmit,
    // UI
    showChangePswdForm,
    toggleChangePswdForm: () => setShowChangePswdForm((prev) => !prev),
  };
}
