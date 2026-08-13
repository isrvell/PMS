import Priority from "../../../../components/ui/Priority/Priority";

export default function ActionItem({ title, priority, dueDate }) {
  return (
    <article className="action-item row align-items-center text-center">
      <div className="col-4">
        <div className="actions-title mb-0 text-start">
          <h6>{title}</h6>
        </div>
      </div>
      <div className="col-4">
        <Priority level={priority} />
      </div>
      <div className="col-4">
        <p className="action-dueDate mb-0">{dueDate}</p>
      </div>
    </article>
  );
}
