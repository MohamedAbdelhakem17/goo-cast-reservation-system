import {
  useGetData,
  usePostData,
  useUpdateData,
  useDeleteData,
} from "../../hooks/useApi";
import {API_BASE_URL} from "@/constants/config";

const GetAllCoupons = () => {
  return useGetData(["coupons"], `${API_BASE_URL}/coupon`);
};

const CreateNewCoupon = () => {
  return usePostData(["coupons"], `${API_BASE_URL}/coupon`);
};

const UpdateCoupon = () => {
  return useUpdateData(["coupons"], `${API_BASE_URL}/coupon/`);
};

const DeleteCoupon = () => {
  return useDeleteData(["coupons"], `${API_BASE_URL}/coupon/`);
};

const ApplyCoupon = () => {
  return usePostData(["coupons"], `${API_BASE_URL}/coupon/apply-coupon`);
};

export {
  GetAllCoupons,
  CreateNewCoupon,
  UpdateCoupon,
  DeleteCoupon,
  ApplyCoupon,
};
  