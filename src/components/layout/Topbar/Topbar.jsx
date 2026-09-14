import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";
import Notification from "./Notification/Notification";
import UserMenu from "./UserMenu/UserMenu";
import ThemeToggle from "../../ui/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "../../ui/LanguageSwitcher/LanguageSwitcher";
import Avatar from "../../ui/Avatar/Avatar";
import { useWorkspace } from "../../../context/WorkspaceContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { searchWorkspace } from "../../../services/taskService.js";

function Topbar({ onMenuClick }) {
  const { workspaceId } = useWorkspace();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (value.trim().length < 2) {
      setResults(null);
      setShowResults(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchWorkspace(workspaceId, value);
        setResults(data);
        setShowResults(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);
  };

  const handleSelect = (type, id) => {
    setShowResults(false);
    setQuery("");
    if (type === "project") navigate(`/projects/${id}`);
    else if (type === "task") navigate("/kanban");
    else if (type === "member") navigate("/team");
  };

  const totalResults = results
    ? results.projects.length + results.tasks.length + results.members.length
    : 0;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={onMenuClick} aria-label="Open menu">
          <i className="bi bi-list"></i>
        </button>
        <div className="search-box" ref={ref}>
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => results && setShowResults(true)}
          />
          {showResults && results && (
            <div className="search-results">
              {totalResults === 0 ? (
                <div className="search-empty">{t("noResults")} "{query}"</div>
              ) : (
                <>
                  {results.projects.length > 0 && (
                    <div className="search-group">
                      <div className="search-group-label">{t("projects")}</div>
                      {results.projects.map((p) => (
                        <div key={p.id} className="search-item" onClick={() => handleSelect("project", p.id)}>
                          <i className="bi bi-folder search-item-icon"></i>
                          <div>
                            <span className="search-item-title">{p.name}</span>
                            <span className="search-item-meta">{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {results.tasks.length > 0 && (
                    <div className="search-group">
                      <div className="search-group-label">{t("tasks")}</div>
                      {results.tasks.map((t) => (
                        <div key={t.id} className="search-item" onClick={() => handleSelect("task", t.id)}>
                          <i className="bi bi-check2-square search-item-icon"></i>
                          <div>
                            <span className="search-item-title">{t.title}</span>
                            <span className="search-item-meta">{t.project?.name} &middot; {t.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {results.members.length > 0 && (
                    <div className="search-group">
                      <div className="search-group-label">{t("people")}</div>
                      {results.members.map((m) => (
                        <div key={m.id} className="search-item" onClick={() => handleSelect("member", m.id)}>
                          <Avatar size={24} src={m.avatar} name={m.name} />
                          <div>
                            <span className="search-item-title">{m.name}</span>
                            <span className="search-item-meta">{m.role} &middot; {m.department}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="topbar-right">
        <LanguageSwitcher />
        <ThemeToggle />
        <Notification />
        <UserMenu />
      </div>
    </header>
  );
}

export default Topbar;
