import { useDeleteData, useGetData, usePostData, useUpdateData } from "../../hooks/useApi";
import {API_BASE_URL} from "@/constants/config";

// ================== Price Rules ================
export const GetPriceRules = (packageId) => {
    return useGetData(["priceRules", packageId], `${API_BASE_URL}/price-rules/${packageId}`);
};

export const AddPriceRule = (studioId) => {
    return usePostData(["priceRules", studioId], `${API_BASE_URL}/price-rules`);
}

export const UpdatedPriceRules = (studioId) => {
    return useUpdateData(["priceRules", studioId], `${API_BASE_URL}/price-rules`);
}

export const DeletePriceRule = (studioId) => {
    return useDeleteData(["priceRules", studioId], `${API_BASE_URL}/price-rules`);
};

// ================== Price Base ================

export const ChangePriceBase = () => {
    return useUpdateData(["priceRules"], `${API_BASE_URL}/studio/changePrice`);
}


// ================== Price Expiation day  ================

export const GetPriceExceptions = (studioId) => {
    return useGetData(["priceExceptions", studioId], `${API_BASE_URL}/price-exceptions/${studioId}`);
};

export const AddPriceExceptions = (studioId) => {
    return usePostData(["priceExceptions", studioId], `${API_BASE_URL}/price-exceptions`);
}

export const UpdatedPriceExceptions = (studioId) => {
    return useUpdateData(["priceExceptions", studioId], `${API_BASE_URL}/price-exceptions`);
}

export const DeletePriceExceptions = (studioId) => {
    return useDeleteData(["priceExceptions", studioId], `${API_BASE_URL}/price-exceptions`);
};


// ================== Package Price mange  ================
export const EditPricePackage = () => {
    return useUpdateData(["pricePackages"], `${API_BASE_URL}/price-rules/`);
}