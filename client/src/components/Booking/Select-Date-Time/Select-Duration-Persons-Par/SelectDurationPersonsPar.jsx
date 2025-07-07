/* eslint-disable react-hooks/exhaustive-deps */
import { useReducer, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBooking } from '../../../../context/Booking-Context/BookingContext';

// Reducer function
function reducer(state, action) {
    switch (action.type) {
        case 'DECREMENT_PERSONS':
            return { ...state, persons: Math.max(1, state.persons - 1) };
        case 'INCREMENT_PERSONS':
            return { ...state, persons: Math.min(10, state.persons + 1) };
        case 'SET_PERSONS':
            return { ...state, persons: Math.max(1, Math.min(10, action.payload)) };
        default:
            return state;
    }
}

export default function SelectDurationPersonsPar() {
    const { bookingData, setBookingField } = useBooking();

    const initialState = {
        persons: bookingData.persons || 1,
    };

    const [state, dispatch] = useReducer(reducer, initialState);


    
    useEffect(() => {
        setBookingField('persons', state.persons);
    }, [state.persons]);
    


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2  divide-x-1 divide-gray-300">
            {/* Persons */}
            <div className="col-span-1 lg:col-span-2 flex items-center justify-between  md:flex-row flex-col gap-2">
              
            </div>
        </div>
    );
}
