import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HourlyRecording from './Hourly-Recording/HourlyRecording';
import AddOns from './Add-Ons/AddOns';
import ServiceType from './Service-Type/ServiceType';


export default function SelectAdditionalServices() {
    // State to manage the selected service type
    const [selected, setSelected] = useState("Hourly Recording");

    return (
        <>
            <p className="text-gray-700 pb-3 text-base sm:text-lg">
                Select your preferred Recording Services for the booking.
            </p>

            <div className="space-y-4 border border-gray-100 py-4 px-5 rounded-2xl shadow-md bg-white transition-all duration-300">
                {/* Service Selector */}
                <ServiceType selected={selected} setSelected={setSelected} />

                {/* Animated Content */}
                <AnimatePresence mode="wait">
                    <div >
                        {selected === "Hourly Recording" && <HourlyRecording />}
                        {selected === "Add-Ons" && <AddOns  />}
                    </div>
                </AnimatePresence>
            </div>
        </>
    );
}
