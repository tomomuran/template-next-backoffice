"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createContact, softDeleteContact, updateContact } from "@/features/contacts/services/contacts-service";
import { type ContactFormValues } from "@/features/contacts/services/schemas";

export async function createContactAction(values: ContactFormValues) {
  await createContact(values);
  revalidatePath("/contacts");
}

export async function updateContactAction(contactId: string, values: ContactFormValues) {
  await updateContact(contactId, values);
  revalidatePath("/contacts");
  revalidatePath(`/contacts/${contactId}`);
}

export async function deleteContactAction(contactId: string) {
  await softDeleteContact(contactId);
  revalidatePath("/contacts");
}

export async function deleteContactAndRedirectAction(contactId: string) {
  await softDeleteContact(contactId);
  revalidatePath("/contacts");
  redirect("/contacts");
}
