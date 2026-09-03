import { BrowserRouter, HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/LoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import StaffDashboardPage from "@/pages/StaffDashboardPage";
import SearchPage from "@/pages/SearchPage";
import InventoryPage from "@/pages/InventoryPage";
import AlertsPage from "@/pages/AlertsPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import HelpCenterPage from "@/pages/HelpCenterPage";
import StaffManagementPage from "@/pages/StaffManagementPage";
import BillingPage from "@/pages/BillingPage";

const Router = typeof window !== "undefined" && window.location.protocol === "file:" ? HashRouter : BrowserRouter;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function DashboardRoute() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <AdminDashboardPage /> : <StaffDashboardPage />;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/staff" element={<AdminRoute><StaffManagementPage /></AdminRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
