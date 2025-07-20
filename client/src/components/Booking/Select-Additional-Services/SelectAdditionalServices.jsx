import { AnimatePresence } from 'framer-motion';
import AddOns from './Add-Ons/AddOns';


export default function SelectAdditionalServices() {
    // State to manage the selected service type

    return (
        <>
            {/* Header */}
            <div className="space-y-4 py-4 px-5  duration-300">
                {/* Service Selector */}

                {/* Animated Content */}
                <AnimatePresence mode="wait">
                    <div >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl mb-2">Additional Services</h2>
                            <p className="text-gray-600">Enhance your session with our professional add-ons</p>
                        </div>

                        {<AddOns />}
                    </div>
                </AnimatePresence>
            </div>
        </>
    );
}
