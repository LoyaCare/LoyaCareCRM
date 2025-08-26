import { DealExt } from "@/entities/deal/model/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import { WonLostDealsTable } from "@/features/deal";

export default async function LostDealsPage() {
  const deals = (await fetch(
    `${NEXT_PUBLIC_API_URL}/api/deals/lost`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json())) as DealExt[];

  return <WonLostDealsTable initialData={deals} isWon={false} />;
}
