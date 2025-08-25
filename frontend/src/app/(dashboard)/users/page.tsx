// "use client";
// import { useState } from "react";
import { Container } from "@mui/material";
import { ProtectedRoute } from "@/features/auth";
import { UsersTable } from "@/features/user";

// Wrap the page content in a ProtectedRoute
export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Container
        maxWidth={false}
        component="main"
        sx={{
          p: 0,
          m: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <UsersTable />
      </Container>
    </ProtectedRoute>
  );
}
