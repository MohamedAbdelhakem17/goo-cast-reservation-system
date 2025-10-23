import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";

export const useGetAllCoupons = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["coupon"],

    queryFn: async () => {
      const { data } = await axiosInstance("/coupon");

      return data;
    },
  });

  return { data, isLoading, error };
};

export const useCreateNewCoupon = () => {
  const {
    mutate: createCoupon,
    data,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["create-coupon"],

    mutationFn: async (payload) => {
      const { data } = axiosInstance.post("/coupon", payload);

      return data;
    },
  });

  return { data, isPending, error, createCoupon };
};

export const useUpdateCoupon = () => {
  const {
    mutate: editCoupon,
    data,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["edit-coupon"],

    mutationFn: async (payload) => {
      const { id, payload: dataPayload } = payload;
      const { data } = await axiosInstance.put(`/coupon/${id}`, dataPayload);

      return data;
    },
  });

  return { data, isPending, error, editCoupon };
};

export const useDeleteCoupon = () => {
  const {
    mutate: deleteCoupon,
    data,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["delete-coupon"],

    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/coupon/${id}`);

      return data;
    },
  });

  return { data, isPending, error, deleteCoupon };
};
