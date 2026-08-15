import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout.jsx";

import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Projects from "../pages/Projects/Projects.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
