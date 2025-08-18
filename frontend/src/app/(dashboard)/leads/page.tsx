import { LeadsTable } from "@/features";
import { LeadExt } from "@/entities/lead/model/types";
import { NEXT_PUBLIC_API_URL, BACKEND_API_URL } from "@/shared/config/urls";

import {
  BaseTableProps,
  BaseTableRowData,
} from "@/features/BaseTable";
import { LeadTableRowData } from "@/features/lead/LeadsTable/model";

export default async function LeadsPage() {
  const leads = (await fetch(`${NEXT_PUBLIC_API_URL}/leads/api`).then((res) =>
    res.json()
  )) as LeadExt[];
  // const leads = (await fetch(`${BACKEND_API_URL}/leads`).then((res) =>
  //   res.json()
  // )) as LeadExt[];

  return (
    <main>
      <h1>Leads</h1>
      {<LeadsTable initialData={leads} />}
    </main>
  );
}
