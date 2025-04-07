import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AppRouter from "../Routes/Router";
import React from 'react';

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Main Project Content */}
      <Router >
        <AppRouter />
      </Router>
      
      {/* React Query Debugger */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
