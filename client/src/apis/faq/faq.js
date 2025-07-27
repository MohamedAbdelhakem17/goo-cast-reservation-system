

import {
  useGetData,
  usePostData,
  useUpdateData,
  useDeleteData,
} from "../../hooks/useApi";
import BASE_URL from "../BASE_URL";

const GetAllFaqs = () => {
  return useGetData(["faqs"], `${BASE_URL}/faq`);
};

const CreateNewFaqs = () => {
  return usePostData(["faqs"], `${BASE_URL}/faq`);
};

const UpdateFaqs = () => {
  return useUpdateData(["faqs"], `${BASE_URL}/faq/`);
};

const DeleteFaqs = () => {
  return useDeleteData(["faqs"], `${BASE_URL}/faq/`);
};

export { GetAllFaqs, CreateNewFaqs, UpdateFaqs, DeleteFaqs };
