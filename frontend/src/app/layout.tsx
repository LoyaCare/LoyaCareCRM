import React from "react";
import { Providers } from "./store/Providers";
import Box from "@mui/material/Box";
import { SidebarDrawer } from "@/shared/ui/SidebarDrawer";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SidebarDrawer is a client component; it handles its own state

  return (
    <html lang="en">
      <head>
        <title>LoyaCRM</title>
        <meta name="description" content="LoyaCRM - Your CRM Solution" />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <Providers>
          <Box
            sx={{
              display: "flex",
              minWidth: 0,
              height: "100vh",
              width: "100vw",
              overflow: "hidden",
            }}
          >
            <SidebarDrawer />
            <Box
              component="main"
              sx={{
                flex: 1, 
                minWidth: 0,
                p: 2,
                bgcolor: "background.default",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              {children}
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
