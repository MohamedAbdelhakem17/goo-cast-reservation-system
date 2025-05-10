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
        <div className="grid grid-cols-1 lg:grid-cols-2 p-2 divide-x-1 divide-gray-300">
            {/* Persons */}
            <div className="col-span-1 lg:col-span-2 flex items-center justify-between px-4 py-2 md:flex-row flex-col gap-2">
                <label className="text-sm font-medium">Number of persons</label>
                <div className="flex items-center">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch({ type: 'DECREMENT_PERSONS' })}
                        className="h-10 w-10 flex items-center justify-center cursor-pointer rounded-l-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <i className="fa-solid fa-minus"></i>
                    </motion.button>

                    <input
                        type="text"
                        value={state.persons}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            dispatch({ type: 'SET_PERSONS', payload: parseInt(value) || 1 });
                        }}
                        className="h-10 rounded-none border-x-0 text-center appearance-none outline-none border border-gray-300"
                    />

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch({ type: 'INCREMENT_PERSONS' })}
                        className="h-10 w-10 flex items-center justify-center cursor-pointer rounded-r-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <i className="fa-solid fa-plus"></i>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
