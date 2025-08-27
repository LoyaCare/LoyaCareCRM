import React from "react";
import Container from "@mui/material/Container";
import { KanbanBoard } from "@/features/kanban/KanbanBoard";
import Box from "@mui/material/Box";
import { DealViewSwitcher } from "@/entities/deal/DealViewSwitcher";

export default async function KanbanDealsPage() {
  return (
    <Container
      maxWidth={false}
      component="main"
      disableGutters={true}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden", // Prevents double scroll
      }}
      style={{ paddingLeft: "0 !important" }}
    >
      {/* Fixed header */}
      <Box
        sx={{
          p: 0,
          flexShrink: 0, // Prevents header from shrinking
        }}
      >
        <DealViewSwitcher title="Deals kanban board" />
      </Box>

      {/* Container for KanbanBoard with scroll */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1, // Stretch to fill available space
          mt: 2, // Margin top for spacing
          overflow: "hidden", // Necessary for proper flexbox + scroll behavior
          position: "relative", // Needed for correct content height calculation
        }}
      >
        {/* KanbanBoard with scroll */}
        <KanbanBoard gap={3} padding={0} />
      </Box>
    </Container>
  );
}
