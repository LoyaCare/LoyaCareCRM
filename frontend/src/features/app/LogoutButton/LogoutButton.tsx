// features/app/LogoutButton/LogoutButton.tsx
"use client";
import React from "react";
import { Button, CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/shared/auth/useAuth";

interface LogoutButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  fullWidth?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "text",
  color = "inherit",
  fullWidth = false
}) => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      // Перенаправление на страницу входа произойдет автоматически
      // благодаря AuthProvider и ProtectedRoute
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      onClick={handleLogout}
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : <LogoutIcon />}
      fullWidth={fullWidth}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;