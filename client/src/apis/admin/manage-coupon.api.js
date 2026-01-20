import axiosInstance from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useChangeCouponStatus = () => {
  const {
    mutate: changeStatus,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["change-coupon-status"],
    mutationFn: async ({ payload, id }) => {
      const { data } = await axiosInstance.put(`/coupon/change-status/${id}`, {
        isActive: payload,
      });
      console.log(data);
      return data;
    },
  });
  return { isPending, error, changeStatus };
};

export const useGetAutoApplyCoupon = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["auto-apply-coupon"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/coupon/get-auto-apply-coupon");
      return data;
    },
  });
  return { data, isLoading, error };
};
