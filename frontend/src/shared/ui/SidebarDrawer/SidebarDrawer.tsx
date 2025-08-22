"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Константы для ширины
const drawerWidth = 220;
const collapsedWidth = 60;

// Пункты меню
const menuItems = [
  { text: "Leads", href: "/leads", icon: <AssignmentIcon /> },
  { text: "Deals", href: "/deals", icon: <MonetizationOnIcon /> },
  { text: "Users", href: "/users", icon: <PeopleIcon /> },
];

export const SidebarDrawer = () => {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname() || "/";

  // Этот эффект устанавливает отступ для основного контента
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.marginLeft = collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`;
      mainContent.style.width = collapsed ? `calc(100% - ${collapsedWidth}px)` : `calc(100% - ${drawerWidth}px)`;
      mainContent.style.transition = 'margin-left 0.2s, width 0.2s';
    }
  }, [collapsed]);

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
          borderRight: 1,
          borderColor: "divider",
        },
      }}
    >
      <Toolbar sx={{ 
        justifyContent: collapsed ? "center" : "space-between", 
        px: 1,
        minHeight: 64 
      }}>
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Loya Care
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
            <ListItem key={item.text} disablePadding sx={{ 
              display: 'block',
              justifyContent: collapsed ? "center" : "flex-start" 
            }}>
              <Link
                href={item.href}
                style={{ 
                  textDecoration: "none", 
                  color: "inherit", 
                  width: "100%" 
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 2.5 : 3,
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    '&:hover': { 
                      bgcolor: isActive ? 'action.selected' : 'action.hover' 
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 0, 
                      mr: collapsed ? 0 : 3, 
                      justifyContent: "center",
                      color: isActive ? 'primary.main' : 'inherit' 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        sx: { fontWeight: isActive ? 700 : 400 } 
                      }} 
                    />
                  )}
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};