import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter as Router } from 'react-router-dom';

import AppRouter from "../Routes/Router";

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
