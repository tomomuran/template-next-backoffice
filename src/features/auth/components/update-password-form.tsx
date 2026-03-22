"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthActionResult } from "@/features/auth/actions";

const schema = z
  .object({
    password: z.string().min(8, "パスワードは 8 文字以上です"),
    confirmPassword: z.string().min(8, "確認用パスワードは 8 文字以上です")
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"]
  });

type Values = z.infer<typeof schema>;

interface UpdatePasswordFormProps {
  submitAction: (password: string) => Promise<AuthActionResult>;
}

export function UpdatePasswordForm({ submitAction }: UpdatePasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitAction(values.password);

      if (result.error) {
        form.setError("root", { message: result.error });
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Update password</CardTitle>
        <CardDescription>招待リンクまたは再設定リンクで認証済みの場合に、新しいパスワードを設定します。</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password ? <p className="text-sm text-red-600">{form.formState.errors.password.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
            {form.formState.errors.confirmPassword ? (
              <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
            ) : null}
          </div>
          {form.formState.errors.root ? <p className="text-sm text-red-600">{form.formState.errors.root.message}</p> : null}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
