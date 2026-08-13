import ActionItem from "./ActionItem";
import { actionRequiredData } from "../../../../data/actionRequiredData";
import { Fragment } from "react";
import "./ActionRequired.css";
function ActionRequired() {
  return (
    <section className="actions shadow-sm rounded-3 p-3">
      <div className="actions-title d-flex gap-2">
        <i className="bi bi-exclamation-circle"></i>
        <h4 className="mb-4">Action Required</h4>
      </div>
      <div className="actions-list">
        {actionRequiredData.slice(0, 2).map((action, index) => (
          <Fragment key={action.id}>
            <ActionItem
              title={action.title}
              priority={action.priority}
              dueDate={action.dueDate}
            />
            {index < 1 && <div className="divider"></div>}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export default ActionRequired;
