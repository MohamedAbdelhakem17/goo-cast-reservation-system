import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import BASE_URL from "../BASE_URL";


export const GetAllPackages = () => {
    return useQuery({
        queryKey: ["packages"],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/hourly-packages`);
                return data;
            } catch (error) {
                console.error("Error fetching packages:", error);
                throw error;
            }
        }
    });
};

export const GetAllAddOns = () => {
    return useQuery({
        queryKey: ["addons"],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/add-ons`);
                return data;
            } catch (error) {
                console.error("Error fetching add-ons:", error);
                throw error;
            }
        }
    });
};