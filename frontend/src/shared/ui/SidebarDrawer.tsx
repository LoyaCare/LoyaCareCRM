"use client";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const drawerWidth = 220;
const collapsedWidth = 60;

const menuItems = [
  { text: "Leads", href: "/leads", icon: <AssignmentIcon /> },
  { text: "Deals", href: "/deals", icon: <MonetizationOnIcon /> },
  { text: "Users", href: "/users", icon: <PeopleIcon /> },
];

export function SidebarDrawer() {
  const [collapsed, setCollapsed] = React.useState(true);
  const pathname = usePathname() || "/";
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          transition: "width 0.2s",
          overflowX: "hidden",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: collapsed ? "center" : "space-between", px: 1 }}>
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            LoyaCRM
          </Typography>
        )}
        <IconButton onClick={() => setCollapsed((v) => !v)} size="small">
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <ListItem key={item.text} disablePadding sx={{ justifyContent: "center" }}>
              <Link
                href={item.href}
                style={{ textDecoration: "none", color: "inherit", width: "100%" }}
              >
                <ListItemButton
                  sx={{
                    justifyContent: "center",
                    minHeight: 48,
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    '&:hover': { bgcolor: isActive ? 'action.selected' : 'action.hover' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: isActive ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText primary={item.text} primaryTypographyProps={{ sx: { fontWeight: isActive ? 700 : 400 } }} />
                  )}
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
