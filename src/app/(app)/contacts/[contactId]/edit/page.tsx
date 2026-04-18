import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { updateContactAction } from "@/features/contacts/actions";
import { ContactForm } from "@/features/contacts/components/contact-form";
import { getContactById } from "@/features/contacts/services/contacts-service";

interface EditContactPageProps {
  params: Promise<{
    contactId: string;
  }>;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { contactId } = await params;
  const contact = await getContactById(contactId);

  if (!contact) {
    notFound();
  }

  return (
    <div>
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-7 w-7">
            <Link href={`/contacts/${contact.id}`}>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <h1 className="text-[21px] font-semibold tracking-[-0.022em]">
            {contact.last_name} {contact.first_name} を編集
          </h1>
        </div>
      </div>
      <div className="p-5">
        <ContactForm
          mode="edit"
          submitAction={updateContactAction.bind(null, contact.id)}
          defaultValues={{
            firstName: contact.first_name,
            lastName: contact.last_name,
            companyName: contact.company_name,
            email: contact.email,
            phone: contact.phone,
            status: contact.status,
            notes: contact.notes ?? ""
          }}
        />
      </div>
    </div>
  );
}
