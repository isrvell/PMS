import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [workspaceId, setWorkspaceId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setWorkspaceId(null);
      setIsReady(false);
      return;
    }

    const workspaces = user.workspaces || [];
    if (workspaces.length === 0) {
      setWorkspaceId(null);
      setIsReady(true);
      return;
    }

    const validIds = workspaces.map((w) => w.id || w._id || w);
    const stored = localStorage.getItem("workspaceId");

    if (stored && validIds.includes(stored)) {
      setWorkspaceId(stored);
    } else {
      const id = validIds[0];
      setWorkspaceId(id);
      localStorage.setItem("workspaceId", id);
    }
    setIsReady(true);
  }, [user, isAuthenticated]);

  const switchWorkspace = (id) => {
    setWorkspaceId(id);
    localStorage.setItem("workspaceId", id);
  };

  return (
    <WorkspaceContext.Provider value={{ workspaceId, switchWorkspace, isReady }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
};
