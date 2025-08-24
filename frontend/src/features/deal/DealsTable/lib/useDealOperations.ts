import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  dealApi,
  useLazyGetDealByIdQuery,
  useUpdateDealMutation,
  DealExt,
  UpdateDealDTO,
  sanitizeDealData
} from "@/entities/deal";

export function useDealOperations() {
  const dispatch = useDispatch();
  const [triggerGetDealById] = useLazyGetDealByIdQuery();
  const [updateDeal] = useUpdateDealMutation();

  const invalidateDeals = useCallback(() => {
    dispatch(dealApi.util.invalidateTags(["Deals", "Deal"]));
  }, [dispatch]);

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
      invalidateDeals();
    },
    [triggerGetDealById, updateDeal, invalidateDeals]
  );

  const handleArchive = useCallback(
    async (e: React.MouseEvent | undefined, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        update(id, (deal) => ({
          ...deal,
          status: "ARCHIVED",
        }));
      } catch (err) {
        console.error("Archive action failed", err);
      }
    },
    [update]
  );

  const handleRefreshData = useCallback(() => {
    invalidateDeals();
  }, [invalidateDeals]);

  return {
    update,
    handleArchive,
    handleRefreshData,
    invalidateDeals
  };
}