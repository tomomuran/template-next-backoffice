import { ContactForm } from "@/features/contacts/components/contact-form";
import { createContactAction } from "@/features/contacts/actions";

export default function NewContactPage() {
  return <ContactForm mode="create" submitAction={createContactAction} />;
}
