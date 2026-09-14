import { useState } from "react";
import "./TeamHeader.css";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import InviteModal from "../../../components/admin/InviteModal.jsx";

function TeamHeader({ onInviteSuccess }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === "admin";
  const [showInvite, setShowInvite] = useState(false);

  return (
    <header className="team-header d-flex justify-content-between align-items-center mb-4">
      <h1 className="mb-0">{t("team")}</h1>
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn team-filter-btn"
          aria-label="Filter team members"
        >
          <i className="bi bi-sliders"></i>
        </button>
        {isAdmin && (
          <button
            type="button"
            className="btn invit-btn"
            onClick={() => setShowInvite(true)}
          >
            <i className="bi bi-person-plus me-2"></i>
            {t("inviteMember")}
          </button>
        )}
      </div>

      <InviteModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        onSuccess={onInviteSuccess}
      />
    </header>
  );
}

export default TeamHeader;
