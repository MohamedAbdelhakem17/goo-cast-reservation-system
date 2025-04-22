import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BASE_URL from "../BASE_URL";



const useGetAllStudios = () => {
    return useQuery({
        queryKey: ["studios"],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/studio`);
                return data;
            } catch (error) {
                console.error("Error fetching studios:", error);
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

const GetStudioByID = (studioId) => {
    return useQuery({
        queryKey: ["studios", studioId],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/studio/${studioId}`);
                return data;
            } catch (error) {
                console.error("Error fetching studios:", error);
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

const DeleteStudio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (studioId) => {
            try {
                const { data } = await axios.delete(`${BASE_URL}/studio/${studioId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return data;
            } catch (error) {
                console.error("Error fetching studios:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["studios"]);
        },
    })
};

const UpdateStudio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            try {
                const response = await axios.patch(`${BASE_URL}/studio/${id}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return response.data;
            } catch (error) {
                console.error("Error updating studio:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["studios"]);
        },
    });
};

export default useGetAllStudios;
export { GetStudioByID, DeleteStudio, UpdateStudio };