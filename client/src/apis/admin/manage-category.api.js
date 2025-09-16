import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";

export const useGetAllCategories = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],

    queryFn: async () => {
      const { data } = await axiosInstance("/categories");

      return data;
    },
  });

  return { categories, isLoading, error };
};

export const useCreateCategory = () => {
  const {
    mutate: createCategory,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["add-category"],

    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/categories", payload);

      return { data };
    },
  });

  return { createCategory, isPending, error };
};

export const useUpdateCategory = () => {
  const { mutate: editCategory, isPending } = useMutation({
    mutationKey: ["edit-category"],

    mutationFn: async ({ payload, id }) => {
      const { data } = await axiosInstance.put(`/categories/${id}`, payload);

      return data;
    },
  });

  return { isPending, editCategory };
};

export const useDeleteCategory = () => {
  const {
    mutate: deleteCategory,
    error,
    isPending,
  } = useMutation({
    mutationKey: ["delete-category"],

    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/categories/${id}`);

      return data;
    },
  });

  return { deleteCategory, error, isPending };
};
