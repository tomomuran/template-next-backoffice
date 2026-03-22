export const contactStatusLabels = {
  lead: "Lead",
  active: "Active",
  archived: "Archived"
} as const;

export const primarySampleFeature = {
  key: "contacts",
  label: "Contacts",
  singularLabel: "Contact",
  href: "/contacts",
  newHref: "/contacts/new",
  emptyMessage: "contacts はまだありません。Supabase local を reset して seed から作業を始めてください。",
  homeTitle: "Contacts CRUD",
  homeDescription: "一覧 / 詳細 / 作成 / 編集 のサンプル feature を `contacts` で揃えます。",
  dashboardDescription: "Supabase local と contacts サンプル feature を使って検証します。"
} as const;
