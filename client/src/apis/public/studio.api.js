import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";

export const useGetStudio = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["studio"],

    queryFn: async () => {
      const { data } = await axiosInstance("/studio");

      return data;
    },
  });

  return { data, isLoading, error };
};
