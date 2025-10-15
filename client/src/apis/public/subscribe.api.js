import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";

export const useNewsLetterSubscribe = () => {
  const { mutate: subscribe, isPending } = useMutation({
    mutationKey: ["subscribe"],

    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/subscribe", payload);

      return data;
    },
  });

  return {
    subscribe,
    isPending,
  };
};
