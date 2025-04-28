import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../apis/axiosInstance";

export const useGetData = (key, url, filters = {}) => {
    const { status, studioId, date, page = 1, limit = 10 } = filters;

    return useQuery({
        queryKey: [...key, status, studioId, date, page, limit],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();
                if (status) params.append("status", status);
                if (studioId) params.append("studioId", studioId);
                if (date) params.append("date", date);
                params.append("page", page.toString());
                params.append("limit", limit.toString());

                const { data } = await axiosInstance.get(`${url}?${params.toString()}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                return data;
            } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        },
    });
};

export const usePostData = (key, url) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post(url, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries([key]);
        },
    });
};

export const useUpdateData = (key, url) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }) => {
            const base_url = id ? `${url}/${id}` : url;
            const { data } = await axiosInstance.put(base_url, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries([key]);
        },
    });
};

export const useDeleteData = (key, url) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }) => {
            const base_url = id ? `${url}/${id}` : url;
            console.log(base_url);
            console.log(payload);
            const { data } = await axiosInstance.delete(base_url, {
                data: payload, 
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries([key]);
        },
    });
};

