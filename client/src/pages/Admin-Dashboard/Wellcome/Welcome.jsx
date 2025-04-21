import React from 'react';
import { GetDashboardStats } from '../../../apis/analytics/analytics.api';

const Welcome = () => {
    const { data: statsData, isLoading } = GetDashboardStats();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: 'EGP',
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
            </div>
        );
    }

    const { totalStudios, totalBookings, totalRevenue } = statsData?.data || {};

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
            <p className="mb-6">Here you can manage studios, prices, and services.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Studios</h2>
                    <p className="text-2xl font-bold">{totalStudios || 0}</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Bookings</h2>
                    <p className="text-2xl font-bold">{totalBookings || 0}</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-2xl font-bold">{formatCurrency(totalRevenue || 0)}</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;