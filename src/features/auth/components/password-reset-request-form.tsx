"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthActionResult } from "@/features/auth/actions";

const schema = z.object({
  email: z.string().trim().email("メールアドレスの形式が不正です")
});

type Values = z.infer<typeof schema>;

interface PasswordResetRequestFormProps {
  submitAction: (email: string) => Promise<AuthActionResult>;
}

export function PasswordResetRequestForm({ submitAction }: PasswordResetRequestFormProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitAction(values.email);
      setSuccessMessage("");

      if (result.error) {
        form.setError("root", { message: result.error });
        return;
      }

      form.clearErrors("root");
      if (result.success) {
        setSuccessMessage(result.success);
      }
    });
  });

  const rootError = form.formState.errors.root;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>招待済みユーザー向けに、再設定リンクをメールで送信します。</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? <p className="text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
          </div>
          {rootError ? <p className="text-sm text-red-600">{rootError.message}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
