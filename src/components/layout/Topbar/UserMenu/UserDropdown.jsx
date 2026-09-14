import "./UserDropdown.css";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { useLanguage } from "../../../../context/LanguageContext.jsx";
import { useNavigate } from "react-router-dom";

function UserDropdown() {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-dropdown">
      <button className="user-dropdown-item" onClick={() => navigate("/profile")}>
        <i className="bi bi-person me-2"></i>{t("profile")}
      </button>
      <button className="user-dropdown-item" onClick={() => navigate("/settings")}>
        <i className="bi bi-gear me-2"></i>{t("settings")}
      </button>
      <div className="divider"></div>
      <button className="user-dropdown-item logout" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i>{t("logout")}
      </button>
    </div>
  );
}

export default UserDropdown;
