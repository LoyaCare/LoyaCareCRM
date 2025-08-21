"use client";

import React, { useEffect } from "react";
import {
  KanbanBoard as EntitiesKanbanBoard,
  KanbanStackData,
} from "@/entities/kanban/";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import { DealExt } from "@/entities/deal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useDroppable } from "@dnd-kit/core";

const createKanbanCard = (deal: DealExt) => ({
  id: deal.id,
  title: deal.title,
  clientName: deal.contact?.name ?? "",
  potentialValue: deal.potentialValue,
});

const prepareStacks = (deals: DealExt[]): KanbanStackData[] => {
  return [
    {
      id: "QUALIFIED",
      title: "Qualified",
      cards: deals.filter((deal) => deal.stage === "QUALIFIED").map(createKanbanCard),
      compact: true,
    },
    {
      id: "CONTACTED",
      title: "Contacted",
      cards: deals.filter((deal) => deal.stage === "CONTACTED").map(createKanbanCard),
      compact: true,
    },
    {
      id: "DEMO_SCHEDULED",
      title: "Demo Scheduled",
      cards: deals.filter((deal) => deal.stage === "DEMO_SCHEDULED").map(createKanbanCard),
      compact: true,
    },
    {
      id: "PROPOSAL_SENT",
      title: "Proposal Sent",
      cards: deals.filter((deal) => deal.stage === "PROPOSAL_SENT").map(createKanbanCard),
      compact: true,
    },
    {
      id: "NEGOTIATION",
      title: "Negotiation",
      cards: deals.filter((deal) => deal.stage === "NEGOTIATION").map(createKanbanCard),
      compact: true,
    },
  ];
};

export type KanbanBoardProps = {
  stacks?: KanbanStackData[];
  className?: string;
  gap?: number;
  padding?: number;
};

/**
 * Feature-level wrapper around entities/kanban KanbanBoard.
 * Accepts stacks data and forwards to the entities component.
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  stacks,
  className,
  gap = 2,
  padding = 1,
}) => {
  const [stacksInfo, setStacksInfo] = React.useState<KanbanStackData[]>(
    stacks || []
  );

  useEffect(() => {
    if (stacks && stacks.length) {
      setStacksInfo(stacks);
    }
  }, [stacks]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`${NEXT_PUBLIC_API_URL}/deals/api`);
      const result = await data.json();
      setStacksInfo(prepareStacks(result));
    };
    fetchData();
  }, []);

  const footerItems = [
    { id: "DELETE", label: "DELETE" },
    { id: "LOST", label: "LOST" },
    { id: "WON", label: "WON" },
    { id: "OTHER", label: "OTHER" },
  ];

  return (
    <Container
      maxWidth={false}
      component="main"
      sx={{
        p: 0,
        display: "flex",
        alignItems: "stretch",
        paddingLeft: "0 !important",
        paddingRight: "0 !important",
        flex: 1,
        position: "relative", // required so footer absolute positions relative to container
      }}
    >
      <EntitiesKanbanBoard
        stacks={stacksInfo}
        className={className}
        gap={gap}
        padding={padding}
        onChange={(newStacks, restStages) => {
          setStacksInfo(newStacks);
          console.log("KanbanBoard onChange", newStacks, restStages);
        }}
        footerItems={footerItems}
      />
    </Container>
  );
};

export default KanbanBoard;
