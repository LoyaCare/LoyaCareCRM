import { LeadsTable } from "@/entities/lead/ui/LeadsTable";
import { BACKEND_API_URL } from "@/shared/config/urls";
import { LeadExt } from "@/features/lead/model/types";


export default async function LeadsPage() {

  const leads = (await fetch(`${BACKEND_API_URL}/leads`).then((res) =>
    res.json()
  )) as LeadExt[];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      {<LeadsTable initialLeads={leads} />}
    </main>
  );
}
