import Avatar from "../../../ui/Avatar/Avatar";
import UserInfo from "./UserInfo";
import UserMenuToggle from "./UserMenuToggle";
import { useAuth } from "../../../../context/AuthContext.jsx";

import "./UserMenu.css";
import { useEffect, useRef, useState } from "react";
import UserDropdown from "./UserDropdown";

function UserMenu() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button className="user-menu" onClick={() => setIsOpen(!isOpen)}>
        <Avatar size={40} src={user?.avatar} name={user?.name} />
        <UserInfo />
        <UserMenuToggle isOpen={isOpen} />
      </button>
      {isOpen && <UserDropdown />}
    </div>
  );
}

export default UserMenu;
