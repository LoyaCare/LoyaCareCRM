"use client";
import { ProtectedRoute } from "@/features/auth/ui/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <h1>Admin Dashboard</h1>
      {/* Here is the content only for administrators */}
    </ProtectedRoute>
  );
}