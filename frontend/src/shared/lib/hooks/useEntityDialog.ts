"use client";

import { useState, useCallback } from "react";

export interface UseEntityDialogOptions {
  onAfterClose?: () => void;
}

export interface UseEntityDialogReturn {
  entityId: string | null;
  isDialogOpen: boolean;
  handleEditClick: (e: React.MouseEvent, id?: string) => void;
  handleCreateClick: () => void;
  handleDialogClose: () => void;
  showDialog: boolean;
}

/**
 * Hook for managing entity creation/editing dialogs
 */
export function useEntityDialog(
  options?: UseEntityDialogOptions
): UseEntityDialogReturn {
  const [entityId, setEntityId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = useCallback((e: React.MouseEvent, id?: string) => {
    if (!id) return;
    e.stopPropagation();
    setEntityId(id);
    setIsDialogOpen(true);
  }, []);

  const handleCreateClick = useCallback(() => {
    setEntityId(null);
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setEntityId(null);
    setIsDialogOpen(false);

    options?.onAfterClose?.();
  }, [options]);

  return {
    entityId,
    isDialogOpen,
    handleEditClick,
    handleCreateClick,
    handleDialogClose,
    showDialog: isDialogOpen,
  };
}
