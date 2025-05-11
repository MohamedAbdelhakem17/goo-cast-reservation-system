import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import BASE_URL from "../BASE_URL";
import { useLocation } from "react-router-dom";
import { useGetData, usePostData, useUpdateData } from "../../hooks/useApi";

const sortedStudioId = JSON.parse(localStorage.getItem("bookingData"))?.studio?.id

const GetFullBookedStudios = (studioId) => useGetData(["fullBookedStudios"], `/bookings/fully-booked/${`${studioId || sortedStudioId}`}`,

);

// const GetAvailableStudio = (date)=>useGetData([`availableStudios-${sortedDate}`] ,   `/bookings/available-studios/${`${date || sortedDate}`}`)
const useGetAvailableStudio = () => {
    const sortedDate = JSON.parse(localStorage.getItem("bookingData"))?.date

    return useQuery({
        queryKey: ["availableStudios", sortedDate],
        queryFn: async () => {
            const res = await axios.get(BASE_URL + "/bookings/available-studios/"+sortedDate)
            return res.data
        },
        onSuccess: () => {
            console.log(sortedDate)
        },
        cacheTime: 0,
        staleTime: 0
        
    })
}


const GetAvailableSlots = () => {
    const sortedDate = JSON.parse(localStorage.getItem("bookingData"))
    return useMutation({
        mutationFn: async ({ studioId, date }) => {
            const res = await axios.post(`${BASE_URL}/bookings/available-slots`, {
                studioId: studioId || sortedDate?.studio?.id,
                date : date || sortedDate?.date ,
            });
            return res.data;
        },
    });
};

const GetAvailableEndSlots = () => {
    const { state } = useLocation()
    return useMutation({
        mutationFn: async ({ studioId, date, startTime  ,   package_id}) => {
            const res = await axios.post(`${BASE_URL}/bookings/available-end-slots`, {
                studioId: studioId || state.studio.id,
                date,
                startTime,
                package: package_id
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
    GetFullBookedStudios, GetAvailableSlots, GetBookings, ChangeBookingStatus, GetAvailableEndSlots, CreateBooking, GetUserBookings, useGetAvailableStudio
}

