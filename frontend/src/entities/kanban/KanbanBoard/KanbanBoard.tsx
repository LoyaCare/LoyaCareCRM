"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  DndContext,
  pointerWithin,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { KanbanStack, KanbanCard } from "@/entities/kanban";
import type { KanbanCardData, KanbanStackData } from "@/entities/kanban";
import Paper from "@mui/material/Paper";
import {
  CardsByRestStages,
  createDndSensors,
  createChangeScheduler,
  processDragOver,
  processDragEnd,
  findCardById,
  createDraggableCardProps,
} from "./boardDndHelpers";

type Props = {
  stacks: KanbanStackData[];
  className?: string;
  gap?: number;
  padding?: number;
  onChange?: (
    stacks: KanbanStackData[],
    restStages?: CardsByRestStages
  ) => void;
  footerItems?: { id: string; label: string }[];
};

export const KanbanBoard: React.FC<Props> = React.memo(function KanbanBoard({
  stacks,
  className,
  gap = 2,
  padding = 1,
  onChange,
  footerItems,
}) {
  const [localStacks, setLocalStacks] = React.useState<KanbanStackData[]>(
    () => stacks
  );
  const restStagesNames = footerItems?.map((item) => item.id) || [];

  React.useEffect(() => {
    setLocalStacks(stacks);
  }, [stacks]);

  const sensors = createDndSensors();

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const pendingOnChangeRef = React.useRef<number | null>(null);

  const scheduleOnChange = React.useCallback(
    createChangeScheduler(onChange, pendingOnChangeRef),
    [onChange]
  );

  const [currentOverId, setCurrentOverId] = React.useState<string | null>(null);

  const onDragOver = React.useCallback(
    (event: DragOverEvent) => {
      processDragOver(event, setCurrentOverId);
    },
    [setCurrentOverId]
  );

  const onDragEndInternal = React.useCallback(
    (event: DragEndEvent) => {
      const updatedStacks = processDragEnd(
        event,
        localStacks,
        restStagesNames,
        scheduleOnChange
      );
      setLocalStacks(updatedStacks);
    },
    [localStacks, restStagesNames, scheduleOnChange]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragOver={onDragOver}
      onDragEnd={(e) => {
        setActiveId(null);
        onDragEndInternal(e);
      }}
      onDragStart={(e) => {
        setActiveId(String(e.active.id));
      }}
    >
      <Box
        className={className}
        role="region"
        aria-label="Kanban board"
        sx={{
          width: "100%",
          height: "100%",
          overflowX: "auto",
          overflowY: "auto",
          display: "flex",
          flex: 1,
        }}
      >
        <Stack
          direction="row"
          sx={{
            display: "flex",
            flex: "0 0 auto",
            // minHeight: "100%",
            alignItems: "flex-start",
            py: padding,
            px: padding,
            gap: (theme: any) => theme.spacing(gap),
          }}
        >
          {localStacks.map((s) => (
            <ColumnDroppable key={s.id} stack={s}>
              <KanbanStack
                title={s.title}
                cards={s.cards}
                renderCard={(card) => (
                  <DraggableCard key={card.id} id={card.id} card={card} />
                )}
              />
            </ColumnDroppable>
          ))}
        </Stack>

        {/* footer rendered inside entities so droppables are in same DndContext */}
        {footerItems && footerItems.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 12,
              display: activeId ? "flex" : "none",
              justifyContent: "center",
              gap: 2,
              pointerEvents: activeId ? "auto" : "none",
              zIndex: 1300,
            }}
          >
            {footerItems.map((it) => (
              <BottomDropItem key={it.id} id={it.id} label={it.label} />
            ))}
          </Box>
        )}

        <DragOverlay
          modifiers={[
            // Отключаем автоматическое масштабирование
            ({ transform }) => ({
              ...transform,
              scaleX: 1,
              scaleY: 1,
            }),
          ]}
        >
          {activeId ? (
            // Карточка БЕЗ оборачивающего div - ключевое изменение!
            <KanbanCard
              data={
                findCardById(localStacks, activeId) ?? {
                  id: activeId!,
                  title: "",
                  clientName: "",
                  potentialValue: 0,
                }
              }
            />
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
});

// We keep these components here as they are tightly coupled with the DndContext
// and need access to the context provided by the DndContext parent

// Column droppable wrapper to make empty columns targetable
function ColumnDroppable({
  stack,
  children,
}: {
  stack: KanbanStackData;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stack.id as string });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: "0 0 auto",
        minWidth: stack.width ?? (stack.compact ? 200 : 300),
        maxHeight: "100%",
        height: "auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "visible",
        outline: isOver ? "2px dashed rgba(0,0,0,0.08)" : "none",
      }}
    >
      {children}
    </Box>
  );
}

function DraggableCard({ id, card }: { id: string; card: KanbanCardData }) {
  const { attributes, listeners, setNodeRef, style } =
    createDraggableCardProps(id);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard data={card} />
    </div>
  );
}

// simple droppable item for footer
function BottomDropItem({ id, label }: { id: string; label: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Paper
      ref={setNodeRef}
      elevation={isOver ? 3 : 1}
      sx={{
        width: 160,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: isOver ? "primary.light" : "background.paper",
        border: "1px dashed rgba(0,0,0,0.08)",
        borderRadius: 1,
      }}
    >
      {label}
    </Paper>
  );
}

export default KanbanBoard;
