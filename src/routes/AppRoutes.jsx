import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";

import Login from "../pages/Login/Login.jsx";
import Invite from "../pages/Invite/Invite.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Projects from "../pages/Projects/Projects.jsx";
import ProjectDetail from "../pages/Projects/ProjectDetail/ProjectDetail.jsx";
import Team from "../pages/Team/Team.jsx";
import Kanban from "../pages/Kanban/Kanban.jsx";
import Reports from "../pages/Reports/Reports.jsx";
import CalendarView from "../pages/Calendar/Calendar.jsx";
import Admin from "../pages/Admin/Admin.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Settings from "../pages/Settings/Settings.jsx";
import Chat from "../pages/Chat/Chat.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/invite/:token" element={<Invite />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/team" element={<Team />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
