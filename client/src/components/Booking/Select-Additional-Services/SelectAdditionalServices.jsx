import { AnimatePresence } from 'framer-motion';
import AddOns from './Add-Ons/AddOns';
import Cart from '../Cart/Cart';

export default function SelectAdditionalServices() {
    return (
        <div className="space-y-4 py-4 px-5 duration-300">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl mb-2">Additional Services</h2>
                <p className="text-gray-600">
                    Enhance your session with our professional add-ons
                </p>
            </div>

            {/* Responsive Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* AddOns takes full width on mobile, 2/3 on large screens */}
                <div className="w-full lg:w-2/3">
                    <AddOns />
                </div>

                {/* Cart: Sticky in large screens */}
                <div className="w-full lg:w-1/3">
                    <div className="lg:sticky lg:top-24">
                        <Cart />
                    </div>
                </div>
            </div>
        </div>
    );
}
