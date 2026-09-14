import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import Avatar from "../../components/ui/Avatar/Avatar.jsx";
import apiFetch from "../../services/api.js";
import "./Profile.css";

function Profile() {
  const { user, loginUser } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const updated = await apiFetch("/auth/me", {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      const token = localStorage.getItem("token");
      loginUser(token, updated);
      setMessage(t("profileUpdated"));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage(t("fileMustBeUnder2MB"));
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }

      const updated = await res.json();
      loginUser(token, updated);
      setMessage(t("photoUpdated"));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <section className="profile-page">
      <div className="container-fluid px-5 py-5">
        <h1 className="profile-title mb-4">{t("profile")}</h1>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="profile-card shadow-sm rounded-3 p-4 text-center">
              <div className="profile-avatar-wrapper mb-3" onClick={handleAvatarClick}>
                <Avatar size={100} src={user?.avatar} name={user?.name} />
                <div className="avatar-overlay">
                  {uploading ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                  ) : (
                    <i className="bi bi-camera"></i>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  hidden
                />
              </div>
              <p className="profile-avatar-hint">{t("clickPhotoToChange")}</p>
              <h4 className="profile-name">{user?.name}</h4>
              <p className="profile-email">{user?.email}</p>
              <span className={`profile-role-badge role-${user?.role}`}>
                {user?.role === "admin" ? "Admin" : "Member"}
              </span>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="profile-card shadow-sm rounded-3 p-4">
              <h5 className="profile-card-title mb-3">{t("editProfile")}</h5>

              {message && (
                <div className={`alert py-2 ${message.includes("updated") || message.includes("Photo") ? "alert-success" : "alert-danger"}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label htmlFor="profile-email" className="form-label profile-label">{t("email")}</label>
                  <input
                    type="email"
                    className="form-control profile-input"
                    id="profile-email"
                    value={user?.email || ""}
                    disabled
                  />
                  <small className="text-muted">{t("emailCannotBeChanged")}</small>
                </div>

                <div className="mb-4">
                  <label htmlFor="profile-name" className="form-label profile-label">{t("fullName")}</label>
                  <input
                    type="text"
                    className="form-control profile-input"
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn profile-save-btn" disabled={saving}>
                  {saving ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : (
                    <i className="bi bi-check-lg me-2"></i>
                  )}
                  {t("saveChanges")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
