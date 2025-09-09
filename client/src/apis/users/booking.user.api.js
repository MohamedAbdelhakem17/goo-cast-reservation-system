import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios-instance";

// Get  User Booking
export function useGetUserData() {
  const {
    data: userBookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getUserBooking"],

    queryFn: async () => {
      const { data } = await axiosInstance("/bookings/user-bookings");

      return data;
    },
  });

  return { userBookings, isLoading, error };
}
