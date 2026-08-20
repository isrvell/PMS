import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout.jsx";

import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Projects from "../pages/Projects/Projects.jsx";
import Team from "../pages/Team/Team.jsx";
import Kanban from "../pages/Kanban/Kanban.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/kanban" element={<Kanban />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
