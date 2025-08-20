// "use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { KanbanStack } from "@/entities/kanban/KanbanStack";

import { KanbanStackProps } from "./types";

export const KanbanBoard: React.FC<KanbanStackProps> = ({
  stacks,
  className,
  gap = 2,
  padding = 1,
}) => {
  return (
    <Box
      className={className}
      role="region"
      aria-label="Kanban board"
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Stack
        direction="row"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          py: padding,
          px: padding,
          // allow horizontal scrolling of stacks while keeping them laid out in a row
          minWidth: "100%",
          // use CSS gap (theme spacing) to ensure consistent spacing between stacks
          gap: (theme: any) => theme.spacing(gap),
        }}
      >
        {stacks.map((s, idx) => (
          <Box
            key={s.id ?? `${s.title}-${idx}`}
            sx={{
              flex: "0 0 auto",
              width: s.width ?? (s.compact ? 260 : 300),
            }}
          >
            <KanbanStack
              title={s.title}
              cards={s.cards}
              compact={!!s.compact}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
