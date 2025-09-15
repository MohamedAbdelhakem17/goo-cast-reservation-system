import axiosInstance from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetData = (status) => {
  const url =
    status === "all" ? "/add-ons" : `/add-ons?status=${encodeURIComponent(status)}`;

  const {
    data: addons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["addons", status],
    queryFn: async () => {
      const { data } = await axiosInstance(url);

      return data;
    },
  });

  return { addons, isLoading, error };
};

export const useChangeAddonsStatus = () => {
  const { mutate: changeStatus, isPending } = useMutation({
    mutationKey: ["change-addons-status"],

    mutationFn: async ({ payload, id }) => {
      const { data } = await axiosInstance.put(`/add-ons/change-status/${id}`, {
        is_active: payload,
      });

      return data;
    },
  });

  return { changeStatus, isPending };
};
