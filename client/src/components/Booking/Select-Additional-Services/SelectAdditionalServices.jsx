import AddOns from './Add-Ons/AddOns';
import Cart from '../Cart/Cart';
import { useRef } from 'react';
import { useStickyScroll } from '../../../hooks/useStickyScroll';

export default function SelectAdditionalServices() {
    const containerRef = useRef(null);
    const cartRef = useRef(null);

    const translateY = useStickyScroll(containerRef, cartRef, 115, 0.8);

    return (
        <div className="space-y-4 py-4 px-5 duration-300" ref={containerRef}>
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl mb-2">Additional Services</h2>
                <p className="text-gray-600">Enhance your session with our professional add-ons</p>
            </div>

            {/* Responsive Content */}
            <div className="flex flex-col lg:flex-row gap-6 relative">
                {/* AddOns takes full width on mobile, 2/3 on large screens */}
                <div className="w-full lg:w-2/3">
                    <AddOns />
                </div>

                {/* Cart: Follows scroll smoothly */}
                <div className="w-full lg:w-1/3">
                    <div
                        ref={cartRef}
                        className="lg:absolute lg:right-6 lg:w-[calc(33.333%-1.5rem)] lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto transition-transform duration-200 ease-linear"
                        style={{
                            transform: `translateY(${translateY}px)`,
                        }}
                    >
                        <Cart />
                    </div>
                </div>
            </div>
        </div>
    );
}
