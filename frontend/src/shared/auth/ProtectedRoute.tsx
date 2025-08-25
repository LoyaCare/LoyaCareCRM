// shared/auth/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useAuth } from "./hooks";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "./model/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname || "")}`);
      return;
    }

    // Role check
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

  // Show loading state
  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  // If user is authenticated and has the required role
  if (isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role)))) {
    return <>{children}</>;
  }

  // If check failed, do not render content
  return null;
};