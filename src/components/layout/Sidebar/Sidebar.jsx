import "./Sidebar.css";
import { sidebarMenu } from "../../../data/sidebarMenu.js";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";

function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === "admin";

  const titleMap = {
    "/": t("dashboard"),
    "/projects": t("projects"),
    "/team": t("team"),
    "/kanban": t("kanban"),
    "/backlog": t("backlog"),
    "/releases": t("releases"),
    "/reports": t("reports"),
    "/filters": t("filters"),
    "/calendar": t("calendar"),
    "/admin": t("admin"),
  };

  const menuItems = sidebarMenu.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onMobileClose} />}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand-logo">
            <span className="brand-icon">PM</span>
            <span className="brand-text">PMS</span>
          </div>
          <nav>
            <ul className="sidebar-nav">
              {menuItems.map((item) => {
                const label = titleMap[item.path] || item.title;
                return (
                  <li key={item.id} className="sidebar-nav-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                      onClick={onMobileClose}
                      title={collapsed ? label : undefined}
                    >
                      <i className={`${item.icon} sidebar-link-icon`}></i>
                      <span className="sidebar-link-text">{label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? "Expand" : "Collapse"}>
            <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
