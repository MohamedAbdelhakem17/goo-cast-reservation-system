import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";

import AppRouter from "@/router/router";
import AuthProvider from "./context/Auth-Context/AuthContext";
import { ToastProvider } from "./context/Toaster-Context/ToasterContext";
import { LocalizationProvider } from "./context/localization-provider/localization-provider";
import ThemeProvider from "./context/theme-context/theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (error?.response?.status === 404) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      suspense: false,
      networkMode: "online",
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: "online",
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocalizationProvider>
          <AuthProvider>
            <Router>
              {/* <TrackPageView /> */}
              <ToastProvider>
                <AppRouter />
              </ToastProvider>
            </Router>
          </AuthProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
