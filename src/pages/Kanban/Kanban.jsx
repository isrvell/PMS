import KanbanBoard from "./KanbanBoard/KanbanBoard";
import { useLanguage } from "../../context/LanguageContext.jsx";

function Kanban() {
  const { t } = useLanguage();
  return (
    <section>
      <div className="container-fluid px-5 py-5">
        <h1 className="kanban-header">{t("kanbanBoard")}</h1>
        <KanbanBoard />
      </div>
    </section>
  );
}

export default Kanban;
