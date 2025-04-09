import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Input from "../../shared/Input/Input"
export default function PersonalInformation() {
    const inputRef = useRef(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])
    return (


        <form className="space-y-2">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
            >
                <Input
                    type="text"
                    id="userName"
                    label="Email"
                    inputRef={inputRef}
                    placeholder="Enter your Email"
                // value={formValues.userName}
                // onChange={handleChange}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
            >
                <Input
                    type="text"
                    id="userName"
                    label="Name"
                    // inputRef={inputRef}
                    placeholder="Enter your Name"
                // value={formValues.userName}
                // onChange={handleChange}
                />
            </motion.div>



            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
            >
                <Input
                    type="text"
                    id="userName"
                    label="Your Brand Name"
                    // inputRef={inputRef}
                    placeholder="Enter your Brand Name"
                // value={formValues.userName}
                // onChange={handleChange}
                />
            </motion.div>


            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
            >
                <Input
                    type="text"
                    id="userName"
                    label="Phone Number"
                    // inputRef={inputRef}
                    placeholder="Enter your Phone Number"
                // value={formValues.userName}
                // onChange={handleChange}
                />
            </motion.div>



        </form>

    )
}

// <div className="space-y-4">
//     <p className="text-gray-700">
//         Please provide your contact information.
//     </p>
//     <div className="grid grid-cols-1 gap-4">
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Name
//             </label>
//             <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="John Doe"
//             />
//         </div>
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//             </label>
//             <input
//                 type="email"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="john@example.com"
//             />
//         </div>
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone
//             </label>
//             <input
//                 type="tel"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="+1 (555) 123-4567"
//             />
//         </div>
//     </div>
// </div>