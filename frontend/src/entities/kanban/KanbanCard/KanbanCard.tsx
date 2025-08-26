"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { currencyFormatter } from "@/shared/lib";
import { KanbanCardData } from "./types";

export type Props = {
  data: KanbanCardData;
  className?: string;
  backgroundColor?: string;
};

export const KanbanCard: React.FC<Props> = React.memo(function KanbanCard({
  data,
  className,
  backgroundColor,
}) {
  const formattedValue = currencyFormatter(data.potentialValue);

  return (
    <Card 
      variant="outlined" 
      className={className} 
      sx={{ 
        minWidth: 200,
        position: "relative",
        transition: "background-color 0.2s ease",
      }}
    >
      {/* Цветной оверлей */}
      {backgroundColor && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: backgroundColor,
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
      <CardContent
        sx={{
          py: 1,
          px: 1.25,
          position: "relative",
          zIndex: 2,
          "&:last-child": {
            pb: 1,
          },
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
            noWrap
            title={"Title"}
          >
            {data.title ?? ""}
          </Typography>

          {data.clientName ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
              noWrap
              title={"Client Name"}
            >
              {data.clientName}
            </Typography>
          ) : null}

          {formattedValue ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
              noWrap
              title={"Potential Value"}
            >
              {formattedValue}
            </Typography>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
});
