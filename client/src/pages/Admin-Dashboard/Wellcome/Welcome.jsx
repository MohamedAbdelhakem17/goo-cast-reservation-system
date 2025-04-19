import React from 'react';

const Welcome = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
            <p className="mb-6">Here you can manage studios, prices, and services.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Studios</h2>
                    <p className="text-2xl font-bold">15</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Bookings</h2>
                    <p className="text-2xl font-bold">120</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-2xl font-bold">$25,000</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;