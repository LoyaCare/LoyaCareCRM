import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  userApi,
  useBlockUserMutation,
  useUnblockUserMutation,
} from "@/entities/user";

export function useUserOperations() {
  const dispatch = useDispatch();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();

  const invalidateUsers = useCallback(() => {
    dispatch(userApi.util.invalidateTags(["Users"]));
  }, [dispatch]);

  const handleBlock = useCallback(
    async (e: React.MouseEvent | undefined, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        await blockUser(id).unwrap();
      } catch (err) {
        console.error("Block action failed", err);
      }
    },
    [blockUser]
  );

  const handleUnblock = useCallback(
    async (e: React.MouseEvent | undefined, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        await unblockUser(id).unwrap();
      } catch (err) {
        console.error("Unblock action failed", err);
      }
    },
    [unblockUser]
  );

  const handleRefreshData = useCallback(() => {
    invalidateUsers();
  }, [invalidateUsers]);

  return {
    handleBlock,
    handleUnblock,
    handleRefreshData,
    invalidateUsers
  };
}