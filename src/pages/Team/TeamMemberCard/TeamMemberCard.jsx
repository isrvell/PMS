import "./TeamMemberCard.css";

import { useTranslatedStatuses } from "../../../constants/statuses.js";
import Avatar from "../../../components/ui/Avatar/Avatar.jsx";

function TeamMemberCard({ name, role, avatar, availability }) {
  const { teamAvailability } = useTranslatedStatuses();
  const status = teamAvailability[availability];

  return (
    <article className="team-member-card mt-4 shadow-sm rounded-3">
      <div className="p-3">
        <div className="team-member-info">
          <div className="team-member-avatar">
            <Avatar size={70} src={avatar} alt={name} />
            <span
              className="availability-indicator"
              style={{ background: status.color }}
              aria-label={status.label}
            ></span>
          </div>

          <h5 className="team-name">{name}</h5>
          <p>{role}</p>
        </div>
        <div className="team-member-status border-top px-2 py-2">
          <span>{status.label}</span>
        </div>
      </div>
    </article>
  );
}
export default TeamMemberCard;
