import { ArchivedDealsTable, WonLostDealsTable } from "@/features/deal";
import { DealExt } from "@/entities/deal/model/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";

export default async function WonDealsPage() {

  const deals = (await fetch(`${NEXT_PUBLIC_API_URL}/api/deals/won`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())) as DealExt[];

  return <WonLostDealsTable initialData={deals} isWon={true} />;
}
