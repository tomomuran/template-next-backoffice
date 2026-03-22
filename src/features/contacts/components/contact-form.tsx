"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/forms/form-field";
import { useUnsavedChangesWarning } from "@/components/forms/use-unsaved-changes-warning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, contactStatuses, type ContactFormValues } from "@/features/contacts/services/schemas";
import { contactStatusLabels, primarySampleFeature } from "@/lib/sample-features";

interface ContactFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ContactFormValues>;
  submitAction: (values: ContactFormValues) => Promise<void>;
}

const initialValues: ContactFormValues = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phone: "",
  status: "lead",
  notes: ""
};

export function ContactForm({ mode, defaultValues, submitAction }: ContactFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const resolvedDefaults = useMemo(() => ({ ...initialValues, ...defaultValues }), [defaultValues]);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: resolvedDefaults
  });
  const { confirmDiscardChanges } = useUnsavedChangesWarning(form.formState.isDirty, isPending);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      form.clearErrors("root");

      try {
        await submitAction(values);
        toast.success(mode === "create" ? "contact を作成しました" : "contact を更新しました");
        router.push("/contacts");
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "contact の保存に失敗しました";
        form.setError("root.serverError", { type: "server", message });
        toast.error(message);
      }
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? `Create ${primarySampleFeature.singularLabel}` : `Edit ${primarySampleFeature.singularLabel}`}</CardTitle>
        <CardDescription>{primarySampleFeature.label} サンプル feature の標準フォームです。</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField htmlFor="contact-last-name" label="姓" required error={form.formState.errors.lastName?.message}>
              <Input id="contact-last-name" {...form.register("lastName")} />
            </FormField>
            <FormField htmlFor="contact-first-name" label="名" required error={form.formState.errors.firstName?.message}>
              <Input id="contact-first-name" {...form.register("firstName")} />
            </FormField>
            <FormField htmlFor="contact-company-name" label="会社名" required error={form.formState.errors.companyName?.message}>
              <Input id="contact-company-name" {...form.register("companyName")} />
            </FormField>
            <FormField htmlFor="contact-email" label="メール" required error={form.formState.errors.email?.message}>
              <Input id="contact-email" type="email" {...form.register("email")} />
            </FormField>
            <FormField htmlFor="contact-phone" label="電話番号" required error={form.formState.errors.phone?.message}>
              <Input id="contact-phone" {...form.register("phone")} />
            </FormField>
            <FormField htmlFor="contact-status" label="ステータス" required error={form.formState.errors.status?.message}>
              <select
                id="contact-status"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                {...form.register("status")}
              >
                {contactStatuses.map((status) => (
                  <option key={status} value={status}>
                    {contactStatusLabels[status]}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField htmlFor="contact-notes" label="メモ" error={form.formState.errors.notes?.message}>
            <Textarea id="contact-notes" {...form.register("notes")} />
          </FormField>
          {form.formState.errors.root?.serverError?.message ? (
            <p className="text-sm text-red-600">{form.formState.errors.root.serverError.message}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!confirmDiscardChanges()) {
                  return;
                }

                router.push(primarySampleFeature.href);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
