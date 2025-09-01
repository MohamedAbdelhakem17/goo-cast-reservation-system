import Sticky from 'react-sticky-el';
import AddOns from './Add-Ons/AddOns';
import Cart from '../Cart/Cart';
import Faq from './Faq/Faq';
import BookingHeader from '../../shared/Booking-Header/BookingHeader';
import { useEffect } from 'react';
import { tracking } from '../../../GTM/gtm';

export default function SelectAdditionalServices() {
    useEffect(() => {
        tracking("Initiate Checkout")
    }, [])
    return (
        <div className="space-y-4 duration-300" >
            {/* Header */}
            <BookingHeader title="Additional Services" desc="Enhance your session with our professional add-ons" />

            {/* Responsive Content */}
            <div className="flex flex-col lg:flex-row gap-6 mb-[10px]" id='cart-wrapper'>
                {/* AddOns takes full width on mobile, 2/3 on large screens */}
                <div className="w-full lg:w-2/3">
                    <AddOns />
                    <Faq />
                </div>

                {/* Cart Sticky */}
                <div className="w-full lg:w-1/3 " >
                    {/* <Sticky
                        topOffset={-100}
                        stickyStyle={{ top: '95px', zIndex: 40, transition: 'top 0.3s ease-in-out' }}
                        boundaryElement="#cart-wrapper"
                    // hideOnBoundaryHit={false}
                    > */}
                    <Cart />
                    {/* </Sticky> */}
                </div>
            </div>
        </div >
    );
}


// m  360 / 60 = 6  => 6 * 15 = 90
// h  360 / 12 = 30 => 3 * 30 = 90
// .25 h = 30 * .25 = 7.5
//  3:15 = 90 + 7.5 =  97.5
// def = 97.5 - 90 = 7.5 