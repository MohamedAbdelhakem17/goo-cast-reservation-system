import { API_BASE_URL } from "@/constants/config";
import axiosInstance from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchBookings = async (filters) => {
  const { status, studioId, date, page = 1, limit = 1000 } = filters;
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

// Get single booking data
export const useGetSingleBooking = (id) => {
  const {
    data: singleBooking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["single-booking", id],

    queryFn: async () => {
      const { data } = await axiosInstance("/bookings/" + id);

      return data;
    },
  });

  return { singleBooking, isLoading, error };
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

// Update booking data
export const useUpdateBooking = () => {
  const { mutate: updateBooking, isPending } = useMutation({
    mutationKey: ["edit-booking"],

    mutationFn: async ({ payload, id }) => {
      const { data } = await axiosInstance.put("/bookings/" + id, payload);

      return data;
    },
  });

  return { updateBooking, isPending };
};
