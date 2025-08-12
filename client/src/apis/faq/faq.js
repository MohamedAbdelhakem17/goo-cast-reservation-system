

import {
  useGetData,
  usePostData,
  useUpdateData,
  useDeleteData,
} from "../../hooks/useApi";
import {API_BASE_URL} from "@/constants/config";

const GetAllFaqs = () => {
  return useGetData(["faqs"], `${API_BASE_URL}/faq`);
};

const CreateNewFaqs = () => {
  return usePostData(["faqs"], `${API_BASE_URL}/faq`);
};

const UpdateFaqs = () => {
  return useUpdateData(["faqs"], `${API_BASE_URL}/faq/`);
};

const DeleteFaqs = () => {
  return useDeleteData(["faqs"], `${API_BASE_URL}/faq/`);
};

export { GetAllFaqs, CreateNewFaqs, UpdateFaqs, DeleteFaqs };
