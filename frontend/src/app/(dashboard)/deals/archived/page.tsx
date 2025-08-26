import { ArchivedDealsTable } from "@/features/deal";
import { DealExt } from "@/entities/deal/model/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import { DealStatus } from "@/shared/generated/prisma-client";

export default async function DealsPage() {
  const params = "";
  new URLSearchParams({
    status: "ARCHIVED",
    excludeStatuses: "ACTIVE",
  });

  const deals = (await fetch(
    `${NEXT_PUBLIC_API_URL}/api/deals/archived?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json())) as DealExt[];

  return <ArchivedDealsTable initialData={deals} />;
}
