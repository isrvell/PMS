import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { validateInvite, register } from "../../services/authService.js";
import "./Invite.css";

function Invite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [inviteData, setInviteData] = useState(null);
  const [validating, setValidating] = useState(true);
  const [invalidMessage, setInvalidMessage] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    validateInvite(token)
      .then((data) => {
        if (!data || !data.valid) {
          setInvalidMessage(data?.message || "Invalid or expired invitation token.");
        } else {
          setInviteData(data);
        }
      })
      .catch((err) => {
        setInvalidMessage(err?.message || "Failed to validate invitation.");
      })
      .finally(() => setValidating(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!inviteData?.isExistingUser && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await register(token, inviteData?.isExistingUser ? (inviteData.existingName || name) : name, password);
      loginUser(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="invite-page">
        <div className="invite-card text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (invalidMessage || !inviteData) {
    return (
      <div className="invite-page">
        <div className="invite-card text-center">
          <i className="bi bi-x-circle text-danger" style={{ fontSize: "3rem" }}></i>
          <h2 className="mt-3">Invalid Invitation</h2>
          <p className="text-muted">{invalidMessage || "The invitation link is invalid or could not be loaded."}</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="invite-page">
      <div className="invite-card">
        <div className="invite-header">
          <i className="bi bi-envelope-check" style={{ fontSize: "2.5rem", color: "#3a9b72" }}></i>
          <h2>You're Invited!</h2>
          <p>
            Join <strong>{inviteData.workspaceName || "Workspace"}</strong>
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {inviteData.isExistingUser && (
          <div className="alert alert-info" role="alert">
            An account already exists for <strong>{inviteData.email}</strong>. Click below to accept and join the workspace.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={inviteData.email || ""}
              disabled
            />
          </div>

          {!inviteData.isExistingUser && (
            <>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            ) : null}
            {inviteData.isExistingUser ? "Accept & Join Workspace" : "Create Account & Join"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Invite;
