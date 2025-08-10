import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router } from "react-router-dom";
import TagManager from "react-gtm-module";

import AppRouter from "../Routes/Router";
import AuthProvider from "../context/Auth-Context/AuthContext";
import { ToastProvider } from "../context/Toaster-Context/ToasterContext";
import PageTracker from "../components/PageTracker/PageTracker";

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
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
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
  // Initialize GTM with your GTM ID
  const tagManagerArgs = {
    gtmId: "GTM-P92D4BCV",
  };

  TagManager.initialize(tagManagerArgs);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <PageTracker />
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </Router>
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
