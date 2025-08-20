import { KanbanStackData } from "../KanbanStack";

export type KanbanStackProps = {
  stacks: KanbanStackData[];
  className?: string;
  gap?: number;
  padding?: number;
};
