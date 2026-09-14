import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./MainLayout.css";

function MainLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebarCollapsed", String(next));
  };

  const handleMobileClose = () => setMobileOpen(false);

  return (
    <div className={`app-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />
      <div className="content-area">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
