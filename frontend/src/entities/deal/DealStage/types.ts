import {
  DealStage,
} from "@/shared/generated/prisma-client";

export type EnumDealStage = Omit<DealStage, "LEAD" | "WON" | "LOST">;

export type EnumDealStageType = EnumDealStage[keyof EnumDealStage];
