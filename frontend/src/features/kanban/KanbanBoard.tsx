"use client";

import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  CardsByRestStages,
  KanbanBoard as EntitiesKanbanBoard,
  KanbanStackData,
} from "@/entities/kanban/";
import Container from "@mui/material/Container";
import {
  dealApi,
  DealExt,
  prepareToUpdate,
  UpdateDealDTO,
  useGetDealsQuery,
  useLazyGetDealByIdQuery,
  useUpdateDealMutation,
} from "@/entities/deal";
import { DealStage, DealStatus } from "@/shared/generated/prisma-client";
import {
  createKanbanCard,
  prepareStacks,
  moveCardToStage,
  processKanbanChanges
} from "./lib";

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
  stacks: incomingStacks,
  className,
  gap = 2,
  padding = 1,
}) => {
  const needToFetchData = !incomingStacks || incomingStacks.length === 0;

  // load data only if needed
  const { data: deals = [] } = useGetDealsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    skip: !needToFetchData,
  }) as { data: DealExt[] };

  // Memoize the calculation of stacks to avoid unnecessary recomputations
  const dealStacks = React.useMemo(() => {
    // If ready-made stacks are provided, use them
    if (incomingStacks?.length) {
      return incomingStacks;
    }
    // Otherwise, create from deals
    return prepareStacks(deals || []);
  }, [incomingStacks, deals]);

  // Local state for working with data
  const [stacksInfo, setStacksInfo] = React.useState<KanbanStackData[]>([]);
  const dispatch = useDispatch();
  const [triggerGetDealById] = useLazyGetDealByIdQuery();
  const [updateDeal] = useUpdateDealMutation();

  // Update state when data source changes
  useEffect(() => {
    if (dealStacks.length) {
      setStacksInfo(dealStacks);
    }
  }, [dealStacks]);

  const footerItems: { id: DealStage | DealStatus; label: string }[] = [
    { id: "LOST", label: "LOST" },
    { id: "WON", label: "WON" },
    { id: "ARCHIVED", label: "ARCHIVED" },
  ];

  const update = useCallback(
    async (id: string, updateData: (deal: DealExt) => UpdateDealDTO) => {
      const getResult = await triggerGetDealById(id);
      const deal = ("data" in getResult ? getResult.data : undefined) as
        | DealExt
        | undefined;
      if (!deal) {
        console.error("Deal not found for id", id);
        return;
      }

      const updatedData = updateData(deal);
      const preparedUpdate = prepareToUpdate(updatedData);
      const body: UpdateDealDTO = {
        ...preparedUpdate,
      };
      console.log("Updating deal with id:", id, "and body:", body);
      await updateDeal({ id, body }).unwrap();
      dispatch(dealApi.util.invalidateTags(["Deals"]));
    },
    [triggerGetDealById, updateDeal, dispatch]
  );

  const moveCardToRestStage = useCallback(
    (stage: string, id: string) => {
      moveCardToStage(stage, id, update);
    },
    [update]
  );
  
  const handleChange = useCallback(
    (newStacks: KanbanStackData[], restStages?: CardsByRestStages) => {
      // Process all changes using the utility function
      processKanbanChanges(
        stacksInfo,
        newStacks,
        restStages,
        moveCardToRestStage,
        update
      );

      // Save new state
      setStacksInfo(newStacks);
    },
    [stacksInfo, moveCardToRestStage, update]
  );

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
        height: "100%", // Занимает всю высоту родителя
        overflow: "hidden", // Важно для вложенного скролла
        flex: 1,
        position: "relative",
      }}
    >
      <EntitiesKanbanBoard
        stacks={stacksInfo}
        className={className}
        gap={gap}
        padding={padding}
        onChange={handleChange}
        footerItems={footerItems}
      />
    </Container>
  );
};

export default KanbanBoard;
