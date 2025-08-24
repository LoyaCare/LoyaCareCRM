import { useCallback } from "react";

export function useTableActions() {
  const handleDeleteClick = useCallback((selected: readonly string[]) => {
    console.log("Delete clicked for selected ids:", selected);
    // Реализация удаления записей
  }, []);

  return {
    handleDeleteClick
  };
}