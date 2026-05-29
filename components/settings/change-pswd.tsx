"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSettingsViewModel } from "@/viewmodels/useSettingsViewModel";

export function ChangePswdForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const {
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
  } = useSettingsViewModel();

  return (
    <Card className="ml-auto w-full max-w-sm text-sm" {...props}>
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-base">Change Password</CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <form onSubmit={handleSubmit}>
          <FieldGroup className="flex flex-col gap-3">
            <Field>
              <FieldLabel className="text-xs" htmlFor="oldPassword">
                Old Password
              </FieldLabel>
              <Input
                id="oldPassword"
                type="password"
                required
                className="h-8 text-sm"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel className="text-xs" htmlFor="newPassword">
                New Password
              </FieldLabel>
              <Input
                id="newPassword"
                type="password"
                required
                className="h-8 text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FieldDescription className="text-xs">
                Must be at least 8 characters.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel className="text-xs" htmlFor="confirmNewPassword">
                Confirm New Password
              </FieldLabel>
              <Input
                id="confirmNewPassword"
                type="password"
                required
                className="h-8 text-sm"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Field>

            {error && <p className="text-xs text-red-500">{error}</p>}
            {success && <p className="text-xs text-green-500">{success}</p>}

            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Password"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
