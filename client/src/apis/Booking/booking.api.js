import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import BASE_URL from "../BASE_URL";
import { useLocation } from "react-router-dom";
import { useGetData, usePostData, useUpdateData } from "../../hooks/useApi";

const sortedStudioId = JSON.parse(localStorage.getItem("bookingData"))?.studio
  ?.id;

const fetchFullyBookedDates = async ({ studioId, duration }) => {
  if (!studioId || !duration) return []; 

  const res = await axios.get(`${BASE_URL}/booking/fully-booked/${studioId}`, {
    params: { duration },
  });

  return res?.data?.data || [];
};

const GetFullBookedStudios = (studioId, duration) => {
  return useQuery({
    queryKey: ["fullyBookedDates", studioId, duration],
    queryFn: () => fetchFullyBookedDates({ studioId, duration }),
    enabled: !!studioId && !!duration,
    staleTime: 5 * 60 * 1000,
  });
};

// const GetAvailableStudio = (date)=>useGetData([`availableStudios-${sortedDate}`] ,   `/bookings/available-studios/${`${date || sortedDate}`}`)
const useGetAvailableStudio = () => {
  const sortedDate = JSON.parse(localStorage.getItem("bookingData"))?.date;
  const category_id = JSON.parse(localStorage.getItem("bookingData"))
    ?.selectedPackage?.category;

  return useQuery({
    queryKey: ["availableStudios", sortedDate],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}/bookings/available-studios/${sortedDate}/${category_id}`
      );
      return res.data;
    },
    cacheTime: 0,
    staleTime: 0,
  });
};

const GetAvailableSlots = () => {
  const sortedDate = JSON.parse(localStorage.getItem("bookingData"));
  return useMutation({
    mutationFn: async ({ studioId, date, duration }) => {
      console.log({ studioId, date, duration });
      const res = await axios.post(`${BASE_URL}/bookings/available-slots`, {
        studioId: studioId,
        date: date,
        duration: duration || 2,
      });
      return res.data;
    },
  });
};

const GetAvailableEndSlots = () => {
  const { state } = useLocation();
  return useMutation({
    mutationFn: async ({ studioId, date, startTime, package_id }) => {
      const res = await axios.post(`${BASE_URL}/bookings/available-end-slots`, {
        studioId: studioId || state.studio.id,
        date,
        startTime,
        package: package_id,
      });
      return res.data;
    },
  });
};

const GetBookings = (filters) =>
  useGetData("bookings", `${BASE_URL}/bookings`, filters);

const ChangeBookingStatus = () =>
  useUpdateData("bookings", `${BASE_URL}/bookings`);

const CreateBooking = () => usePostData("bookings", `${BASE_URL}/bookings`);

const GetUserBookings = () =>
  useGetData("userBookings", `${BASE_URL}/bookings/user-bookings`);

export {
  GetFullBookedStudios,
  GetAvailableSlots,
  GetBookings,
  ChangeBookingStatus,
  GetAvailableEndSlots,
  CreateBooking,
  GetUserBookings,
  useGetAvailableStudio,
};
