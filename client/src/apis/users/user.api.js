import { useGetData, useUpdateData, usePostData } from "../../hooks/useApi";

const GetUserData = () => useGetData(["getUserData"], "/user");
const UpdateUserData = () => useUpdateData(["updateUserData"], "/user");
const GetUserStats = () => useGetData(["getUserStats"], "/user/user-stats");
const EditPassword = () =>
  useUpdateData(["editPassword"], "/user/edit-password");

const GetAllUser = () => useGetData(["getAllUser"], "/user/all");
const MangeWorkSpace = () =>
  usePostData(["mangeWorkSpace"], "/user/workspace-mange");

export {
  GetUserData,
  UpdateUserData,
  GetUserStats,
  EditPassword,
  GetAllUser,
  MangeWorkSpace,
};
