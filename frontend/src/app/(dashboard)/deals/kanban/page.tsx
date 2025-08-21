import React from "react";
import Container from "@mui/material/Container";
import { KanbanBoard } from "@/features/kanban/KanbanBoard";
import Box from "@mui/material/Box";

export default async function KanbanDealsPage() {
  return (
    <Container
      maxWidth={false}
      component="main"
      disableGutters={true}
      sx={{
        p: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden", // Prevents double scroll
      }}
      style={{ paddingLeft: "0 !important"}}
    >
      {/* Фиксированный заголовок */}
      <Box
        sx={{
          p: 2, 
          pb: 0,
          flexShrink: 0, // Prevents header from shrinking
        }}
      >
        <h1 style={{ margin: 0, marginBottom: '16px' }}>Deals</h1>
      </Box>

      {/* Container for KanbanBoard with scroll */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1, // Stretch to fill available space
          overflow: "hidden", // Necessary for proper flexbox + scroll behavior
          position: "relative", // Needed for correct content height calculation
        }}
      >
        {/* KanbanBoard with scroll */}
        <KanbanBoard
          gap={3}
          padding={1} 
        />
      </Box>
    </Container>
  );
}
