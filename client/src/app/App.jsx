import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AppRouter from "../Routes/Router";
import React from 'react';

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Main Project Content */}
      <AppRouter />

      {/* React Query Debugger */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
