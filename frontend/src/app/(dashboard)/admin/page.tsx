// app/(dashboard)/admin/page.tsx
"use client";
import { ProtectedRoute } from "@/shared/auth/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <h1>Admin Dashboard</h1>
      {/* Here is the content only for administrators */}
    </ProtectedRoute>
  );
}