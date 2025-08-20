"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { KanbanCard } from "@/entities/kanban/KanbanCard";
import { currencyFormatter } from "@/shared/lib";
import { KanbanStackProps } from "./types";

export const KanbanStack: React.FC<KanbanStackProps> = React.memo(
  function KanbanStack({ title, cards, className, compact = false }) {
    const total = React.useMemo(
      () =>
        cards.reduce(
          (acc, c) =>
            acc + (typeof c.potentialValue === "number" ? c.potentialValue : 0),
          0
        ),
      [cards]
    );

    const formattedTotal = React.useMemo(() => {
      if (total === 0) return "";
      return currencyFormatter(total);
    }, [total]);

    return (
      <Paper
        className={className}
        variant="outlined"
        sx={{
          width: compact ? 260 : 300,
          display: "flex",
          flexDirection: "column",
          p: 1,
          height: "100%", // fill parent's height
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
            {formattedTotal ? `${formattedTotal} · ` : ""}
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </Typography>
        </Box>

        {/* <Divider sx={{ mb: 1 }} /> */}

        <Stack
          sx={{
            gap: 1,
            flex: 1, // take remaining vertical space
            minHeight: 0, // allow child to shrink/scroll in flex layout
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {cards.map((c) => (
            <KanbanCard key={c.id} data={c} />
          ))}
        </Stack>
      </Paper>
    );
  }
);