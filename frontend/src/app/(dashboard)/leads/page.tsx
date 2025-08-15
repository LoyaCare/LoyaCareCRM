import { LeadsTable } from "@/features";
import { LeadExt } from "@/entities/lead/model/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";

async function getLeads() {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/leads/api`, {
    cache: "no-store", // Disable caching for this request
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch leads: ${response.statusText}`);
  }

  return response.json() as Promise<LeadExt[]>;
}

export default async function LeadsPage() {
  try {
    const leads = await getLeads();

    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Leads</h1>
        <LeadsTable initialData={leads} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching leads:", error);
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Leads</h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">Failed to load leads. Please try again later.</p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-red-400 text-sm mt-2">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          )}
        </div>
      </main>
    );
  }
}