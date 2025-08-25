import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";

export function useTableActions() {
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((selected: readonly string[]) => {
    // В реальном приложении здесь был бы запрос на удаление
    setIsDeleting(true);
    
    setTimeout(() => {
      console.log("Deleting users:", selected);
      enqueueSnackbar(`${selected.length} users would be deleted`, { 
        variant: "info" 
      });
      setIsDeleting(false);
    }, 1000);
  }, [enqueueSnackbar]);

  return {
    handleDeleteClick,
    isDeleting
  };
}