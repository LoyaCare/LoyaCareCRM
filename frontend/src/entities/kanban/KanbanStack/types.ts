import { KanbanCardData } from "@/entities/kanban/KanbanCard";

export type KanbanStackProps = {
  title: string;
  cards: KanbanCardData[];
  className?: string;
  compact?: boolean;
};