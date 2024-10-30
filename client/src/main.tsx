import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContextProvider } from "./contexts/AppContextProvider.tsx";
import { SearchContextProvider } from "./contexts/SearchContextProvider.tsx";
import AuthCookieMiddleware from "./middlewares/AuthCookieMiddleware.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SearchContextProvider>
          <AuthCookieMiddleware>
            <App />
          </AuthCookieMiddleware>
        </SearchContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
