"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  BaseTable,
  BaseTableProps,
  SortableFields,
} from "@/features/BaseTable";
import { 
  UserExt, 
  UserStatus, 
  UserStatusFilter,
  UserViewSwitcher,
  useGetUsersQuery 
} from "@/entities/user";
import { useEntityDialog } from "@/shared/lib";
import { UserTableRowData } from "../model/types";
import { userTableColumns } from "../model/columns";
import { mapUsersToUserRows } from "../lib/mappers";
import { useUserOperations } from "../lib/useUserOperations";
import { useTableActions } from "../lib/useTableActions";
import { useUserRowActions } from "../lib/useUserRowActions";
import { UsersTableToolbar } from "./UsersTableToolbar";
import { UsersTableHead } from "./UsersTableHead";

// Dynamically import the edit dialog
const UserEditDialog = dynamic(
  () =>
    import("@/features/user/UserEditDialog").then((mod) => mod.UserEditDialog),
  { ssr: false }
);

const headerTitles: Record<UserStatusFilter, string> = {
  ACTIVE: "Active users",
  ALL: "All users",
  BLOCKED: "Blocked users",
  INACTIVE: "Inactive users"
};

export interface UsersTableProps
  extends Omit<BaseTableProps<UserExt, UserTableRowData>, "initialData"> {
  initialData?: UserExt[];
  status?: UserStatus;
}

export function UsersTable({
  initialData = [],
  order = "asc",
  orderBy = "name" as SortableFields<UserTableRowData>,
  sx,
  status,
}: UsersTableProps) {
  // Local state for status filter
  const [statusFilter, setStatusFilter] = React.useState<UserStatusFilter>(
    status || 'ACTIVE'
  );

  // Update local state when status prop changes
  React.useEffect(() => {
    setStatusFilter(status || 'ACTIVE');
  }, [status]);

  // Hooks for handling dialogs and actions
  const {
    entityId: clickedId,
    handleEditClick: handleEditDialogOpen,
    handleCreateClick,
    handleDialogClose,
    showDialog,
  } = useEntityDialog();

  const { handleBlock, handleUnblock, handleRefreshData } = useUserOperations();

  const { handleDeleteClick, isDeleting } = useTableActions();

  // Create row actions using custom hook
  const { rowActionMenuItemsCreator } = useUserRowActions({
    onEdit: handleEditDialogOpen,
    onBlock: handleBlock,
    onUnblock: handleUnblock,
  });

  // Get user data
  const { data: users = initialData } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  //  Filtering users by status
  const filteredUsers = React.useMemo(() => {
    if (statusFilter === 'ALL') return users;
    return users.filter((user) => user.status === statusFilter);
  }, [users, statusFilter]);

  // Handle status filter change
  const handleStatusFilterChange = React.useCallback((filter: UserStatusFilter) => {
    setStatusFilter(filter);
    headerTitles[filter];
  }, []);

  const headerTitle = useMemo(() => headerTitles[statusFilter], [statusFilter]);

  return (
    <>
      <BaseTable
        initialData={filteredUsers}
        order={order}
        orderBy={orderBy}
        columnsConfig={userTableColumns}
        TableToolbarComponent={({ selected }) => (
          <UsersTableToolbar
            title={
              <UserViewSwitcher
                title={headerTitle}
                value={statusFilter}
                onChange={handleStatusFilterChange}
              />
            }
            selected={selected}
            onCreateClick={handleCreateClick}
            onRefreshClick={handleRefreshData}
            onDeleteClick={handleDeleteClick}
            isDeleting={isDeleting}
          />
        )}
        TableHeadComponent={UsersTableHead}
        rowMapper={mapUsersToUserRows}
        rowActionMenuItemsCreator={rowActionMenuItemsCreator}
        sx={sx}
      />
      {showDialog && (
        <UserEditDialog
          id={clickedId || undefined}
          open={true}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}
