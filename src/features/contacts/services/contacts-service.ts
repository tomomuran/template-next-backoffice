import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { recordAuditLog, toJsonValue } from "@/lib/services/audit-log-service";
import { contactFormSchema, type ContactFormValues, type ContactRecord } from "@/features/contacts/services/schemas";

function mapFormToInsert(values: ContactFormValues, userId: string) {
  return {
    first_name: values.firstName,
    last_name: values.lastName,
    company_name: values.companyName,
    email: values.email,
    phone: values.phone,
    status: values.status,
    notes: values.notes,
    created_by: userId,
    updated_by: userId
  };
}

export async function listContacts(): Promise<ContactRecord[]> {
  const { supabase } = await requireAuthenticatedUser();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, company_name, email, phone, status, notes, created_at, updated_at")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`contacts 一覧の取得に失敗しました: ${error.message}`);
  }

  return (data ?? []) as ContactRecord[];
}

export async function getContactById(contactId: string): Promise<ContactRecord | null> {
  const { supabase } = await requireAuthenticatedUser();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, company_name, email, phone, status, notes, created_at, updated_at")
    .eq("id", contactId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(`contact の取得に失敗しました: ${error.message}`);
  }

  return data as ContactRecord | null;
}

export async function createContact(values: ContactFormValues) {
  const parsed = contactFormSchema.parse(values);
  const { user, supabase } = await requireAuthenticatedUser();
  const payload = mapFormToInsert(parsed, user.id);
  const { data, error } = await supabase.from("contacts").insert(payload).select("*").single();

  if (error) {
    throw new Error(`contact の作成に失敗しました: ${error.message}`);
  }

  await recordAuditLog(supabase, {
    actor: user.id,
    action: "create",
    targetType: "contact",
    targetId: data.id,
    before: null,
    after: data
  });

  return data;
}

export async function updateContact(contactId: string, values: ContactFormValues) {
  const parsed = contactFormSchema.parse(values);
  const { user, supabase } = await requireAuthenticatedUser();
  const before = await getContactById(contactId);

  if (!before) {
    throw new Error("対象の contact が見つかりません");
  }

  const { data, error } = await supabase
    .from("contacts")
    .update({
      first_name: parsed.firstName,
      last_name: parsed.lastName,
      company_name: parsed.companyName,
      email: parsed.email,
      phone: parsed.phone,
      status: parsed.status,
      notes: parsed.notes,
      updated_by: user.id
    })
    .eq("id", contactId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`contact の更新に失敗しました: ${error.message}`);
  }

  await recordAuditLog(supabase, {
    actor: user.id,
    action: "update",
    targetType: "contact",
    targetId: contactId,
    before: toJsonValue(before),
    after: toJsonValue(data)
  });

  return data;
}

export async function softDeleteContact(contactId: string) {
  const { user, supabase } = await requireAuthenticatedUser();
  const before = await getContactById(contactId);

  if (!before) {
    throw new Error("対象の contact が見つかりません");
  }

  const { error } = await supabase
    .from("contacts")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
      updated_by: user.id
    })
    .eq("id", contactId);

  if (error) {
    throw new Error(`contact の削除に失敗しました: ${error.message}`);
  }

  await recordAuditLog(supabase, {
    actor: user.id,
    action: "delete",
    targetType: "contact",
    targetId: contactId,
    before: toJsonValue(before),
    after: null
  });
}
