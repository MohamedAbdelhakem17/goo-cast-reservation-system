import Sticky from 'react-sticky-el';
import AddOns from './Add-Ons/AddOns';
import Cart from '../Cart/Cart';

export default function SelectAdditionalServices() {
    return (
        <div className="space-y-4 px-5 duration-300" >
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl mb-2">Additional Services</h2>
                <p className="text-gray-900">Enhance your session with our professional add-ons</p>
            </div>

            {/* Responsive Content */}
            <div className="flex flex-col lg:flex-row gap-6 mb-[10px]" id='cart-wrapper'>
                {/* AddOns takes full width on mobile, 2/3 on large screens */}
                <div className="w-full lg:w-2/3">
                    <AddOns />
                </div>

                {/* Cart Sticky */}
                <div className="w-full lg:w-1/3 " >
                    <Sticky
                        topOffset={-100}
                        stickyStyle={{ top: '95px', zIndex: 40, transition: 'top 0.3s ease-in-out' }}
                        boundaryElement="#cart-wrapper"
                        // hideOnBoundaryHit={false}
                    >
                        <Cart />
                    </Sticky>
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