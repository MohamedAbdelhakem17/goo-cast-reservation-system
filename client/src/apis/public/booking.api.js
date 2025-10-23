import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";

export const useGetFullyBookedDates = (duration) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["full-booked-dates", duration],

    queryFn: async () => {
      const { data } = await axiosInstance(`/bookings/fully-booked?duration=${duration}`);
      return data;
    },

    enabled: !!duration,

    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return { data, isLoading, error };
};

export const useGetAvailableSlots = () => {
  const {
    mutate: getSlots,
    data,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["available-slots"],

    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post(`/bookings/available-slots`, payload);

      return data;
    },
  });

  return { getSlots, data, isPending, error };
};

export const useCreateBooking = () => {
  const {
    mutate: createBooking,
    isPending,
    error,
    data,
  } = useMutation({
    mutationKey: ["create-book"],

    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post(`/bookings`, payload);

      return data;
    },
  });

  return { createBooking, isPending, error, data };
};
