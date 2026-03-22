import { notFound } from "next/navigation";
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
  );
}
