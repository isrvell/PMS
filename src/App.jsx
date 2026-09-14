import { AuthProvider } from "./context/AuthContext.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <AppRoutes />
          </WorkspaceProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
