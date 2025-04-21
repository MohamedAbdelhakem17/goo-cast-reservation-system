import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const GetBookings = (filters = {}) => {
    const { status, studioId, date, page = 1, limit = 10 } = filters;
    return useQuery({
        queryKey: ["bookings", status, studioId, date, page, limit],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();
                if (status) params.append("status", status);
                if (studioId) params.append("studioId", studioId);
                if (date) params.append("date", date);
                params.append("page", page.toString());
                params.append("limit", limit.toString());

                const { data } = await axios.get(`${BASE_URL}/bookings?${params.toString()}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return data;
            } catch (error) {
                console.error("Error fetching bookings:", error);
                throw error; // Re-throw the error so react-query can handle it
            }
        },
    });
};

const ChangeBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }) => {
            console.log(id, status , "FROM API");
            const res = await axios.put(`${BASE_URL}/bookings/${id}`, { status }, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries(["bookings"]);
        },
    })
}
export {
    GetFullBookedStudios, GetAvailableSlots, GetBookings, ChangeBookingStatus
}

