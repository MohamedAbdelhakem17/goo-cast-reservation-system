import { AnimatePresence } from 'framer-motion';
import AddOns from './Add-Ons/AddOns';


export default function SelectAdditionalServices() {
    // State to manage the selected service type

    return (
        <>
            {/* Header */}
            <div >
                <h4 className="text-4xl font-bold py-2">Additional Service</h4>
                <p className="text-gray-600 text-md mb-5">
                    Do you have additional needs? Our professionals are here for you.
                </p>
            </div>
            <div className="space-y-4 py-4 px-5  duration-300">
                {/* Service Selector */}

                {/* Animated Content */}
                <AnimatePresence mode="wait">
                    <div >
                        {<AddOns />}
                    </div>
                </AnimatePresence>
            </div>
        </>
    );
}
