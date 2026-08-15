import { useState } from "react";
import { projectsdata } from "../../data/projectsData";
import ProjectCard from "./ProjectCard/ProjectCard";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import ProjectFilters from "./ProjectFilters/ProjectFilters";

function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredProjects =
    activeFilter === "all"
      ? projectsdata
      : projectsdata.filter((project) => project.status === activeFilter);

  return (
    <section className="projects">
      <div className="container-fluid mt-5 px-5">
        <ProjectHeader />
        <ProjectFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="row g-5">
          {filteredProjects.map((project) => (
            <div key={project.id} className="col-12 col-md-6 col-xl-4">
              <ProjectCard
                name={project.name}
                description={project.description}
                date={project.date}
                status={project.status}
                progress={project.progress}
                members={project.members}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
