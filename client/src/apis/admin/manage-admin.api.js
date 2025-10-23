import axiosInstance from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAdmins = () => {
  const {
    data: admins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data } = await axiosInstance("/admin");

      return data;
    },
  });

  return { admins, isLoading, error };
};

export const useCreateAdmin = () => {
  const { mutate: createAdmin, isPending } = useMutation({
    // mutation key
    mutationKey: ["add-admin"],

    // Mutation function
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/admin", payload);

      return data;
    },
  });

  return { createAdmin, isPending };
};

export const useChangeAdminsStatus = () => {
  const { mutate: changeStatus, isPending } = useMutation({
    mutationKey: ["change-admin-status"],

    mutationFn: async ({ payload, id }) => {
      const { data } = await axiosInstance.put(`/admin/change-status/${id}`, {
        active: payload,
      });

      return data;
    },
  });

  return { changeStatus, isPending };
};
