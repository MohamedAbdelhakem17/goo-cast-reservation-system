import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";

export const useApplyCoupon = () => {
  const { mutate: applyCoupon, isPending } = useMutation({
    mutationKey: ["apply-coupon"],

    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/coupon/apply-coupon", payload);

      return data;
    },
  });

  return {
    applyCoupon,
    isPending,
  };
};
