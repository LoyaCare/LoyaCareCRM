import { DealsTable } from "@/features";
import { DealExt } from "@/entities/deal/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import Container from "@mui/material/Container";
import { DealStage, DealStatus } from "@/shared/generated/prisma-client";
import { DealViewSwitcher } from "@/entities/deal";

export default async function DealsPage() {
  const status: DealStatus[] = [
    "ARCHIVED",
  ];
  const excludeStatuses: DealStatus[] = ["ACTIVE"];

  const params = ""
  new URLSearchParams({
    status: status.join(","),
    excludeStatuses: excludeStatuses.join(","),
  });
  
  const deals = (await fetch(`${NEXT_PUBLIC_API_URL}/deals/archived/api?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((res) => res.json())) as DealExt[];

  return (
    <Container 
      maxWidth={false} 
      component="main" 
      sx={{ 
        pr: 1, 
        pl: 0, 
        pt: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* <h1 style={{ marginBottom: 16 }}>Deals</h1> */}
      <DealsTable 
        initialData={deals}
        statuses={status}
        excludeStatuses={excludeStatuses}
        toolbarTitle={<DealViewSwitcher title="Deals archived" />}
        // sx={{ flex: 1, height: '100%' }}
      />
    </Container>
  );
}
