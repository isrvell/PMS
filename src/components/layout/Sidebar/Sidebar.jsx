import "./Sidebar.css";
import { sidebarMenu } from "../../../data/sidebarMenu.js";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar p-4">
      {/* SidebarTop */}
      <div className="sidebar-top">
        <div className="brand-logo">PM</div>
        <ul className="nav flex-column gap-3">
          {sidebarMenu.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <i className={`${item.icon} me-3`}></i>
                <span className="fs-4">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      {/* SidebarBottom */}
      <div className="sidebar-bottom">
        <small className="text-white">Version 1.0</small>
      </div>
    </aside>
  );
}

export default Sidebar;
