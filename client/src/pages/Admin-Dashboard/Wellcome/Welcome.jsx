import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GetDashboardStats } from '../../../apis/analytics/analytics.api';
import { GetBookings } from '../../../apis/Booking/booking.api';
import { motion, AnimatePresence } from 'framer-motion';
import BookingTrendsChart from '../../../components/Admin-Dashboard/BookingTrendsChart/BookingTrendsChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MostUserActive from '../../../components/Admin-Dashboard/Wellcome/Most-User-Active/MostUserActive';

const Welcome = () => {
    const { data: statsData, isLoading } = GetDashboardStats();
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: 'EGP',
        }).format(amount);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    const {
        totalStudios,
        totalBookings,
        totalRevenue,
        mostBookedStudios,
        mostBookedPackages,
        mostBookedAddOns,
        mostBookedDay,
        mostBookedUser
    } = statsData?.data || {};

    const peakBookingDay = mostBookedDay?.reduce((max, current) =>
        (current.count > max.count) ? current : max
        , mostBookedDay[0]);

    // const formatChartData = (items) => {
    //     return items?.map(item => ({
    //         name: item.label,
    //         value: item.count
    //     })) || [];
    // };


    return (
        <motion.div
            className="px-6 py-10 min-h-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-4xl font-extrabold text-gray-800 mb-5">📊 Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Studios"
                    value={totalStudios || 0}
                    color="indigo"
                    icon="🏢"
                />
                <StatCard
                    label="Bookings"
                    value={totalBookings || 0}
                    subValue={peakBookingDay ? `Peak: ${new Date(peakBookingDay.label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${peakBookingDay.count})` : null}
                    color="emerald"
                    icon="📅"
                />
                <StatCard
                    label="Revenue"
                    value={formatCurrency(totalRevenue || 0)}
                    color="amber"
                    icon="💰"
                />
            </div>

            {/* Most Booked Items Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <TopItemsCard
                        label="Most Booked Studios"
                        value={mostBookedStudios ? mostBookedStudios[0] : {}}
                        icon="🎥"
                        color="purple"
                    />

                </div>

                <div>
                    <TopItemsCard
                        label="Popular Packages"
                        value={mostBookedPackages ? mostBookedPackages[0] : {}}
                        icon="📦"
                        color="blue"
                    />

                </div>

                <div>
                    <TopItemsCard
                        label="Top Add-ons"
                        value={mostBookedAddOns ? mostBookedAddOns[0] : {}}
                        icon="➕"
                        color="pink"
                    />

                </div>
            </div>

            <MostUserActive userData={statsData?.data.mostBookedUser} />
            {mostBookedDay && mostBookedDay.length > 0 && (
                <div className="mb-8">
                    {/* <BookingTrendsChart data={mostBookedDay} /> */}
                </div>
            )}

            {/* <GoogleCalendarConnect /> */}
        </motion.div>
    );
};

const StatCard = ({ label, value, color, icon }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-500',
        emerald: 'bg-emerald-50 text-emerald-500',
        amber: 'bg-amber-50 text-amber-500',
    };

    return (
        <motion.div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-2">{label}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
            </div>
        </motion.div>
    );
};

const TopItemsCard = ({ label, value, icon }) => {


    return (
        <motion.div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col gap-4">
                {/* Icon and Label in a row */}
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <p className="text-gray-500 text-sm">{label}</p>
                </div>

                {/* Value display */}
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-gray-800">{value.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{value.count}</p>
                </div>
            </div>
        </motion.div>
    );
};



function GoogleCalendarConnect() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { data: bookingsData } = GetBookings({
        page: 1,
        limit: 100
    });

    useEffect(() => {
        if (bookingsData?.data?.bookings) {
            const bookingEvents = bookingsData.data.bookings.map(booking => ({
                title: `${booking.personalInfo.fullName} - ${booking?.studio?.name}`,
                start: new Date(booking.date).toISOString(),
                end: new Date(new Date(booking.date).getTime() + booking.duration * 60 * 60 * 1000).toISOString(),
                description: `Status: ${booking.status}`,
                backgroundColor: getStatusColor(booking.status),
                borderColor: getStatusColor(booking.status),
                textColor: '#ffffff',
                classNames: ['booking-event'],
                extendedProps: {
                    booking: booking
                }
            }));
            setEvents(bookingEvents);
        }
    }, [bookingsData]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return '#10B981'; // Emerald-500
            case 'rejected':
                return '#EF4444'; // Red-500
            default:
                return '#F59E0B'; // Amber-500
        }
    };

    const handleEventClick = (info) => {
        setSelectedEvent(info.event.extendedProps.booking);
    };

    return (
        <div className="mt-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">📅 Booking Calendar</h2>
                    <p className="text-gray-600">View and manage all studio bookings in one place</p>
                </div>
                <div className="calendar-container">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={3}
                        events={events}
                        eventClick={handleEventClick}
                        height="auto"
                        contentHeight="auto"
                        aspectRatio={2}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: true
                        }}
                        slotMinTime="06:00:00"
                        slotMaxTime="24:00:00"
                        allDaySlot={false}
                        slotDuration="01:00:00"
                        expandRows={true}
                        stickyHeaderDates={true}
                        locale="en"
                        buttonText={{
                            today: 'Today',
                            month: 'Month',
                            week: 'Week',
                            day: 'Day'
                        }}
                        dayHeaderFormat={{
                            weekday: 'short',
                            month: 'numeric',
                            day: 'numeric',
                            omitCommas: true
                        }}
                    />
                </div>
            </div>

            {/* Event Details Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Booking Details</h3>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <i className="fa-solid fa-xmark text-xl"></i>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Client</h4>
                                    <p className="text-gray-800">{selectedEvent.personalInfo.fullName}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Studio</h4>
                                    <p className="text-gray-800">{selectedEvent.studio.name}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                                    <p className="text-gray-800">
                                        {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        {' at '}
                                        {selectedEvent.timeSlot}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                                    <p className="text-gray-800">{selectedEvent.duration} hour(s)</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                                        ${selectedEvent.status === 'approved'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : selectedEvent.status === 'rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx="true">{`
                .calendar-container {
                    margin-top: 1rem;
                }

                .booking-event {
                    border-radius: 8px;
                    padding: 6px 8px;
                    font-weight: 500;
                    font-size: 0.875rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: all 0.2s ease;
                }

                .fc-event {
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border: none !important;
                }

                .fc-event:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .fc-header-toolbar {
                    margin-bottom: 1.5em !important;
                    background: linear-gradient(135deg, #ed1e26 0%, #ff4b51 100%);
                    border-radius: 12px;
                    padding: 1rem;
                    color: white;
                }

                .fc-toolbar-title {
                    font-size: 1.25rem !important;
                    font-weight: 600 !important;
                }

                .fc-button-primary {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    border-color: rgba(255, 255, 255, 0.2) !important;
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .fc-button-primary:hover {
                    background-color: rgba(255, 255, 255, 0.2) !important;
                    border-color: rgba(255, 255, 255, 0.3) !important;
                    transform: translateY(-1px);
                }

                .fc-button-active {
                    background-color: rgba(255, 255, 255, 0.25) !important;
                    border-color: rgba(255, 255, 255, 0.35) !important;
                }

                .fc-day-today {
                    background-color: #FEF3F2 !important;
                    border: 1px solid #FECDD3 !important;
                }

                .fc-day-other {
                    background-color: #F9FAFB;
                }

                .fc-scrollgrid {
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #E5E7EB !important;
                }

                .fc-scrollgrid td, .fc-scrollgrid th {
                    border: 1px solid #E5E7EB !important;
                }

                .fc-col-header {
                    background-color: #F3F4F6;
                }

                .fc-col-header-cell {
                    padding: 12px 0;
                }

                .fc-daygrid-day-number {
                    font-weight: 500;
                    color: #374151;
                    padding: 8px;
                }

                .fc-daygrid-day:hover {
                    background-color: #F9FAFB;
                }

                @media (max-width: 640px) {
                    .fc-header-toolbar {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .fc-toolbar-chunk {
                        display: flex;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default Welcome;