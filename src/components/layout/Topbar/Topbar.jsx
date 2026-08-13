import "./Topbar.css";
import Notification from "./Notification/Notification";
import UserMenu from "./UserMenu/UserMenu";
function Topbar() {
  return (
    <header className="topbar">
      {/* Topbar Left */}
      <div className="topbar-left">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search" />
        </div>
      </div>
      {/* Topbar Right */}
      <div className="topbar-right">
        <Notification />
        <UserMenu />
      </div>
    </header>
  );
}

export default Topbar;
