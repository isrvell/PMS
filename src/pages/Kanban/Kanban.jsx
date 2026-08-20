import KanbanBoard from "./KanbanBoard/KanbanBoard";

function Kanban() {
  return (
    <section>
      <div className="container-fluid px-5 py-5">
        <h1 className="kanban-header">Kanban Board</h1>
        <KanbanBoard />
      </div>
    </section>
  );
}

export default Kanban;
