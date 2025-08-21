import { DealsTable } from "@/features";
import { DealExt } from "@/entities/deal/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import Container from "@mui/material/Container";

export default async function DealsPage() {
  const deals = (await fetch(`${NEXT_PUBLIC_API_URL}/deals/api`).then((res) =>
    res.json()
  )) as DealExt[];

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
        // sx={{ flex: 1, height: '100%' }}
      />
    </Container>
  );
}
