import { useTheme } from "../../../context/ThemeContext.jsx";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <i className={`bi ${theme === "light" ? "bi-moon-stars" : "bi-sun"}`}></i>
    </button>
  );
}

export default ThemeToggle;
