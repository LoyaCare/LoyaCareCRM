// app/(dashboard)/layout.tsx
// "use client";
import { ProtectedRoute } from "@/shared";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}