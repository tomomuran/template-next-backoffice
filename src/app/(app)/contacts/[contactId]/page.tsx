import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PencilSimple, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteContactButton } from "@/features/contacts/components/delete-contact-button";
import { getContactById } from "@/features/contacts/services/contacts-service";
import { getCurrentUserProfile } from "@/lib/auth/require-user";

interface ContactDetailPageProps {
  params: Promise<{
    contactId: string;
  }>;
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const { contactId } = await params;
  const [contact, profile] = await Promise.all([getContactById(contactId), getCurrentUserProfile()]);

  if (!contact) {
    notFound();
  }

  const isAdmin = profile?.role === "admin";
  const fullName = `${contact.last_name} ${contact.first_name}`;

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="h-7 w-7">
            <Link href="/contacts">
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-[21px] font-semibold tracking-[-0.02em]">{fullName}</h1>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-muted-foreground">
                {contact.id.slice(0, 8)}
              </span>
              <Badge variant="outline">{contact.status}</Badge>
            </div>
            <div className="mt-1 flex gap-3.5 text-[13.5px] text-muted-foreground">
              {contact.company_name && <span>{contact.company_name}</span>}
              {contact.email && (
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12.5px]">
                  {contact.email}
                </span>
              )}
              {contact.phone && (
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12.5px]">
                  {contact.phone}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${contact.email}`}>
                <EnvelopeSimple className="h-3.5 w-3.5" />
                Email
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/contacts/${contact.id}/edit`}>
                <PencilSimple className="h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
            {isAdmin && <DeleteContactButton contactId={contact.id} />}
          </div>
        </div>
      </div>

      {/* Body: 2 columns */}
      <div className="grid min-h-[500px] grid-cols-1 md:grid-cols-[1fr_300px]">
        {/* Left: notes / activity placeholder */}
        <div className="border-r border-border p-5">
          <div className="mb-4">
            <span className="rounded-md bg-surface-2 px-2.5 py-1.5 text-[13px] font-medium text-foreground">
              Notes
            </span>
          </div>

          {/* Notes */}
          <div className="rounded-lg border border-border bg-background p-2.5">
            <div className="min-h-[60px] whitespace-pre-wrap text-sm text-muted-foreground">
              {contact.notes || "メモはありません"}
            </div>
          </div>
        </div>

        {/* Right: properties */}
        <div className="bg-background p-4">
          <div className="mb-2.5 text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
            Properties
          </div>
          {[
            ["ステータス", contact.status],
            ["会社", contact.company_name || "-"],
            ["メール", contact.email],
            ["電話", contact.phone || "-"],
            ["更新", contact.updated_at ? new Date(contact.updated_at).toLocaleDateString("ja-JP") : "-"],
            ["作成", contact.created_at ? new Date(contact.created_at).toLocaleDateString("ja-JP") : "-"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="grid grid-cols-[80px_1fr] items-center border-b border-border py-2 text-[13px]"
            >
              <span className="text-muted-foreground">{k}</span>
              <span className="text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
