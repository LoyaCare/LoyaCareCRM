// shared/auth/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "./types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Если загрузка завершена и пользователь не авторизован
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname || "")}`);
      return;
    }

    // Проверка роли
    if (
      !isLoading &&
      isAuthenticated &&
      user &&
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.push("/unauthorized");
    }
  }, [isLoading, isAuthenticated, user, router, pathname, allowedRoles]);

  // Показываем состояние загрузки
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Если пользователь авторизован и имеет нужную роль
  if (isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role)))) {
    return <>{children}</>;
  }

  // Если проверка не прошла, не рендерим содержимое
  return null;
};