import { useReducer } from 'react'
import { motion } from 'framer-motion'

// Define the initial state
const initialState = {
    duration: 1,
    persons: 1,
};

// Define the reducer function
function reducer(state, action) {
    switch (action.type) {
        case 'DECREMENT_DURATION':
            return { ...state, duration: Math.max(1, state.duration - 1) };
        case 'INCREMENT_DURATION':
            return { ...state, duration: Math.min(10, state.duration + 1) };
        case 'SET_DURATION':
            return { ...state, duration: Math.max(1, Math.min(10, action.payload)) };
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
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2  p-2  divide-x-1 divide-gray-300" >
            {/* Duration */}
            <div className="flex items-center justify-between px-4 py-2 ">
                <p className="text-sm font-medium">Session duration</p>
                <div className="flex items-center">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch({ type: 'DECREMENT_DURATION' })}
                        className="h-10 w-10 flex items-center justify-center cursor-pointer rounded-l-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <i className="fa-solid fa-minus"></i>

                    </motion.button>

                    <input
                        type="text"
                        value={state.duration}
                        onChange={(e) => dispatch({ type: 'SET_DURATION', payload: Number.parseInt(e.target.value) || 1 })}
                        className="h-10 rounded-none border-x-0 text-center appearance-none outline-none border border-gray-300"
                    />

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch({ type: 'INCREMENT_DURATION' })}
                        className="h-10 w-10 flex items-center justify-center cursor-pointer rounded-r-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <i className="fa-solid fa-plus"></i>
                    </motion.button>
                </div>
            </div>

            {/* Persons */}
            <div className="flex items-center justify-between px-4 py-2 ">
                <label className="text-sm font-medium">Number of persons</label>
                <div className="flex items-center">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch({ type: 'INCREMENT_PERSONS' })}
                        className="h-10 w-10 flex items-center justify-center cursor-pointer rounded-l-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors appearance-none"
                    >
                        <i className="fa-solid fa-minus"></i>
                    </motion.button>

                    <input
                        type="text"
                        value={state.persons}
                        onChange={(e) => dispatch({ type: 'SET_PERSONS', payload: Number.parseInt(e.target.value) || 1 })}
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
    )
}
