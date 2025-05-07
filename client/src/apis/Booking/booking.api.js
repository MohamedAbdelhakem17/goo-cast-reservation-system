import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import BASE_URL from "../BASE_URL";
import { useLocation } from "react-router-dom";
import { useGetData, usePostData, useUpdateData } from "../../hooks/useApi";

const sortedStudioId = JSON.parse(localStorage.getItem("bookingData"))?.studio?.id
const GetFullBookedStudios = (studioId) => useGetData(["fullBookedStudios", studioId], `/bookings/fully-booked/${`${studioId || sortedStudioId}`}`);

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

const GetAvailableEndSlots = () => {
    const { state } = useLocation()
    return useMutation({
        mutationFn: async ({ studioId, date, startTime }) => {
            const res = await axios.post(`${BASE_URL}/bookings/available-end-slots`, {
                studioId: studioId || state.studio.id,
                date,
                startTime,
            });
            return res.data;
        },
    });
};

const GetBookings = (filters) => useGetData("bookings", `${BASE_URL}/bookings`, filters);

const ChangeBookingStatus = () => useUpdateData("bookings", `${BASE_URL}/bookings`);

const CreateBooking = () => usePostData("bookings", `${BASE_URL}/bookings`);

const GetUserBookings = () => useGetData("userBookings", `${BASE_URL}/bookings/user-bookings`);

export {
    GetFullBookedStudios, GetAvailableSlots, GetBookings, ChangeBookingStatus, GetAvailableEndSlots, CreateBooking , GetUserBookings
}

