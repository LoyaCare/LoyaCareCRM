import { DealsTable } from "@/features";
import { DealExt } from "@/entities/deal/model/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import Container from "@mui/material/Container";

export default async function DealsPage() {
  const deals = (await fetch(`${NEXT_PUBLIC_API_URL}/deals/api`).then((res) =>
    res.json()
  )) as DealExt[];

  return (
    <Container maxWidth={false} component="main">
      <h1 style={{ marginBottom: 16 }}>Deals</h1>
      <DealsTable initialData={deals} />
    </Container>
  );
}
