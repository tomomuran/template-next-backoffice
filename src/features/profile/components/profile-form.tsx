"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/forms/form-field";
import { useUnsavedChangesWarning } from "@/components/forms/use-unsaved-changes-warning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { profileFormSchema, type ProfileFormValues } from "@/features/profile/services/profile-schema";

interface ProfileFormProps {
  defaultValues: ProfileFormValues;
  email: string;
  role: string;
  status: string;
  submitAction: (values: ProfileFormValues) => Promise<void>;
}

export function ProfileForm({ defaultValues, email, role, status, submitAction }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
  });
  useUnsavedChangesWarning(form.formState.isDirty, isPending);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await submitAction(values);
      toast.success("プロフィールを更新しました");
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>`user_profiles` を使った最小 profile 画面です。</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField htmlFor="profile-email" label="Email">
              <Input id="profile-email" value={email} disabled />
            </FormField>
            <FormField htmlFor="profile-role" label="Role">
              <Input id="profile-role" value={role} disabled />
            </FormField>
            <FormField htmlFor="profile-status" label="Status">
              <Input id="profile-status" value={status} disabled />
            </FormField>
            <FormField htmlFor="profile-display-name" label="Display name" required error={form.formState.errors.displayName?.message}>
              <Input id="profile-display-name" {...form.register("displayName")} />
            </FormField>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
