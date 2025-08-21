"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  DndContext,
  pointerWithin,
  DragEndEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanStack, KanbanCard } from "@/entities/kanban";
import type { KanbanCardData, KanbanStackData } from "@/entities/kanban";
import Paper from "@mui/material/Paper";

export type CardsByRestStages = {
  [key: string]: KanbanCardData[];
};

type Props = {
  stacks: KanbanStackData[];
  className?: string;
  gap?: number;
  padding?: number;
  onChange?: (stacks: KanbanStackData[], restStages?: CardsByRestStages) => void;
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

  // Use multiple sensors and require small movement to avoid accidental clicks
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // track currently dragged id for DragOverlay
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // ref for defence against duplicate onChange
  const pendingOnChangeRef = React.useRef<number | null>(null);

  // schedule onChange outside of render (prevents "setState during render" errors)
  const scheduleOnChange = React.useCallback(
    (next: KanbanStackData[], restStages?: CardsByRestStages) => {
      if (!onChange) return;

      // refuse previous scheduled call if exists
      if (pendingOnChangeRef.current !== null) {
        cancelAnimationFrame(pendingOnChangeRef.current);
        pendingOnChangeRef.current = null;
      }

      if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
        pendingOnChangeRef.current = window.requestAnimationFrame(() => {
          pendingOnChangeRef.current = null;
          onChange(next, restStages);
        });
      } else {
        // fallback to microtask
        Promise.resolve().then(() => onChange(next, restStages));
      }
    },
    [onChange]
  );

  // current element under pointer (can be used for highlighting)
  const [currentOverId, setCurrentOverId] = React.useState<string | null>(null);

  // onDragOver: update intermediate state while dragging between stacks
  const onDragOver = React.useCallback(
    (event: DragOverEvent) => {
      // DO not mutate local stacks here — only remember what we are over
      const { over } = event;
      setCurrentOverId(over?.id ? String(over.id) : null);
    },
    [setCurrentOverId]
  );

  // onDragEnd: finalize (ensure ordering within same stack or between stacks)
  const onDragEndInternal = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      const activeId = String(active.id);
      const overId = String(over.id);

      setLocalStacks((prev) => {
        const next = prev.map((s) => ({ ...s, cards: [...s.cards] }));

        const sourceStackIndex = next.findIndex((s) =>
          s.cards.some((c) => String(c.id) === activeId)
        );
        const destStackIndex = next.findIndex((s) =>
          s.cards.some((c) => String(c.id) === overId)
        );
        const overIsStackIndex = next.findIndex((s) => String(s.id) === overId);
        const destIndex =
          destStackIndex !== -1 ? destStackIndex : overIsStackIndex;

        if (sourceStackIndex === -1) return prev;

        // DROP TO FOOTER
        if (restStagesNames.includes(overId)) {
          const src = next[sourceStackIndex];
          const srcIndex = src.cards.findIndex(
            (c) => String(c.id) === activeId
          );
          if (srcIndex === -1) return prev;
          // remove card from source stack
          const removedCard = src.cards.splice(srcIndex, 1);
          scheduleOnChange(next, { [overId]: [removedCard[0]] });
          return next;
        }

        // // intra-stack reorder
        // if (destIndex === sourceStackIndex && destIndex !== -1) {
        //   const stack = next[sourceStackIndex];
        //   const oldIndex = stack.cards.findIndex(
        //     (c) => String(c.id) === activeId
        //   );
        //   const newIndex = stack.cards.findIndex(
        //     (c) => String(c.id) === overId
        //   );
        //   if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        //     stack.cards = arrayMove(stack.cards, oldIndex, newIndex);
        //     scheduleOnChange(next);
        //   }
        //   return next;
        // }

        // moving between stacks
        if (destIndex !== -1 && destIndex !== sourceStackIndex) {
          const src = next[sourceStackIndex];
          const dst = next[destIndex];
          const srcIndex = src.cards.findIndex(
            (c) => String(c.id) === activeId
          );
          if (srcIndex === -1) return prev;
          const [moved] = src.cards.splice(srcIndex, 1);

          const overCardIndex = dst.cards.findIndex(
            (c) => String(c.id) === overId
          );
          const insertIndex =
            overCardIndex === -1 ? dst.cards.length : overCardIndex;
          dst.cards.splice(insertIndex, 0, moved);

          scheduleOnChange(next);
          return next;
        }

        return prev;
      });
    },
    [onChange]
  );

  // simple droppable item for footer (defined inside entities so it's in same DndContext)
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
          overflowY: "auto", // Stay it for the container
          display: "flex",
          flex: 1,
        }}
      >
        <Stack
          direction="row"
          sx={{
            display: "flex",
            flex: "0 0 auto",
            minHeight: "100%", // Minimal height occupies the entire height of the parent
            alignItems: "flex-start", // Important: alignment at the top
            py: padding,
            px: padding,
            gap: (theme: any) => theme.spacing(gap),
          }}
        >
          {localStacks.map((s) => (
            <ColumnDroppable key={s.id} stack={s}>
              <SortableContext
                items={s.cards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanStack
                  title={s.title}
                  cards={s.cards}
                  renderCard={(card) => (
                    <SortableCard key={card.id} id={card.id} card={card} />
                  )}
                />
              </SortableContext>
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

        <DragOverlay>
          {activeId ? (
            // render simple overlay card (use same visual as card)
            <div style={{ width: "100%", pointerEvents: "none" }}>
              <KanbanCard
                data={
                  localStacks
                    .flatMap((s) => s.cards)
                    .find((c) => c.id === activeId) ?? {
                    id: activeId!,
                    title: "",
                    clientName: "",
                    potentialValue: 0,
                  }
                }
              />
            </div>
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
});

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
        maxHeight: "100%", // Can occupy full height, but does not stretch
        height: "auto", // Changed: height is determined by content
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column", // Explicitly set vertical direction
        overflow: "visible", // For droppable bounds
        outline: isOver ? "2px dashed rgba(0,0,0,0.08)" : "none",
      }}
    >
      {children}
    </Box>
  );
}

function SortableCard({ id, card }: { id: string; card: KanbanCardData }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
    touchAction: "none",
    WebkitUserSelect: "none",
    userSelect: "none",
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard data={card} />
    </div>
  );
}

export default KanbanBoard;
