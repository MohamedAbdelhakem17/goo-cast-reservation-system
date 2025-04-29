import { useDeleteData, useGetData, usePostData, useUpdateData } from "../../hooks/useApi";
import BASE_URL from "../BASE_URL";

// ================== Price Rules ================
export const GetPriceRules = (studioId) => {
    return useGetData(["fullBookedStudios", studioId], `${BASE_URL}/price-rules/${studioId}`);
};

export const AddPriceRule = (studioId) => {
    return usePostData(["fullBookedStudios", studioId], `${BASE_URL}/price-rules`);
}

export const UpdatedPriceRules = (studioId) => {
    return useUpdateData(["fullBookedStudios", studioId], `${BASE_URL}/price-rules`);
}

export const DeletePriceRule = (studioId) => {
    return useDeleteData(["fullBookedStudios", studioId], `${BASE_URL}/price-rules`);
};

// ================== Price Base ================

export const ChangePriceBase = () => {
    return useUpdateData(["fullBookedStudios"], `${BASE_URL}/studio/changePrice`);
}


// ================== Price Expiation day  ================