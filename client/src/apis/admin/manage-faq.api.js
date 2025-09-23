import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";

export const useGetAllFaqs = () => {
  const {
    data: faqs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faq"],

    queryFn: async () => {
      const { data } = await axiosInstance("/faq");

      return data;
    },
  });

  return { faqs, isLoading, error };
};
