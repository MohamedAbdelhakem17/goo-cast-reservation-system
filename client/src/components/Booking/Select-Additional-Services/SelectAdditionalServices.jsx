import { AnimatePresence } from 'framer-motion';
import AddOns from './Add-Ons/AddOns';


export default function SelectAdditionalServices() {
    // State to manage the selected service type

    return (
        <>
            <p className="text-gray-700 pb-3 text-base sm:text-lg">
                Select your preferred Recording Services for the booking.
            </p>

            <div className="space-y-4 border border-gray-100 py-4 px-5 rounded-2xl shadow-md bg-white transition-all duration-300">
                {/* Service Selector */}

                {/* Animated Content */}
                <AnimatePresence mode="wait">
                    <div >
                        { <AddOns  />}
                    </div>
                </AnimatePresence>
            </div>
        </>
    );
}
