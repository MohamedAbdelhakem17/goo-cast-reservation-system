import axiosInstance from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";

// Get User Data
export function useGetUserData() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const { data } = await axiosInstance("/user");
      return data;
    },
  });

  return { userData: data, isLoading, error };
}

// Get User Stats
export function useGetUserStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userDataStats"],
    queryFn: async () => {
      const { data } = await axiosInstance("/user/user-stats");
      return data;
    },
  });

  return { userDataStats: data, isLoading, error };
}

// Update User Data
export function useUpdateUserData() {
  const { mutate, error, isPending, isSuccess } = useMutation({
    mutationKey: ["updateUserData"],
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.put("/user", payload);
      return data;
    },
  });

  return {
    updateUserData: mutate,
    error,
    isPending,
    isSuccess,
  };
}

export function useEditPassword() {
  const { mutate, error, isPending, isSuccess } = useMutation({
    mutationKey: ["editUserPassword"],
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.put("/user/edit-password", payload);
      return data;
    },
  });

  return {
    editUserPassword: mutate,
    error,
    isPending,
    isSuccess,
  };
}

export { useGetUserData, useGetUserStats, useUpdateUserData, useEditPassword };
