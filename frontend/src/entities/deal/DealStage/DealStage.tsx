"use client";

import * as React from "react";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import type {
  EnumDealStage
} from "@/entities/deal/";

export const DEFAULT_STAGES: EnumDealStage[] = [
  "QUALIFIED",
  "CONTACTED",
  "DEMO_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
];

/** Visible labels and MUI color mapping for stages */
const STAGE_META: Record<
  (EnumDealStage)[number],
  {
    label: string;
    color: "default" | "primary" | "success" | "warning" | "error" | "info";
  }
> = {
  QUALIFIED: { label: "Qualified", color: "info" },
  CONTACTED: { label: "Contacted", color: "primary" },
  PROPOSAL_SENT: { label: "Proposal sent", color: "primary" },
  DEMO_SCHEDULED: { label: "Demo Scheduled", color: "info" },
  NEGOTIATION: { label: "Negotiation", color: "warning" },
};

type Props = {
  stage: EnumDealStage;
  onChange?: (stage: EnumDealStage) => void;
  readOnly?: boolean;
  compact?: boolean;
  stages?: EnumDealStage[];
  className?: string;
  ariaLabel?: string;
};

export const DealStageComponent: React.FC<Props> = React.memo(function DealStage({
  stage,
  onChange,
  readOnly = false,
  compact = false,
  stages = DEFAULT_STAGES,
  className,
  ariaLabel = "Deal stage",
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (readOnly) return;
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
    },
    [readOnly]
  );

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelect = React.useCallback(
    (key: EnumDealStage) => {
      setAnchorEl(null);
      if (key !== stage) onChange?.(key);
    },
    [onChange, stage]
  );

  const meta = STAGE_META[stage as string] ?? { label: stage, color: "default" };

  return (
    <Box component="span" className={className}>
      <Chip
        size={compact ? "small" : "medium"}
        label={meta.label}
        color={meta.color}
        variant={readOnly ? "outlined" : "filled"}
        onClick={handleOpen}
        aria-haspopup={!readOnly ? "menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label={ariaLabel}
        clickable={!readOnly}
      />

      {!readOnly && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
        >
          {stages.map((s) => {
            const m = STAGE_META[s as string] ?? { label: s, color: "default" };
            return (
              <MenuItem
                key={s as string}
                selected={s === stage}
                onClick={() => handleSelect(s)}
                dense
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {s === stage ? <CheckIcon fontSize="small" /> : null}
                </ListItemIcon>
                <ListItemText primary={m.label} />
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </Box>
  );
});

export default DealStageComponent;