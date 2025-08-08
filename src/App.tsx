import React, { Suspense } from "react";
import { Toaster } from "./components/ui/toaster";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Home from "./components/home";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQPage from "./components/faq/FAQPage";
import HelpCenter from "./components/help/HelpCenter";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import CookiePolicy from "./pages/legal/CookiePolicy";
import Navbar from "./components/layout/Navbar";
import Alternatives from "./pages/Alternatives";
import Transactions from "./pages/Transactions";
import CashFlow from "./pages/CashFlow";
import Categories from "./pages/Categories";
import Recurring from "./pages/Recurring";
import Investments from "./pages/Investments";
import AppLayout from "./components/layout/AppLayout";
import routes from "tempo-routes";
import "./i18n/config";
import { AuthProvider } from "./lib/auth-context";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

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
          <Toaster />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
