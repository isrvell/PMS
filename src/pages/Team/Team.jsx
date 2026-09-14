import { useState } from "react";
import TeamMemberCard from "./TeamMemberCard/TeamMemberCard";
import TeamHeader from "./TeamHeader/TeamHeader";
import TeamFilters from "./TeamFilters/TeamFilters";
import EmptyState from "../../components/ui/EmptyState/EmptyState.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getTeamMembers } from "../../services/teamService.js";
import useApi from "../../hooks/useApi.js";

function Team() {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === "admin";
  const [activeFilter, setActiveFilter] = useState("all");
  const [showInvite, setShowInvite] = useState(false);
  const { data: members, loading, error } = useApi(
    () => getTeamMembers(workspaceId),
    [workspaceId]
  );

  const filteredMembers =
    !members ? [] :
    activeFilter === "all"
      ? members
      : members.filter((member) => member.department === activeFilter);

  return (
    <section className="team">
      <div className="container-fluid px-5 py-5">
        <TeamHeader />
        <TeamFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredMembers.length === 0 ? (
          <EmptyState
            icon="bi-people"
            title={t("noTeamMembers")}
            description={t("inviteTeamToCollaborate")}
            actionLabel={isAdmin ? t("inviteMember") : undefined}
            onAction={isAdmin ? () => setShowInvite(true) : undefined}
          />
        ) : (
          <div className="row g-4">
            {filteredMembers.map((member) => (
              <div key={member._id} className="col-12 col-md-6 col-xl-3">
                <TeamMemberCard
                  name={member.user?.name || member.name}
                  role={member.role}
                  avatar={member.user?.avatar || null}
                  availability={member.availability}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Team;
