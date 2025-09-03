import axiosInstance from "@/utils/axios-instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get All User API
const fetchAllUsers = async () => {
  const { data } = await axiosInstance.get("/users");
  return data;
};

export function useGetAllUser() {
  const {
    data: users,
    isLoading,
    error
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  return { data: users, isLoading, error };
}

// Add, Delete and Update User Workspace
const manageWorkspace = async (payload) => {
  const {data} = await axiosInstance.post("user/workspace-mange", payload);
  return data;
};

export function useMangeWorkSpace() {
  const queryClient = useQueryClient();

  const {
    mutate: mangeWorkSpace,
    error,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ["workSpaceMange"],
    mutationFn: manageWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { mangeWorkSpace, error, isPending, isSuccess };
}
