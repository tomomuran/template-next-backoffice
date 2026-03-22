"use client";

import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import type { ContactRecord } from "@/features/contacts/services/schemas";
import { contactStatusLabels, primarySampleFeature } from "@/lib/sample-features";

interface ContactTableProps {
  contacts: ContactRecord[];
}

export function ContactTable({ contacts }: ContactTableProps) {
  return (
    <DataTable
      rows={contacts}
      emptyMessage={primarySampleFeature.emptyMessage}
      searchLabel="連絡先検索"
      searchPlaceholder="名前、会社名、メール、電話番号で検索"
      csvFileName="contacts.csv"
      initialSort={{ key: "updated", direction: "desc" }}
      pageSizeOptions={[10, 25, 50, 1]}
      filters={[
        {
          key: "status",
          label: "ステータス",
          getValue: (contact) => contact.status,
          options: [
            { value: "lead", label: contactStatusLabels.lead },
            { value: "active", label: contactStatusLabels.active },
            { value: "archived", label: contactStatusLabels.archived }
          ]
        }
      ]}
      columns={[
        {
          key: "name",
          header: "Name",
          sortable: true,
          getSearchValue: (contact) =>
            [contact.last_name, contact.first_name, contact.company_name].filter(Boolean).join(" "),
          getSortValue: (contact) => `${contact.last_name} ${contact.first_name}`,
          getCsvValue: (contact) => `${contact.last_name} ${contact.first_name}`,
          render: (contact) => (
            <div>
              <Link className="font-medium text-foreground underline-offset-4 hover:underline" href={`/contacts/${contact.id}`}>
                {contact.last_name} {contact.first_name}
              </Link>
              <p className="text-xs text-muted-foreground">{contact.company_name}</p>
            </div>
          )
        },
        {
          key: "status",
          header: "Status",
          sortable: true,
          getSearchValue: (contact) => contactStatusLabels[contact.status],
          getSortValue: (contact) => contact.status,
          getCsvValue: (contact) => contactStatusLabels[contact.status],
          render: (contact) => (
            <Badge variant={contact.status === "archived" ? "warning" : "secondary"}>{contactStatusLabels[contact.status]}</Badge>
          )
        },
        {
          key: "email",
          header: "Email",
          sortable: true,
          getSearchValue: (contact) => contact.email,
          getSortValue: (contact) => contact.email,
          getCsvValue: (contact) => contact.email,
          render: (contact) => contact.email
        },
        {
          key: "phone",
          header: "Phone",
          getSearchValue: (contact) => contact.phone,
          getSortValue: (contact) => contact.phone,
          getCsvValue: (contact) => contact.phone,
          render: (contact) => contact.phone
        },
        {
          key: "updated",
          header: "Updated",
          sortable: true,
          getSortValue: (contact) => contact.updated_at,
          getCsvValue: (contact) => contact.updated_at,
          render: (contact) => new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(contact.updated_at))
        }
      ]}
    />
  );
}
