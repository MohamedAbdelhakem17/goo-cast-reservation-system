import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";
import { API_BASE_URL } from "@/constants/config";

const fetchBookings = async (filters) => {
  const { status, studioId, date, page = 1, limit = 10 } = filters;
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (studioId) params.append("studioId", studioId);
  if (date) params.append("date", date);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const { data } = await axiosInstance.get(
    `${API_BASE_URL}/bookings?${params.toString()}`,
  );

  return data;
};

export const useGetBookings = (filters) => {
  return useQuery({
    queryKey: ["get-bookings", filters],
    queryFn: () => fetchBookings(filters),
    keepPreviousData: true,
  });
};

// Change booking status
export const useChangeBookingStatus = () => {
  const { mutate: changeStatus, isPending } = useMutation({
    mutationKey: ["change-booking-status"],

    mutationFn: async (payload) => {
      const { data } = await axiosInstance.put(`${API_BASE_URL}/bookings`, payload);

      return data;
    },
  });

  return { changeStatus, isPending };
};
