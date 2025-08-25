"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  BaseTable,
  BaseTableProps,
  SortableFields,
  ActionMenuItemProps,
} from "@/features/BaseTable";
import {
  UserExt,
  UserStatus,
  useGetUsersQuery,
} from "@/entities/user";
import { UserTableRowData } from "../model/types";
import { userTableColumns } from "../model/columns";
import { mapUsersToUserRows } from "../lib/mappers";
import { UsersTableToolbar } from "./UsersTableToolbar";
import { UsersTableHead } from "./UsersTableHead";
import { useEntityDialog } from "@/shared/lib/hooks";
import { useUserOperations } from "../lib/useUserOperations";
import { useTableActions } from "../lib/useTableActions";

import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";

// Динамически импортируем диалог редактирования
const UserEditDialog = dynamic(
  () =>
    import("@/features/user/UserEditDialog").then(
      (mod) => mod.UserEditDialog
    ),
  { ssr: false }
);

export interface UsersTableProps extends Omit<BaseTableProps<UserExt, UserTableRowData>, 'initialData'> {
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
  // Хуки для обработки диалогов и действий
  const {
    entityId: clickedId,
    handleEditClick: handleEditDialogOpen,
    handleCreateClick,
    handleDialogClose,
    showDialog
  } = useEntityDialog();
  
  const {
    handleBlock,
    handleUnblock,
    handleRefreshData
  } = useUserOperations();
  
  const { handleDeleteClick, isDeleting } = useTableActions();

  // Получение данных пользователей
  const { data: users = initialData } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Фильтрация пользователей по статусу
  const filteredUsers = React.useMemo(() => {
    if (!status) return users;
    return users.filter(user => user.status === status);
  }, [users, status]);

  // Формирование элементов меню действий
  const rowActionMenuItems: ActionMenuItemProps[] = React.useMemo(
    () => [
      {
        element: "Edit",
        icon: <EditIcon fontSize="small" />,
        onClick: handleEditDialogOpen,
      },
      // {
      //   element: "Block/Unblock",
      //   icon: (row: UserTableRowData) => 
      //     row.status === "ACTIVE" 
      //       ? <BlockIcon fontSize="small" /> 
      //       : <LockOpenIcon fontSize="small" />,
      //   onClick: (e: React.MouseEvent, id?: string, row?: UserTableRowData) => {
      //     if (row?.status === "ACTIVE") {
      //       handleBlock(e, id);
      //     } else {
      //       handleUnblock(e, id);
      //     }
      //   },
      // },
    ],
    [handleEditDialogOpen, handleBlock, handleUnblock]
  );

  return (
    <>
      <BaseTable
        initialData={filteredUsers}
        order={order}
        orderBy={orderBy}
        columnsConfig={userTableColumns}
        TableToolbarComponent={({ selected }) => (
          <UsersTableToolbar
            title="Users"
            selected={selected}
            onCreateClick={handleCreateClick}
            onRefreshClick={handleRefreshData}
            onDeleteClick={handleDeleteClick}
            isDeleting={isDeleting}
          />
        )}
        TableHeadComponent={UsersTableHead}
        rowMapper={mapUsersToUserRows}
        rowActionMenuItems={rowActionMenuItems}
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