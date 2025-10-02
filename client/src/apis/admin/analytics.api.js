import axiosInstance from "@/utils/axios-instance";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardStats = () => {
  const {
    data: statistics,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["dashboard-stats"],

    queryFn: async () => {
      const { data } = await axiosInstance("/analytics/dashboard-stats");

      return data;
    },
  });

  return { statistics, error, isLoading };
};
