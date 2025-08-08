import prisma from "@/prisma/client";
import { LeadsList } from "@/entities/lead/ui/LeadsList";
import { API_URL } from "@/shared/config";
import { LeadExt } from "@/entities/lead/model/types";


export default async function LeadsPage() {

  const leads = await fetch(`${API_URL}/leads`).then(res => res.json()) as LeadExt[];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      {<LeadsList initialLeads={leads} />}
    </main>
  );
}
