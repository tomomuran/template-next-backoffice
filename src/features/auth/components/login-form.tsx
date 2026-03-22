"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthActionResult } from "@/features/auth/actions";

const loginSchema = z.object({
  email: z.string().trim().email("メールアドレスの形式が不正です"),
  password: z.string().min(8, "パスワードは 8 文字以上です")
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  submitAction: (values: LoginValues) => Promise<AuthActionResult>;
}

export function LoginForm({ submitAction }: LoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitAction(values);

      if (result.error) {
        form.setError("root", { message: result.error });
        return;
      }

      window.location.assign("/dashboard");
    });
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>招待済みユーザーのメールアドレスとパスワードでログインします。</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? <p className="text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password ? <p className="text-sm text-red-600">{form.formState.errors.password.message}</p> : null}
          </div>
          {form.formState.errors.root ? <p className="text-sm text-red-600">{form.formState.errors.root.message}</p> : null}
          <div className="flex justify-end">
            <a className="text-sm text-slate-600 underline-offset-4 hover:underline" href="/auth/forgot-password">
              Forgot password?
            </a>
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
