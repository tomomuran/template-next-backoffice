import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactTable } from "@/features/contacts/components/contact-table";
import { listContacts } from "@/features/contacts/services/contacts-service";

export default async function ContactsPage() {
  const contacts = await listContacts();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground">一覧 / 詳細 / 作成 / 編集 のサンプル</p>
        </div>
        <Button asChild>
          <Link href="/contacts/new">New Contact</Link>
        </Button>
      </div>
      <ContactTable contacts={contacts} />
    </div>
  );
}
