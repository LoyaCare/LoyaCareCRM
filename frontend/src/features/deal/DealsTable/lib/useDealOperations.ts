import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  dealApi,
  useLazyGetDealByIdQuery,
  useUpdateDealMutation,
  DealExt,
  UpdateDealDTO,
  sanitizeDealData,
} from "@/entities/deal";

export function useDealOperations() {
  const dispatch = useDispatch();
  const [triggerGetDealById] = useLazyGetDealByIdQuery();
  const [updateDeal] = useUpdateDealMutation();

  const invalidateDeals = useCallback(() => {
    dispatch(dealApi.util.invalidateTags(["Deals", "Deal"]));
    console.log("Invalidated deals");
  }, [dispatch, dealApi]);

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
      const preparedUpdate = sanitizeDealData(updatedData);
      const body: UpdateDealDTO = {
        ...preparedUpdate,
      };
      console.log("Updating deal with id:", id, "and body:", body);
      await updateDeal({ id, body }).unwrap();
    },
    [triggerGetDealById, updateDeal]
  );

  const archiveDeal = useCallback(
    async (id: string) =>
      await update(id, (deal) => ({
        ...deal,
        status: "ARCHIVED",
      })),
    [update]
  );

  const handleArchive = useCallback(
    async (e: React.MouseEvent | undefined, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        await archiveDeal(id);
        invalidateDeals();
      } catch (err) {
        console.error("Archive action failed", err);
      }
    },
    [archiveDeal, invalidateDeals]
  );

  const handleArchives = useCallback(
    async (e: React.MouseEvent | undefined, id?: readonly string[]) => {
      e?.stopPropagation();
      if (!id || !id.length) return;
      try {
        await Promise.all(id.map((id) => archiveDeal(id)));
        invalidateDeals();
      } catch (err) {
        console.error("Archive action failed", err);
      }
    },
    [update, invalidateDeals]
  );

  const restoreDeal = useCallback(
    async (id: string) =>
      await update(id, (deal) => ({
        ...deal,
        status: "ACTIVE",
      })),
    [update]
  );

  const handleRestore = useCallback(
    async (e?: React.MouseEvent, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        await restoreDeal(id);
        invalidateDeals();
      } catch (err) {
        console.error("Restore action failed", err);
      }
    },
    [restoreDeal, invalidateDeals]
  );

  const handleRestores = useCallback(
    async (e?: React.MouseEvent, id?: readonly string[]) => {
      e?.stopPropagation();
      if (!id || !id.length) return;
      try {
        await Promise.all(id.map((id) => restoreDeal(id)));
        invalidateDeals();
      } catch (err) {
        console.error("Restore action failed", err);
      }
    },
    [restoreDeal, invalidateDeals]
  );

  const handleRefreshData = useCallback(() => {
    invalidateDeals();
  }, [invalidateDeals]);

  return {
    update,
    handleArchive,
    handleArchives,
    handleRestore,
    handleRestores,
    handleRefreshData,
    invalidateDeals,
  };
}
