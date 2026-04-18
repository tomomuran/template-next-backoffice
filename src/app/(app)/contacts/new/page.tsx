import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/features/contacts/components/contact-form";
import { createContactAction } from "@/features/contacts/actions";

export default function NewContactPage() {
  return (
    <div>
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-7 w-7">
            <Link href="/contacts">
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <h1 className="text-[21px] font-semibold tracking-[-0.022em]">New Contact</h1>
        </div>
      </div>
      <div className="p-5">
        <ContactForm mode="create" submitAction={createContactAction} />
      </div>
    </div>
  );
}
