import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";

export const useGetStudio = (status) => {
  const url =
    status === "all" ? "/studio" : `/studio?status=${encodeURIComponent(status)}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["studio", status],

    queryFn: async () => {
      const { data } = await axiosInstance(url);

      return data;
    },
  });

  return { data, isLoading, error };
};

export const useGetOneStudio = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["studio", id],

    queryFn: async () => {
      const { data } = await axiosInstance("/studio/" + id);

      return data;
    },

    enabled: !!id,
  });

  return { data, isLoading, error };
};
