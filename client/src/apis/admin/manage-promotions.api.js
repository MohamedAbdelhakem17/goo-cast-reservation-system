import { axiosInstanceV2 } from "@/utils/axios-instance";
import { useQuery } from "@tanstack/react-query";

const useGetActivePromotions = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["active-promotions"],
    queryFn: async () => {
      const { data } = await axiosInstanceV2("promotions/active");

      return data;
    },
  });

  return { data, error, isLoading };
};

export { useGetActivePromotions };
