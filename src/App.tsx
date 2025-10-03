import React, { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Navbar from "./components/layout/Navbar";
import routes from "tempo-routes";
import "./i18n/config";
import { AuthProvider } from "./lib/auth-context";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Eager load critical components
import Landing from "./pages/Landing";

// Lazy load heavy components
const Home = lazy(() => import("./components/home"));
const Profile = lazy(() => import("./pages/Profile"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQPage = lazy(() => import("./components/faq/FAQPage"));
const HelpCenter = lazy(() => import("./components/help/HelpCenter"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const Alternatives = lazy(() => import("./pages/Alternatives"));
const Transactions = lazy(() => import("./pages/Transactions"));
const CashFlow = lazy(() => import("./pages/CashFlow"));
const Categories = lazy(() => import("./pages/Categories"));
const Recurring = lazy(() => import("./pages/Recurring"));
const Investments = lazy(() => import("./pages/Investments"));
const AppLayout = lazy(() => import("./components/layout/AppLayout"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const { t, ready } = useTranslation();

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          {/* Add tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/alternatives" element={<Alternatives />} />
            
            {/* Redirect /dashboard to /app for better compatibility */}
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            
            {/* Protected routes with AppLayout */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/app" element={<Home />} />
              <Route path="/app/transactions" element={<Transactions />} />
              <Route path="/app/cash-flow" element={<CashFlow />} />
              <Route path="/app/categories" element={<Categories />} />
              <Route path="/app/recurrings" element={<Recurring />} />
              <Route path="/app/investments" element={<Investments />} />
              <Route path="/app/profile" element={<Profile />} />
              <Route path="/app/faq" element={<FAQPage />} />
              <Route path="/app/help" element={<HelpCenter />} />
            </Route>

            {/* Preview route */}
            <Route path="/preview/:projectId/app" element={<Home />} />

            {/* Tempo route */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
