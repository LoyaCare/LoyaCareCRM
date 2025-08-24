"use client";
import React, { useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ToggleButtonGroup,
  ToggleButton,
  Theme,
  SxProps,
  Tooltip,
} from "@mui/material";

export type ViewSwitcherElement = {
  name: string;
  path: string;
  label: string;
  icon: React.ReactNode;
};

export type ViewSwitcherProps = {
  elements: ViewSwitcherElement[];
  size?: "small" | "medium" | "large";
  ariaLabel?: string;
  sx?: SxProps<Theme>;
  className?: string;
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  elements = [],
  ariaLabel = "view mode",
  sx = { ml: 2 },
  size = "small",
  className,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Get current active view based on the path
  const getCurrentView = useCallback(() => {
    const activeElement = elements.find((element) =>
      pathname?.endsWith(element.path.split("/").pop() || "")
    );
    return activeElement ? activeElement.name : null;
  }, [elements, pathname]);

  const currentView = useMemo(getCurrentView, [getCurrentView]);

  const [view, setView] = React.useState(currentView);

  React.useEffect(() => {
    // Update local state when pathname changes
    const current = getCurrentView();
    setView(current);
  }, [pathname, getCurrentView]);

  const handleViewChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newView: string | null) => {
      if (!newView) return; // Refuse to deselect

      setView(newView);
      const activeElement = elements.find(
        (element) => element.name === newView
      );

      // Navigate to the corresponding path
      if (activeElement) {
        router.push(activeElement.path);
      }
    },
    [elements, router]
  );

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleViewChange}
      aria-label={ariaLabel}
      size={size}
      sx={sx}
    >
      {elements.map((element) => (
        <Tooltip key={element.name} title={element.label} arrow placement="top">
          <ToggleButton
            value={element.name}
            aria-label={`${element.label} view`}
            sx={{ textTransform: "none" }}
          >
            {element.icon}
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
};
