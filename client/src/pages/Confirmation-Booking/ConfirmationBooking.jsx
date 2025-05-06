import { motion } from "framer-motion";
// import { Calendar, Clock, Package, Gift, User, MapPin, CheckCircle, Share2, Download } from "lucide-react"
import { useState } from "react";
import { useAuth } from "../../context/Auth-Context/AuthContext";
import { useBooking } from "../../context/Booking-Context/BookingContext";
import { useNavigate } from "react-router-dom";

export default function ConfirmationBooking() {
    const { bookingData, handleSubmit } = useBooking();
    const {
        studio,
        date,
        startSlot,
        endSlot,
        duration,
        selectedPackage,
        selectedAddOns,
        personalInfo,
    } = bookingData;

    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null);
    const { isAuthenticated } = useAuth();

    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
            },
        }),
    };

    const totalAddOnPrice =
        selectedAddOns?.reduce((acc, item) => {
            return acc + (item.quantity > 0 ? item.price * item.quantity : 0);
        }, 0) || 0;

    const totalPrice =
        Number(studio?.price || 0) +
        totalAddOnPrice +
        (selectedPackage?.price || 0);

    const goBack = () => {
        localStorage.setItem("bookingStep", 4);
        navigate("/booking?step=personal-information");
    };

    return (
        <div className="max-w-8xl mx-auto p-4 md:p-8 relative overflow-hidden">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
                {/* Top decorative bar */}
                <div className="h-2 bg-gradient-to-r from-main/20 via-main/50 to-main/80"></div>

                <div className="p-6 md:p-10">
                    {/* Confirmation header with status */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 mx-auto mb-4 rounded-full bg-main/60 flex items-center justify-center"
                        >
                            <i className="fa-solid fa-check text-white text-3xl"></i>
                        </motion.div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-main/20 via-main/50 to-main/80">
                            Booking Confirmation
                        </h2>
                        <p className="text-gray-500 mt-2">Your studio session is all set</p>
                    </motion.div>

                    <div className="space-y-6">
                        {/* Studio Info */}
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            onMouseEnter={() => setActiveSection("studio")}
                            onMouseLeave={() => setActiveSection(null)}
                            className={`bg-white p-6 rounded-2xl shadow-lg border ${activeSection === "studio"
                                ? "border-main/70 ring-2 ring-main/50"
                                : "border-gray-100"
                                } transition-all duration-300`}
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-center  md:items-start">
                                <div className="relative w-full md:w-40 h-40 overflow-hidden rounded-xl group">
                                    {studio.image ? (
                                        <>
                                            <img
                                                src={studio.image || "/placeholder.svg"}
                                                alt={studio.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110 h-full w-full"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <i className="fa-regular fa-map-pin w-8 h-8 text-gray-400"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left ">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {studio.name}
                                    </h3>
                                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-main/80 text-white">
                                        Base Price: {studio.price} EGP
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Date & Time */}
                        <motion.div
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            onMouseEnter={() => setActiveSection("date")}
                            onMouseLeave={() => setActiveSection(null)}
                            className={`bg-white p-6 rounded-2xl shadow-lg border ${activeSection === "date"
                                ? "border-main/70 ring-2 ring-main/50"
                                : "border-gray-100"
                                } transition-all duration-300`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="bg-main/80 p-3 rounded-xl">
                                        <i className="fa-regular fa-circle-check text-sm text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-800">
                                            Date & Time
                                        </h4>
                                        <p className="text-gray-700 font-medium mt-1">
                                            {formattedDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-4 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                    <i className="fa-regular fa-clock text-sm text-white"></i>
                                    <div>
                                        <p className="text-gray-700 font-medium">
                                            {startSlot} - {endSlot}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Duration: {duration} hours
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Selected Package */}
                        <motion.div
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            onMouseEnter={() => setActiveSection("package")}
                            onMouseLeave={() => setActiveSection(null)}
                            className={`bg-white p-6 rounded-2xl shadow-lg border ${activeSection === "package"
                                ? "border-main/70 ring-2 ring-main/50"
                                : "border-gray-100"
                                } transition-all duration-300`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="bg-main/80 p-3 rounded-xl">
                                    <i className="fa-solid fa-cube text-sm text-white"></i>
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg text-gray-800">
                                        Selected Package
                                    </h4>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-sm text-gray-500">Package Name</p>
                                            <p className="font-medium text-gray-800">
                                                {selectedPackage.name}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-medium text-gray-800">
                                                {selectedPackage.duration} hours
                                            </p>
                                        </div>

                                        <div className="bg-main/80 p-3 rounded-xl">
                                            <p className="text-sm text-white">Package Price</p>
                                            <p className="font-bold text-white">
                                                {selectedPackage.price} EGP
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Selected Add-ons */}
                        <motion.div
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            onMouseEnter={() => setActiveSection("addons")}
                            onMouseLeave={() => setActiveSection(null)}
                            className={`bg-white p-6 rounded-2xl shadow-lg border ${activeSection === "addons"
                                ? "border-main/70 ring-2 ring-main/50"
                                : "border-gray-100"
                                } transition-all duration-300`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-main/80 p-3 rounded-xl">
                                    <i className="fa-solid fa-puzzle-piece text-sm text-white"></i>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-gray-800">
                                        Selected Add-ons
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Additional services for your session
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                {selectedAddOns.length > 0 ? (
                                    selectedAddOns.map((addOn, index) => (
                                        <motion.div
                                            key={addOn._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-10 bg-gradient-to-b from-main/10 to-main rounded-full"></div>
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {addOn.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {addOn.quantity} × {addOn.price} EGP
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-main">
                                                    {addOn.totalPrice} EGP
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                                        <p className="text-gray-500 italic">No add-ons selected</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Personal Info */}
                        <motion.div
                            custom={4}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            onMouseEnter={() => setActiveSection("personal")}
                            onMouseLeave={() => setActiveSection(null)}
                            className={`bg-white p-6 rounded-2xl shadow-lg border ${activeSection === "personal"
                                ? "border-main/70 ring-2 ring-main/50"
                                : "border-gray-100"
                                } transition-all duration-300`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-main/80 p-3 rounded-xl">
                                    <i className="fa-regular fa-user text-sm text-white"></i>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-gray-800">
                                        Personal Information
                                    </h4>
                                    <p className="text-sm text-gray-500">Your contact details</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium text-gray-800">
                                        {personalInfo.fullName}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium text-gray-800">
                                        {personalInfo.phone}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium text-gray-800">
                                        {personalInfo.email}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-500">Brand</p>
                                    <p className="font-medium text-gray-800">
                                        {personalInfo.brand}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Total Price */}
                        <motion.div
                            custom={5}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            className="relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-main via-main/80 to-main opacity-90 rounded-2xl"></div>

                            <div className="relative p-6 md:p-8 rounded-2xl text-white">
                                <div className="flex flex-col md:flex-row justify-between items-center">
                                    <div>
                                        <h4 className="text-xl font-bold">Total Amount</h4>
                                        <p className="text-white/80 text-sm mt-1">
                                            All prices include taxes and fees
                                        </p>
                                    </div>

                                    <div className="mt-4 md:mt-0 text-center md:text-right">
                                        <p className="text-sm text-white/80">Final Price</p>
                                        <p className="text-4xl font-extrabold">{totalPrice} EGP</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="mt-10 text-center"
                    >
                        {/* Actions  */}

                        <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200 my-3">
                            {!isAuthenticated && (
                                <p className="text-gray-700 mb-4 text-sm md:text-base">
                                    If you already have an account,{" "}
                                    <span className="font-semibold text-main">log in</span> to
                                    confirm your booking, or continue as a guest.
                                </p>
                            )}
                            <div className="flex justify-between items-center flex-row-reverse">
                                {isAuthenticated ? (
                                    <button onClick={handleSubmit} className="px-6 py-3 cursor-pointer bg-main text-white rounded-2xl font-semibold shadow-md hover:bg-main/70 transition">
                                        Confirm Booking
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} className="px-6 py-3 cursor-pointer bg-white border border-gray-300 text-gray-800 rounded-2xl font-semibold shadow-sm hover:bg-gray-100 transition">
                                        Book as Guest
                                    </button>
                                )}

                                <button
                                    onClick={goBack}
                                    className="px-6 py-3 cursor-pointer bg-white border border-gray-300 text-gray-800 rounded-2xl font-semibold shadow-sm hover:bg-gray-100 transition"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
