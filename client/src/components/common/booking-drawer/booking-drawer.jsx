import { useGetSingleBooking } from "@/apis/admin/manage-booking.api";
import { Loading } from "@/components/common";
import { AnimatePresence, motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ActivityTab from "./activity-tab";
import ContactTab from "./contact-tab";
import DetailsTab from "./details-tab";

export default function BookingDrawer({ open, onClose, bookingId, direction = "ltr" }) {
  // Query
  const { singleBooking, isLoading } = useGetSingleBooking(bookingId);
  const bookingData = singleBooking?.data;

  // TABS as object
  const TABS = {
    details: {
      id: "details",
      label: "Details",
      element: <DetailsTab booking={bookingData} />,
    },
    activity: {
      id: "activity",
      label: "Activity",
      element: <ActivityTab bookingId={bookingId} />,
    },
    contact: {
      id: "contact",
      label: "Contact",
      element: <ContactTab userProfile={bookingData?.personalInfo} />,
    },
  };

  // Convert object to array for mapping
  const TABS_ARRAY = Object.values(TABS);

  // State
  const [activeTab, setActiveTab] = useState(TABS.details.id);

  // Ref
  const drawerRef = useRef(null);

  // Function to change active tab
  const changeActiveTab = (tabId) => {
    if (TABS[tabId]) setActiveTab(tabId);
    else setActiveTab(TABS_ARRAY[0].id);
  };

  // Variables
  const isRTL = direction === "rtl";
  const drawerVariants = {
    hidden: { x: isRTL ? -800 : 800 },
    visible: { x: 0 },
    exit: { x: isRTL ? -800 : 800 },
  };

  /* ESC Key Close */
  useEffect(() => {
    const escHandler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [onClose]);

  /* Auto Focus Trap inside Drawer */
  useEffect(() => {
    if (open) {
      const drawer = drawerRef.current;
      const focusable = drawer?.querySelectorAll("button, a, input, textarea, select");
      focusable?.[0]?.focus();
    }
  }, [open]);

  // Variables
  const bookingTitle = `#${bookingId?.slice(0, 6)} - ${bookingData?.personalInfo?.fullName || "goocast"} - ${bookingData?.package?.name?.en}`;

  // Loading case
  if (isLoading) return <Loading />;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            className="fixed top-0 z-50 flex h-full w-[90%] flex-col bg-white shadow-xl md:w-[800px]"
            style={{ [isRTL ? "left" : "right"]: 0 }}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between px-4 pt-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">{bookingTitle}</p>
                <span className="bg-main rounded-full px-4 py-1 text-xs font-bold text-white">
                  {bookingData?.status}
                </span>
              </div>
              <button
                title="Close Drawer"
                onClick={onClose}
                className="cursor-pointer text-gray-600 transition hover:text-red-500"
              >
                <CircleX size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-evenly bg-gray-50 py-1.5">
              {TABS_ARRAY.map((tab) => {
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => changeActiveTab(tab.id)}
                    className={`cursor-pointer rounded-md px-5 py-1 text-sm font-medium capitalize transition-all duration-200 ${
                      active
                        ? "bg-main scale-105 text-white shadow-md"
                        : "text-main border-main/30 hover:bg-main/10 border bg-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">{TABS[activeTab].element}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
