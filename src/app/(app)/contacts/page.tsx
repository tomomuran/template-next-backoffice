import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ContactTable } from "@/features/contacts/components/contact-table";
import { listContacts } from "@/features/contacts/services/contacts-service";

export default async function ContactsPage() {
  const contacts = await listContacts();

  return (
    <div>
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[21px] font-semibold tracking-[-0.022em]">Contacts</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {contacts.length} 件
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button size="sm" asChild>
              <Link href="/contacts/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New Contact
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="p-5">
        <ContactTable contacts={contacts} />
      </div>
    </div>
  );
}
