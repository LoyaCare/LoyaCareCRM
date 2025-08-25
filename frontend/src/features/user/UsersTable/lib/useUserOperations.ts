import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  userApi,
  useBlockUserMutation,
  useUnblockUserMutation,
  useUpdateUserStatusMutation,
} from "@/entities/user";
import { UserStatus } from "@/entities/user/model/types";

export function useUserOperations() {
  const dispatch = useDispatch();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();

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

  const handleStatusChange = useCallback(
    async (e: React.MouseEvent | undefined, id: string, status: UserStatus) => {
      e?.stopPropagation();
      try {
        await updateUserStatus({ id, status }).unwrap();
      } catch (err) {
        console.error("Status change failed", err);
      }
    },
    [updateUserStatus]
  );

  return {
    handleBlock,
    handleUnblock,
    handleRefreshData,
    handleStatusChange,
    invalidateUsers
  };
}