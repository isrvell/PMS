import TeamMemberCard from "./TeamMemberCard/TeamMemberCard";
import { teamData } from "../../data/teamData";
import TeamHeader from "./TeamHeader/TeamHeader";
import TeamFilters from "./TeamFilters/TeamFilters";
import { useState } from "react";
function Team() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredMembers =
    activeFilter === "all"
      ? teamData
      : teamData.filter((member) => member.department === activeFilter);
  return (
    <section className="team">
      <div className="container-fluid px-5 py-5">
        <TeamHeader />
        <TeamFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="row g-4">
          {filteredMembers.map((member) => (
            <div key={member.id} className="col-12 col-md-6 col-xl-3">
              <TeamMemberCard
                name={member.name}
                role={member.role}
                avatar={member.avatar}
                availability={member.availability}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
