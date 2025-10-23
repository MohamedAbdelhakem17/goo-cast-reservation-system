import axiosInstance from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { appendDataToFormData } from "@/utils/append-fom-data";

export const useGetAddons = (status) => {
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

export const useGetSingleAddon = (id) => {
  const { data: singleAddon } = useQuery({
    queryKey: ["single-addon", id],

    queryFn: async () => {
      const { data } = await axiosInstance("/add-ons/" + id);

      return data;
    },
    enabled: !!id,
  });

  return { singleAddon };
};

export const useAddNewAddon = () => {
  const { mutate, isPending, error } = useMutation({
    mutationKey: ["add-addon"],

    mutationFn: async (payload) => {
      const formData = appendDataToFormData(payload);

      const { data } = await axiosInstance.post("/add-ons", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
  });

  return { addAddon: mutate, isPending, error };
};

export const useEditAddons = () => {
  const { mutate, isPending, error } = useMutation({
    mutationKey: ["edit-addons"],

    mutationFn: async ({ payload, id }) => {
      const formData = appendDataToFormData(payload);

      const { data } = await axiosInstance.put(`/add-ons/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
  });

  return { editAddons: mutate, isPending, error };
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

export const useDeleteAddon = () => {
  const { isPending, mutate } = useMutation({
    mutationKey: ["delete-addon"],
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/add-ons/${id}`);

      return data;
    },
  });

  return { deleteAddon: mutate, isPending };
};
