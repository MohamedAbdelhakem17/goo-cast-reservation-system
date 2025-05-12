import {
  useGetData,
  useUpdateData,
} from "../../hooks/useApi";

const GetUserData = () => useGetData(["getUserData"], "/user");
const UpdateUserData = () => useUpdateData(["updateUserData"], "/user");
const GetUserStats = () => useGetData(["getUserStats"], "/user/user-stats");
const EditPassword = () => useUpdateData(["editPassword"], "/user/edit-password");

export { GetUserData, UpdateUserData, GetUserStats, EditPassword};