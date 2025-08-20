import React from "react";
// import { DealsTable } from "@/features";
// import { DealExt } from "@/entities/deal/types";
// import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import Container from "@mui/material/Container";
import { KanbanBoard } from "@/features/kanban/KanbanBoard";
import Box from "@mui/material/Box";

export default async function KanbanDealsPage() {
  //   const deals = (await fetch(`${NEXT_PUBLIC_API_URL}/deals/api`).then((res) =>
  //     res.json()
  //   )) as DealExt[];

  //   const kanbanCards = deals.slice(0, 6).map((deal) => ({
  //     id: deal.id,
  //     title: deal.title,
  //     clientName: deal.contact.name,
  //     potentialValue: deal.potentialValue,
  //   }));

  return (
    <Container
      maxWidth={false}
      component="main"
      disableGutters={true}
      sx={{
        p: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
      style={{ paddingLeft: "0 !important"}}
    >
      <Box
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
        }}
      >
        <h1 style={{ marginBottom: 16 }}>Deals</h1>
        <KanbanBoard stacks={[]} gap={3} padding={1} />
      </Box>
    </Container>
  );
}
