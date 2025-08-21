"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { KanbanCard } from "@/entities/kanban";
import { KanbanStackProps } from "./types";
import { currencyFormatter } from "@/shared/lib";

export const KanbanStack: React.FC<KanbanStackProps> = React.memo(
  function KanbanStack({
    title,
    cards,
    className,
    compact = true,
    renderCard,
  }) {
    const total = React.useMemo(
      () =>
        cards.reduce(
          (acc, c) =>
            acc + (typeof c.potentialValue === "number" ? c.potentialValue : 0),
          0
        ),
      [cards]
    );

    const formattedTotal = React.useMemo(
      () => currencyFormatter(total),
      [total]
    );

    return (
      <Paper
        className={className}
        variant="outlined"
        sx={{
          // width: compact ? 200 : 300,
          display: "flex",
          flexDirection: "column",
          p: 1,
          height: "100%",
          boxSizing: "border-box",
          bgcolor: (theme: any) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : theme.palette.grey[100],
        }}
      >
        <Box sx={{ mb: 1, pl: 1.2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, lineHeight: 1.1 }}
          >
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formattedTotal}
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Stack
          sx={{
            gap: 1,
            flex: 1,
            minHeight: 0,
            overflowX: "visible",
            overflowY: "clip",
            alignSelf: "stretch",
            pr: 0.5,
          }}
        >
          {cards.map((c, i) =>
            renderCard ? renderCard(c, i) : <KanbanCard key={c.id} data={c} />
          )}
        </Stack>
      </Paper>
    );
  }
);

export default KanbanStack;
