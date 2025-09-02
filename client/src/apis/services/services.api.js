import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {API_BASE_URL} from "@/constants/config";
import { useDeleteData, useGetData, usePostData, useUpdateData } from "../../hooks/useApi";

// ============ PACKAGES ============
export const GetAllCategories = () => useGetData(["categories"], `${API_BASE_URL}/categories`);
export const CreateCategory = () => usePostData(["category"], `${API_BASE_URL}/categories`);
export const UpdateCategory = (categoryId) => useUpdateData(["categories", categoryId], `${API_BASE_URL}/categories`);
export const DeleteCategory = (categoryId) => useDeleteData(["categories", categoryId], `${API_BASE_URL}/categories`);


// ============ PACKAGES ============
export const GetAllPackages = () => {
    return useQuery({
        queryKey: ["packages"],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/hourly-packages`);
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
                const response = await axios.post(`${API_BASE_URL}/hourly-packages`, data, {
                    headers: {
                        "Content-Type": "application/json",
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
                const { data } = await axios.delete(`${API_BASE_URL}/hourly-packages/${packageId}`, {
                    headers: {
                        "Content-Type": "application/json",
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

export const UpdatePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            try {
                const response = await axios.put(`${API_BASE_URL}/hourly-packages/${id}`, data, {
                    headers: {
                        "Content-Type": "application/json",
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

export const GetPackagesByCategory = () => {
    return useMutation({
        mutationFn: async ({ category }) => {
            const res = await axios.post(`${API_BASE_URL}/hourly-packages/category`, {
                category
            });
            return res.data;
        },
    });
};

// =========== ADD-ONS ============
export const GetAllAddOns = () => {
    return useQuery({
        queryKey: ["addons"],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/add-ons`);
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
                const formData = new FormData();

                // Iterate over data and handle serialization for objects
                Object.entries(data).forEach(([key, value]) => {
                    // Check if the value is an object (and not null or a File object)
                    if (typeof value === 'object' && value !== null && !(value instanceof File)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                });
                const response = await axios.post(`${API_BASE_URL}/add-ons`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
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
};

export const DeleteAddOn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (addOnId) => {
            try {
                const { data } = await axios.delete(`${API_BASE_URL}/add-ons/${addOnId}`, {
                    headers: {
                        "Content-Type": "application/json",
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
                const formData = new FormData();

                // Iterate over data and handle serialization for objects
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'image') {
                        if (value instanceof File) {
                            formData.append("image", value);
                        } else if (typeof value === "string") {
                            const imageName = value.split('/').pop();
                            formData.append("imageUrl", imageName);
                        }
                    } else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                });

                const response = await axios.put(`${API_BASE_URL}/add-ons/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
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
};
