import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios-instance";
import { appendDataToFormData } from "@/utils/append-fom-data";

export const useGetAllPackages = (status) => {
  const url =
    status === "all"
      ? "/hourly-packages"
      : `/hourly-packages?status=${encodeURIComponent(status)}`;

  const {
    data: packages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["packages", status],
    queryFn: async () => {
      const { data } = await axiosInstance(url);

      return data;
    },
  });

  return { packages, isLoading, error };
};

export const useGetPackagesByCategory = (id) => {
  const {
    data: packagesInCategory,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["package-category", id],

    queryFn: async () => {
      const { data } = await axiosInstance(`/hourly-packages/category/${id}`);

      return data;
    },
  });

  return { packagesInCategory, isLoading, error };
};

export const AddNewPackage = () => {
  const {
    mutate: createPackage,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      const formData = appendDataToFormData(payload);

      const { data } = await axios.post(`${API_BASE_URL}/hourly-packages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
  });

  return { createPackage, isPending, error };
};

export const useDeletePackage = () => {
  const { mutate: deletePackage, isPending } = useMutation({
    mutationKey: ["delete-package"],

    mutationFn: async (packageId) => {
      const { data } = await axiosInstance.delete(`/hourly-packages/${packageId}`);

      return data;
    },
  });

  return { deletePackage, isPending };
};

export const useUpdatePackage = () => {
  const {
    mutate: updatePackage,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ id, payload }) => {
      const formData = appendDataToFormData(payload);

      const { data } = await axiosInstance.put(`/hourly-packages/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
  });

  return { updatePackage, isPending, error };
};

export const useChangePackageStatus = () => {
  const { mutate: changeStatus, isPending } = useMutation({
    mutationKey: ["change-package-status"],

    mutationFn: async ({ payload, id }) => {
      const { data } = await axiosInstance.put(`/hourly-packages/change-status/${id}`, {
        is_active: payload,
      });

      return data;
    },
  });

  return { changeStatus, isPending };
};
