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
        enabled: Boolean(studioId),
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
                const formData = new FormData();

                // Basic data
                formData.append("name", data.name);
                formData.append("address", data.address);
                formData.append("basePricePerSlot", data.basePricePerSlot);
                formData.append("isFixedHourly", data.isFixedHourly);
                formData.append("description", data.description);
                formData.append("startTime", data.startTime);
                formData.append("endTime", data.endTime);

                // Thumbnail
                if (data.thumbnail instanceof File) {
                    formData.append("thumbnail", data.thumbnail);
                } else if (typeof data.thumbnail === "string") {
                    // Remove base URL if present
                    const thumbnailName = data.thumbnail.split('/').pop();
                    formData.append("thumbnailUrl", thumbnailName);
                }

                // Images Gallery
                if (data.imagesGallery) {
                    data.imagesGallery.forEach((img) => {
                        if (img instanceof File) {
                            formData.append("imagesGallery", img);
                        } else if (typeof img === "string") {
                            // Remove base URL if present
                            const imageName = img.split('/').pop();
                            formData.append("existingImages[]", imageName);
                        }
                    });
                }

                // facilities
                data.facilities.forEach(facility => {
                    formData.append("facilities[]", facility);
                });

                // equipment
                data.equipment.forEach(item => {
                    formData.append("equipment[]", item);
                });

                const response = await axios.put(`${BASE_URL}/studio/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
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