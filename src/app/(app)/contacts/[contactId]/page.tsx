import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Contact Detail</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {contact.last_name} {contact.first_name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/contacts/${contact.id}/edit`}>Edit</Link>
          </Button>
          {isAdmin && <DeleteContactButton contactId={contact.id} />}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{contact.company_name}</CardTitle>
          <CardDescription>{contact.email}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{contact.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p>{contact.status}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="whitespace-pre-wrap">{contact.notes || "-"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
