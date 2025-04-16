import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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

export default useGetAllStudios;
export { GetStudioByID }