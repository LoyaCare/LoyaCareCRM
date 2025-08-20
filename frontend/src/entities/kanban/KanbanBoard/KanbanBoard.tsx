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
        display: "flex",
        flex: 1,
        overflowX: "auto",
      }}
    >
      <Stack
        direction="row"
        sx={{
          display: "flex",
          alignItems: "stretch",
          py: padding,
          px: padding,
          flex: "1",
          gap: (theme: any) => theme.spacing(gap),
        }}
      >
        {stacks.map((s, idx) => (
          <Box
            key={s.id ?? `${s.title}-${idx}`}
            sx={{
              flex: "1",
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
