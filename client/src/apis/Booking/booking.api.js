import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import BASE_URL from "../BASE_URL";
import { useLocation } from "react-router-dom";

const GetFullBookedStudios = (studioId) => {
    return useQuery({
        queryKey: ["fullBookedStudios", studioId],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/bookings/fully-booked/${`${studioId}`}`);
                return data;
            } catch (error) {
                console.error("Error fetching studios:", error);
                throw error;
            }
        },
        enabled: !!studioId
    });
};
const GetAvailableSlots = () => {
    const { state } = useLocation()
    return useMutation({
        mutationFn: async ({ studioId, date, duration }) => {
            const res = await axios.post(`${BASE_URL}/bookings/available-slots`, {
                studioId: studioId || state.studio.id,
                date,
                duration,
            });
            return res.data;
        },
    });
};




export {
    GetFullBookedStudios, GetAvailableSlots
}

