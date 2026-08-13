import "./UserDropdown.css";
function UserDropdown() {
  return (
    <div className="user-dropdown">
      <button className="user-dropdown-item">Profile </button>
      <button className="user-dropdown-item">Settings</button>
      <div className="divider"></div>
      <button className="user-dropdown-item logout"> Logout</button>
    </div>
  );
}

export default UserDropdown;
