import { DealsList } from "@/entities/deal/ui/DealsList";
import { DealExt } from "@/entities/deal/model/types";
import { API_URL } from "@/shared/config";

export default async function DealsPage() {
  const deals = await fetch(`${API_URL}/deals`).then(res => res.json()) as DealExt[];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Deals</h1>
      <DealsList initialDeals={deals} />
    </main>
  );
}