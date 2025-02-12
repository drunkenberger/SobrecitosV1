import { Suspense } from "react";
import { Toaster } from "./components/ui/toaster";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Landing from "./pages/Landing";
import Navbar from "./components/layout/Navbar";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen">
        <Navbar />
        {/* Add tempo routes before the catchall */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Home />} />
          <Route path="/preview/:projectId/app" element={<Home />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster />
    </Suspense>
  );
}

export default App;
