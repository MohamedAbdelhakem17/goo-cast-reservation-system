import React from 'react'

export default function SelectDateTime() {
    return (
        <div className="space-y-4">
            <p className="text-gray-700">Select your preferred date and time for the booking.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input type="time" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
            </div>
        </div>
    )
}
