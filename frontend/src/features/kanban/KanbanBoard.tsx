"use client";

import React, { use, useEffect } from "react";
import {
  KanbanBoard as EntitiesKanbanBoard,
  KanbanStackData,
} from "@/entities/kanban/";
import type { KanbanBoardProps } from "./types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import { DealExt } from "@/entities/deal";
import Container from "@mui/material/Container";

const prepareStacks = (deals: DealExt[]): KanbanStackData[] => {
  return [
    {
      id: "QUALIFIED",
      title: "Qualified",
      cards: deals.filter((deal) => deal.stage === "QUALIFIED"),
      compact: true,
    },
    {
      id: "CONTACTED",
      title: "Contacted",
      cards: deals.filter((deal) => deal.stage === "CONTACTED"),
      compact: true,
    },
    {
      id: "DEMO_SCHEDULED",
      title: "Demo Scheduled",
      cards: deals.filter((deal) => deal.stage === "DEMO_SCHEDULED"),
      compact: true,
    },
    {
      id: "PROPOSAL_SENT",
      title: "Proposal Sent",
      cards: deals.filter((deal) => deal.stage === "PROPOSAL_SENT"),
      compact: true,
    },
    {
      id: "NEGOTIATION",
      title: "Negotiation",
      cards: deals.filter((deal) => deal.stage === "NEGOTIATION"),
      compact: true,
    },
  ];
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
  const [stacksInfo, setStacksInfo] = React.useState<KanbanStackData[]>(stacks || []);

  if (stacks && stacks.length) {
    setStacksInfo(stacks);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`${NEXT_PUBLIC_API_URL}/deals/api`)
      const result = await data.json();
      setStacksInfo(prepareStacks(result));
    };
    fetchData();
  }, []);


  return (
    <Container maxWidth={false} component="main">
      {/* <h1 style={{ marginBottom: 16 }}>Deals</h1> */}
      <EntitiesKanbanBoard
        stacks={stacksInfo}
        className={className}
        gap={gap}
        padding={padding}
      />
    </Container>
  );
};

export default KanbanBoard;
