import { useDeleteData, useGetData, usePostData, useUpdateData } from "../../hooks/useApi";
import BASE_URL from "../BASE_URL";

// ================== Price Rules ================
export const GetPriceRules = (studioId) => {
    return useGetData(["priceRules", studioId], `${BASE_URL}/price-rules/${studioId}`);
};

export const AddPriceRule = (studioId) => {
    return usePostData(["priceRules", studioId], `${BASE_URL}/price-rules`);
}

export const UpdatedPriceRules = (studioId) => {
    return useUpdateData(["priceRules", studioId], `${BASE_URL}/price-rules`);
}

export const DeletePriceRule = (studioId) => {
    return useDeleteData(["priceRules", studioId], `${BASE_URL}/price-rules`);
};

// ================== Price Base ================

export const ChangePriceBase = () => {
    return useUpdateData(["priceRules"], `${BASE_URL}/studio/changePrice`);
}


// ================== Price Expiation day  ================

export const GetPriceExceptions = (studioId) => {
    return useGetData(["priceExceptions", studioId], `${BASE_URL}/price-exceptions/${studioId}`);
};

export const AddPriceExceptions = (studioId) => {
    return usePostData(["priceExceptions", studioId], `${BASE_URL}/price-exceptions`);
}

export const UpdatedPriceExceptions = (studioId) => {
    return useUpdateData(["priceExceptions", studioId], `${BASE_URL}/price-exceptions`);
}

export const DeletePriceExceptions = (studioId) => {
    return useDeleteData(["priceExceptions", studioId], `${BASE_URL}/price-exceptions`);
};