import { useChangeBookingStatus, useGetBookings } from "@/apis/admin/manage-booking.api";
import { BookingDrawer, Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import { Kanban, Table2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Link, useSearchParams } from "react-router-dom";

import DisplayBookingData from "./_components/display-booking-data";
import BookingEditModal from "./_components/edit-booking/booking-edit-modal";
import HeaderAndFilter from "./_components/header-and-filter";
import BookingKanban from "./_components/kanban-board/_kanban-booking";
import Pagination from "./_components/pagination";

export default function BookingManagement() {
  const { t } = useLocalization();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [displayType, setDisplayType] = useState(() => {
    const storedType = localStorage.getItem("display-type");
    return storedType || "kanban";
  });

  const ITEMS_PER_PAGE = displayType === "kanban" ? 1000 : 10;
  const currentPageRef = useRef(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = {
    status: searchParams.get("status") || "",
    studioId: searchParams.get("studioId") || "",
    date: searchParams.get("date") || "",
    range: searchParams.get("range") || "",
    searchId: searchParams.get("searchId") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: ITEMS_PER_PAGE,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingToEdit, setSelectedBookingToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // replace handleChangeDisplay with this:
  const handleChangeDisplay = () => {
    setDisplayType((prev) => {
      const newType = prev === "kanban" ? "table" : "kanban";
      localStorage.setItem("display-type", newType);

      setFilters((prevFilters) => {
        if (newType === "kanban") {
          return {
            ...prevFilters,
            page: 1,
            limit: 1000,
          };
        } else {
          return {
            ...prevFilters,
            page: currentPageRef.current || 1,
            limit: 10,
          };
        }
      });

      return newType;
    });
  };

  useEffect(() => {
    const params = {};

    if (filters.status) params.status = filters.status;
    if (filters.studioId) params.studioId = filters.studioId;
    if (filters.date) params.date = filters.date;
    if (filters.range) params.range = filters.range;
    if (filters.searchId) params.searchId = filters.searchId;

    if (displayType === "table" && filters.page > 1) {
      params.page = filters.page;
    }

    setSearchParams(params);
  }, [
    filters.status,
    filters.studioId,
    filters.date,
    filters.range,
    filters.searchId,
    filters.page,
    displayType,
    setSearchParams,
  ]);

  const {
    data: bookingsData,
    isLoading,
    error,
  } = useGetBookings({
    ...filters,
  });

  const bookings = bookingsData?.data?.bookings || [];
  const filteredBookings = bookings.filter((b) =>
    filters.searchId ? b._id.slice(0, 6).includes(filters.searchId) : true,
  );
  const totalPages = Math.ceil((bookingsData?.data?.total || 0) / ITEMS_PER_PAGE);

  const handleFilterChange = (newFilters) => {
    currentPageRef.current = 1;

    setFilters((prev) => ({
      ...prev,
      status: newFilters.status === "all" ? "" : newFilters.status,
      studioId: newFilters.studioId,
      date: newFilters.date,
      range: newFilters.range || "",
      searchId: newFilters.searchId || "",
      page: currentPageRef.current,
    }));
  };

  const handlePageChange = (newPage) => {
    currentPageRef.current = newPage;
    setFilters({
      ...filters,
      page: currentPageRef.current,
    });
  };

  const { changeStatus } = useChangeBookingStatus();

  const handleStatusChange = (id, status) => {
    changeStatus(
      { id, status },
      {
        onSuccess: ({ message }) => {
          addToast(message || t("status-changed-successfully"), "success");
          queryClient.invalidateQueries({ queryKey: ["get-bookings"] });
        },
        onError: ({ response }) =>
          addToast(response?.data?.message || t("something-went-wrong"), "error"),
      },
    );
  };

  return (
    <div className="grid max-w-screen grid-cols-1 grid-rows-[auto_1fr] py-3 md:py-0">
      <div className="rounded-t-md border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Booking display */}
            <button
              onClick={handleChangeDisplay}
              type="button"
              className="bg-main hover:bg-main/90 border-main flex size-9 items-center justify-center rounded-lg border text-white shadow-sm transition-colors"
              title={
                displayType === "kanban" ? t("switch-to-table") : t("switch-to-kanban")
              }
            >
              {displayType === "kanban" ? <Table2 size={18} /> : <Kanban size={18} />}
            </button>

            <h1 className="text-lg font-semibold text-gray-800">
              {t("bookings-pipeline")}
            </h1>
          </div>

          <Link
            to="add"
            className="bg-main hover:bg-main/90 rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors"
          >
            {t("create-new-booking")}
          </Link>
        </div>

        {/* Filters + Search */}
        <HeaderAndFilter filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Main content */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {displayType === "kanban" && (
            <DndProvider backend={HTML5Backend}>
              <BookingKanban
                bookings={filteredBookings}
                onUpdateBooking={handleStatusChange}
                setSelectedBooking={setSelectedBooking}
                setUpdateBooking={setSelectedBookingToEdit}
              />
            </DndProvider>
          )}

          {displayType === "table" && (
            <>
              <DisplayBookingData
                bookingsData={bookings}
                isLoading={isLoading}
                error={error}
                setSelectedBooking={setSelectedBooking}
                setUpdateBooking={setSelectedBookingToEdit}
              />

              {totalPages > 1 && (
                <Pagination
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  currentPage={currentPageRef.current}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  bookingsData={bookings}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Booking details modal */}
      {selectedBooking && (
        <BookingDrawer
          open={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
          bookingId={selectedBooking?._id}
          direction={"ltr"}
          setActiveTab={setActiveTab}
          setSelectedBookingToEdit={setSelectedBookingToEdit}
        />
      )}

      {/* Edit Modal */}
      {selectedBookingToEdit && (
        <BookingEditModal
          booking={selectedBookingToEdit}
          activeTab={activeTab}
          closeModal={() => {
            setSelectedBookingToEdit(null);
          }}
        />
      )}
    </div>
  );
}
