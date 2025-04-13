import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from "../../shared/Input/Input";
import { useBooking } from '../../../context/Booking-Context/BookingContext';

export default function PersonalInformation() {
    const inputRef = useRef(null);
    const { getField, getBookingError  , formik} = useBooking();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const motionProps = {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.5, duration: 0.4 }
    };



    return (
        <form className="space-y-2">
            <motion.div {...motionProps}>
                <Input
                    type="text"
                    id="email"
                    label="Email"
                    inputRef={inputRef}
                    placeholder="Enter your Email"
                    {...getField("personalInfo.email")}
                    errors={getBookingError('personalInfo.email')}
                    onBlur={getField('personalInfo.email').onBlur}
                    touched={formik.touched.email}
                />
            </motion.div>

            <motion.div {...motionProps}>
                <Input
                    type="text"
                    id="name"
                    label="Name"
                    placeholder="Enter your Name"
                    errors={getBookingError('personalInfo.fullName')}
                    onBlur={getField('personalInfo.fullName').onBlur}
                    touched={formik.touched.name}
                />
            </motion.div>

            <motion.div {...motionProps}>
                <Input
                    type="text"
                    id="brandName"
                    label="Your Brand Name"
                    placeholder="Enter your Brand Name"
                    {...getField("personalInfo.brand")}
                    errors={getBookingError('personalInfo.brand')}
                    onBlur={getField('personalInfo.brand').onBlur}
                    touched={formik.touched.brandName}
                />
            </motion.div>

            <motion.div {...motionProps}>
                <Input
                    type="text"
                    id="phoneNumber"
                    label="Phone Number"
                    placeholder="Enter your Phone Number"
                    {...getField("personalInfo.phone")}
                    errors={getBookingError('personalInfo.phone')}
                    onBlur={getField('personalInfo.phone').onBlur}
                    touched={formik.touched.phoneNumber}
                />
            </motion.div>
        </form>
    );
}
