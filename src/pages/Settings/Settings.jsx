import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const { user } = useAuth();
  const { t, lang, switchLang } = useLanguage();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <section className="settings-page">
      <div className="container-fluid px-5 py-5">
        <h1 className="settings-title mb-4">{t("settings")}</h1>

        <div className="row g-4">
          <div className="col-lg-6">
            <div
              className="settings-card shadow-sm rounded-3 p-4"
              onClick={() => navigate("/profile")}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="settings-icon-wrapper">
                  <i className="bi bi-person"></i>
                </div>
                <div>
                  <h5 className="settings-card-title">{t("profile")}</h5>
                  <p className="settings-card-desc">{t("editNameAndAvatar")}</p>
                </div>
                <i className="bi bi-chevron-right ms-auto settings-arrow"></i>
              </div>
            </div>
          </div>

          {/* Language Card */}
          <div className="col-lg-6">
            <div className="settings-card shadow-sm rounded-3 p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="settings-icon-wrapper">
                  <i className="bi bi-translate"></i>
                </div>
                <div className="flex-grow-1">
                  <h5 className="settings-card-title">{t("languageSettings")}</h5>
                  <p className="settings-card-desc">{t("languageSettingsDesc")}</p>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className={`btn btn-sm ${lang === "en" ? "btn-dark" : "btn-outline-secondary"}`}
                      onClick={() => switchLang("en")}
                    >
                      🇬🇧 {t("english")}
                    </button>
                    <button
                      className={`btn btn-sm ${lang === "fr" ? "btn-dark" : "btn-outline-secondary"}`}
                      onClick={() => switchLang("fr")}
                    >
                      🇫🇷 {t("french")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <>
              <div className="col-lg-6">
                <div
                  className="settings-card shadow-sm rounded-3 p-4"
                  onClick={() => navigate("/admin")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="settings-icon-wrapper">
                      <i className="bi bi-building"></i>
                    </div>
                    <div>
                      <h5 className="settings-card-title">{t("workspace")}</h5>
                      <p className="settings-card-desc">{t("manageWorkspace")}</p>
                    </div>
                    <i className="bi bi-chevron-right ms-auto settings-arrow"></i>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div
                  className="settings-card shadow-sm rounded-3 p-4"
                  onClick={() => navigate("/admin")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="settings-icon-wrapper">
                      <i className="bi bi-people"></i>
                    </div>
                    <div>
                      <h5 className="settings-card-title">{t("membersTab")}</h5>
                      <p className="settings-card-desc">{t("manageMembers")}</p>
                    </div>
                    <i className="bi bi-chevron-right ms-auto settings-arrow"></i>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div
                  className="settings-card shadow-sm rounded-3 p-4"
                  onClick={() => navigate("/admin")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="settings-icon-wrapper">
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div>
                      <h5 className="settings-card-title">{t("invitations")}</h5>
                      <p className="settings-card-desc">{t("sendAndManageInvitations")}</p>
                    </div>
                    <i className="bi bi-chevron-right ms-auto settings-arrow"></i>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Settings;
