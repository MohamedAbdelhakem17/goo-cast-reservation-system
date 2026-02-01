import axiosInstance, { axiosInstanceV2 } from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useGetAvailableSlots = (version = "v1") => {
  const {
    mutate: getSlots,
    data,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["available-slots"],

    mutationFn: async (payload) => {
      const instance = version === "v2" ? axiosInstanceV2 : axiosInstance;

      const { data } = await instance.post(`/bookings/available-slots`, payload);

      return data;
    },
  });

  return { getSlots, data, isPending, error };
};

export const useCreateBooking = (role) => {
  const {
    mutate: createBooking,
    isPending,
    error,
    data,
  } = useMutation({
    mutationKey: ["create-book"],

    mutationFn: async (payload) => {
      const url = role === "admin" ? "/bookings/admin/create" : "/bookings";
      const { data } = await axiosInstance.post(url, payload);

      return data;
    },
    retry: 0,
  });

  return { createBooking, isPending, error, data };
};

export const useGetAvailableStudios = (queryParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["available-studios", queryParams],

    queryFn: async () => {
      const queryString = new URLSearchParams(queryParams).toString();

      const { data } = await axiosInstanceV2(
        `/bookings/available-studios?${queryString}`,
      );
      return data;
    },

    enabled: !!queryParams.date && !!queryParams.startSlot,
    cacheTime: 0,
    staleTime: 0,
  });

  return { data, isLoading, error };
};
