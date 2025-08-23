import { LeadsTable } from "@/features";
import { LeadExt } from "@/entities/lead/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import Container from "node_modules/@mui/material/esm/Container/Container";

export default async function LeadsPage() {
  const leads = (await fetch(`${NEXT_PUBLIC_API_URL}/api/leads`).then((res) =>
    res.json()
  )) as LeadExt[];
  return (
    <Container maxWidth={false} component="main" style={{ padding: "0 !important" }} sx={{ pl: 0 , m: 0 }}>
      {/* <h1>Leads</h1> */}
      {<LeadsTable initialData={leads} />}
    </Container>
  );
}
