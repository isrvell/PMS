import "./UserInfo.css";
import { useAuth } from "../../../../context/AuthContext.jsx";

function UserInfo() {
  const { user } = useAuth();
  return (
    <div className="user-info">
      <p className="name-info">{user?.name || "User"}</p>
      <span className="user-role">{user?.role || "Member"}</span>
    </div>
  );
}

export default UserInfo;
