import { useState } from "react";
import ProjectCard from "./ProjectCard/ProjectCard";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import ProjectFilters from "./ProjectFilters/ProjectFilters";
import EmptyState from "../../components/ui/EmptyState/EmptyState.jsx";
import AddProjectModal from "../../components/admin/AddProjectModal.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getProjects } from "../../services/projectService.js";
import useApi from "../../hooks/useApi.js";

function Projects() {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const isAdmin = user?.role === "admin";
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: projects, loading, error, refetch } = useApi(
    () => getProjects(workspaceId),
    [workspaceId]
  );

  const filteredProjects =
    !projects ? [] :
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.status === activeFilter);

  return (
    <section className="projects">
      <div className="container-fluid mt-5 px-5">
        <ProjectHeader
          onAddProject={() => setShowAddModal(true)}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
        {showFilters && (
          <ProjectFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon="bi-folder-plus"
            title={t("noProjectsYet")}
            description={t("createFirstProject")}
            actionLabel={isAdmin ? t("createProject") : undefined}
            onAction={isAdmin ? () => setShowAddModal(true) : undefined}
          />
        ) : (
          <div className="row g-5">
            {filteredProjects.map((project) => (
              <div key={project._id || project.id} className="col-12 col-md-6 col-xl-4">
                <ProjectCard
                  id={project._id || project.id}
                  name={project.name}
                  description={project.description}
                  date={new Date(project.date).toLocaleDateString(lang === "fr" ? "fr" : "en", { month: "short", day: "numeric", year: "numeric" })}
                  status={project.status}
                  progress={project.progress}
                  members={project.members?.length || 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={refetch}
      />
    </section>
  );
}

export default Projects;
