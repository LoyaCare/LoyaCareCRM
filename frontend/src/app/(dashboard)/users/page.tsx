// "use client";
// import { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import { ProtectedRoute } from "@/features/auth/";
import { UsersTable } from "@/features/user/UsersTable";

function a11yProps(index: number) {
  return {
    id: `users-tab-${index}`,
    "aria-controls": `users-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`users-tabpanel-${index}`}
      aria-labelledby={`users-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function UsersPageContent() {
  // const [tabValue, setTabValue] = useState(0);

  // const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue);
  // };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create and manage system users
        </Typography>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="All Users" {...a11yProps(0)} />
            <Tab label="Active Users" {...a11yProps(1)} />
            <Tab label="Blocked Users" {...a11yProps(2)} />
          </Tabs>
        </Box> */}

          <UsersTable />

        {/* <TabPanel value={tabValue} index={0}>
          <UsersTable />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <UsersTable status="ACTIVE" />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <UsersTable status="BLOCKED" />
        </TabPanel> */}
      </Paper>
    </Container>
  );
}

// Оборачиваем содержимое страницы в ProtectedRoute
export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <UsersPageContent />
    </ProtectedRoute>
  );
}