import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/wordpress.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import './config/i18n';

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <BrowserRouter basename={basename}>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>,
);
