import "./UserMenu.css";
function UserMenuToggle({ isOpen }) {
  return (
    <i
      className={`bi bi-chevron-down user-menu-toggle ${
        isOpen ? "rotate" : ""
      }`}
    ></i>
  );
}

export default UserMenuToggle;
