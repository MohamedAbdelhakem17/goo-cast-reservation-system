import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HashRouter as Router } from 'react-router-dom';

import AppRouter from "../Routes/Router";
import AuthProvider from '../context/Auth-Context/AuthContext';
import BookingProvider from '../context/Booking-Context/BookingContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <BookingProvider>
            <AppRouter />
          </BookingProvider>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
