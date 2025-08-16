// Update the import path to the correct location of DealsTable
import { DealsTable } from "@/features";
import { DealExt } from "@/entities/deal/model/types";
import { NEXT_PUBLIC_API_URL, BACKEND_API_URL } from "@/shared/config/urls";

export default async function DealsPage() {
  const deals = (await fetch(`${NEXT_PUBLIC_API_URL}/deals/api`).then((res) =>
    res.json()
  )) as DealExt[];
  // const deals = (await fetch(`${BACKEND_API_URL}/deals`).then((res) =>
  //   res.json()
  // )) as DealExt[];

  return (
    <main>
      <h1>Deals</h1>
      {<DealsTable initialData={deals} />}
    </main>
  );
}
