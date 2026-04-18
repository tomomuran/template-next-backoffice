import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuditLogRecord {
  id: string;
  actor: string;
  action: string;
  target_type: string;
  target_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  occurred_at: string;
  actor_name: string | null;
}

interface ListAuditLogsOptions {
  action?: string;
  targetType?: string;
}

export async function listAuditLogs(options: ListAuditLogsOptions = {}): Promise<AuditLogRecord[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("audit_logs")
    .select("id, actor, action, target_type, target_id, before, after, occurred_at")
    .order("occurred_at", { ascending: false })
    .limit(200);

  if (options.action) {
    query = query.eq("action", options.action);
  }

  if (options.targetType) {
    query = query.eq("target_type", options.targetType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`監査ログの取得に失敗しました: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  const actorIds = [...new Set(data.map((log) => log.actor))];
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, display_name")
    .in("id", actorIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p.display_name]) ?? []);

  return data.map((log) => ({
    ...log,
    before: log.before as Record<string, unknown> | null,
    after: log.after as Record<string, unknown> | null,
    actor_name: profileMap.get(log.actor) ?? null
  }));
}

export function getDistinctActions(): string[] {
  return ["create", "update", "delete"];
}

export function getDistinctTargetTypes(): string[] {
  return ["contact", "user_profile"];
}
