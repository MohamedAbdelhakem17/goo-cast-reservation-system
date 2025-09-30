import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingInfoModel from "@/features/booking/_components/booking-info-model";
import {
  NotfoundBooking,
  Pagination,
  UserBookingHeader,
  UserSearchBooking,
} from "./_components";
import { useGetUserData } from "@/apis/users/user.api";

const UserBookings = () => {
  // state
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Query
  const { userBooking, error, isLoading } = useGetUserData();

  // variable
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredBookings?.length / ITEMS_PER_PAGE);
  const bookings = filteredBookings?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // function
  const filteredBookings = userBooking?.data?.filter((booking) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch =
      booking.studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (error)
    return <p className="text-center font-semibold text-red-600">{error.message}</p>;

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* Header */}
      <UserBookingHeader />

      {/* Search and Filter Controls */}
      <UserSearchBooking
        setFilterStatus={setFilterStatus}
        setSearchTerm={setSearchTerm}
      />

      {isLoading ? (
        // Skelton
        <BookingCardSkelton />
      ) : bookings.length === 0 ? (
        //  Notfound booking
        <NotfoundBooking searchTerm={searchTerm} filterStatus={filterStatus} />
      ) : (
        // Booking Grid
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {userBooking?.data?.map((booking, index) => (
            //  Booking Card
            <BookingCard
              booking={booking}
              setSelectedBooking={setSelectedBooking}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}

      {/* Booking modal  */}
      <AnimatePresence>
        {selectedBooking && (
          <BookingInfoModel
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserBookings;
