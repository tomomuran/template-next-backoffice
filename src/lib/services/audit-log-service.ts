import type { SupabaseClient } from "@supabase/supabase-js";

import type { JsonValue } from "@/lib/types/json";

export interface AuditLogPayload {
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  before: JsonValue;
  after: JsonValue;
}

export function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as JsonValue;
}

export async function recordAuditLog(supabase: SupabaseClient, payload: AuditLogPayload) {
  const { error } = await supabase.from("audit_logs").insert({
    actor: payload.actor,
    action: payload.action,
    target_type: payload.targetType,
    target_id: payload.targetId,
    before: payload.before,
    after: payload.after
  });

  if (error) {
    throw new Error(`監査ログの記録に失敗しました: ${error.message}`);
  }
}
