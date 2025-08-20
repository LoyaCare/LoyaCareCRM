import type { KanbanStackData } from "@/entities/kanban";

export type KanbanBoardProps = {
  stacks?: KanbanStackData[];
  className?: string;
  gap?: number;
  padding?: number;
};
