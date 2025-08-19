import { formatDate } from "@/shared/lib/formatDate";
import { DealExt, DealStage } from "@/entities/deal";
import { DealTableRowData } from "./model"

export function convertDealsToDealRows(deals: DealExt[]): DealTableRowData[] {
  return deals.map(
    (deal) =>
      ({
        id: deal.id,
        title: deal?.title,
        stage: deal?.stage,
        potentialValue: deal?.potentialValue,
        creatorName: deal.creator.name,
        assigneeName: deal.assignee?.name,
        clientName: deal.contact?.name,
        clientPhone: deal.contact?.phone,
        clientEmail: deal.contact?.email,
        clientOrganization: deal.contact?.organization,
        createdAt: formatDate(deal.createdAt),
        productInterest: deal.productInterest,
        actions: undefined,
      }) as DealTableRowData
  );
}
