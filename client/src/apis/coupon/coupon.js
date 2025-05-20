import {
  useGetData,
  usePostData,
  useUpdateData,
  useDeleteData,
} from "../../hooks/useApi";
import BASE_URL from "../BASE_URL";

const GetAllCoupons = () => {
  return useGetData(["coupons"], `${BASE_URL}/coupon`);
};

const CreateNewCoupon = () => {
  return usePostData(["coupons"], `${BASE_URL}/coupon`);
};

const UpdateCoupon = () => {
  return useUpdateData(["coupons"], `${BASE_URL}/coupon/`);
};

const DeleteCoupon = () => {
  return useDeleteData(["coupons"], `${BASE_URL}/coupon/`);
};

const ApplyCoupon = () => {
  return usePostData(["coupons"], `${BASE_URL}/coupon/apply-coupon`);
};

export {
  GetAllCoupons,
  CreateNewCoupon,
  UpdateCoupon,
  DeleteCoupon,
  ApplyCoupon,
};
