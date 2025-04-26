import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BASE_URL from "../BASE_URL";


// ============ PACKAGES ============
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

export const AddNewPackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            try {
                const response = await axios.post(`${BASE_URL}/hourly-packages`, data, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return response.data;
            } catch (error) {
                console.error("Error adding new package:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["packages"]);
        },
    });
}

export const DeletePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (packageId) => {
            try {
                const { data } = await axios.delete(`${BASE_URL}/hourly-packages/${packageId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return data;
            } catch (error) {
                console.error("Error deleting package:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["packages"]);
        },
    });
}

export  const UpdatePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            try {
                const response = await axios.put(`${BASE_URL}/hourly-packages/${id}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return response.data;
            } catch (error) {
                console.error("Error updating package:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["packages"]);
        },
    });     
}

// =========== ADD-ONS ============
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


export const AddNewAddOn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            try {
                const response = await axios.post(`${BASE_URL}/add-ons`, data, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return response.data;
            } catch (error) {
                console.error("Error adding new add-on:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["addons"]);
        },
    });
}

export const DeleteAddOn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (addOnId) => {
            try {
                const { data } = await axios.delete(`${BASE_URL}/add-ons/${addOnId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return data;
            } catch (error) {
                console.error("Error deleting add-on:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["addons"]);
        },
    });
}

export const UpdateAddOn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            try {
                const response = await axios.put(`${BASE_URL}/add-ons/${id}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return response.data;
            } catch (error) {
                console.error("Error updating add-on:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["addons"]);
        },
    });
}