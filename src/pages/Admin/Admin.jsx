import { useState } from "react";
import MembersPanel from "./MembersPanel/MembersPanel.jsx";
import InvitationsPanel from "./InvitationsPanel/InvitationsPanel.jsx";
import WorkspacePanel from "./WorkspacePanel/WorkspacePanel.jsx";
import WorkflowsPanel from "../../components/admin/WorkflowsPanel.jsx";
import SLAPanel from "../../components/admin/SLAPanel.jsx";
import AuditPanel from "../../components/admin/AuditPanel.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getWorkspaceMembers } from "../../services/workspaceService.js";
import useApi from "../../hooks/useApi.js";
import "./Admin.css";

function Admin() {
  const { workspaceId } = useWorkspace();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("members");

  const tabs = [
    { id: "members", label: t("membersTab"), icon: "bi bi-people" },
    { id: "invitations", label: t("invitations"), icon: "bi bi-envelope" },
    { id: "workspace", label: t("workspace"), icon: "bi bi-building" },
    { id: "workflows", label: t("workflows"), icon: "bi bi-diagram-3" },
    { id: "sla", label: t("slas"), icon: "bi bi-clock-history" },
    { id: "audit", label: t("auditLogs"), icon: "bi bi-shield-check" },
  ];
  const { data: members, loading, error, refetch } = useApi(
    () => getWorkspaceMembers(workspaceId),
    [workspaceId]
  );

  return (
    <section className="admin">
      <div className="container-fluid px-5 py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="admin-title">{t("adminSettings")}</h1>
        </div>

        <div className="admin-tabs mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "members" && (
          loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <MembersPanel members={members || []} onRefresh={refetch} />
          )
        )}

        {activeTab === "invitations" && <InvitationsPanel />}

        {activeTab === "workspace" && <WorkspacePanel />}

        {activeTab === "workflows" && <WorkflowsPanel />}

        {activeTab === "sla" && <SLAPanel />}

        {activeTab === "audit" && <AuditPanel />}
      </div>
    </section>
  );
}

export default Admin;
