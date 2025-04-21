import { useState } from "react";
import useGetAllStudios from "../../../../apis/studios/studios.api";

export default function HeaderAndFilter({ onFilterChange }) {
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterStudio, setFilterStudio] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const { data: studiosData } = useGetAllStudios();

    const handleFilterChange = (field, value) => {
        const newFilters = {
            status: filterStatus,
            studioId: filterStudio,
            date: filterDate
        };

        if (field === 'status') {
            setFilterStatus(value);
            newFilters.status = value;
        }
        if (field === 'studio') {
            setFilterStudio(value);
            newFilters.studioId = value;
        }
        if (field === 'date') {
            setFilterDate(value);
            newFilters.date = value;
        }

        onFilterChange(newFilters);
    };


    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>

            <div className="flex gap-2">
                <select
                    value={filterStudio}
                    onChange={(e) => handleFilterChange('studio', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                >
                    <option value="">All Studios</option>
                    {studiosData?.data?.map((studio) => (
                        <option key={studio._id} value={studio._id}>
                            {studio.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                />

                <select
                    value={filterStatus}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
        </div>
    );
}