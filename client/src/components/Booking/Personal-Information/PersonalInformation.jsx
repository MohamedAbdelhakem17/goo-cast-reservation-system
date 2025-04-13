import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from "../../shared/Input/Input";
import { useBooking } from '../../../context/Booking-Context/BookingContext';

export default function PersonalInformation() {
    const inputRef = useRef(null);
    const { getField, getBookingError, formik, bookingData  ,setBookingField} = useBooking();

    const { fullName, phone, email, brand } = bookingData.personalInfo

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
                    // inputRef={inputRef}
                    placeholder="Enter your Email"
                    {...getField("personalInfo.email")}
                    errors={getBookingError('personalInfo.email')}
                    onBlur={getField('personalInfo.email').onBlur}
                    onChange={(e) => setBookingField('personalInfo.email', e.target.value)}
                    touched={formik.touched.email}
                    value={email}
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
                    onChange={(e) => setBookingField('personalInfo.fullName', e.target.value)}
                    touched={formik.touched.name}
                    value={fullName}
                />
            </motion.div>

            <motion.div {...motionProps}>
                <Input
                    type="text"
                    id="brandName"
                    label="Your Brand Name"
                    value={brand}
                    placeholder="Enter your Brand Name"
                    {...getField("personalInfo.brand")}
                    errors={getBookingError('personalInfo.brand')}
                    onChange={(e) => setBookingField('personalInfo.brand', e.target.value)}
                    onBlur={getField('personalInfo.brand').onBlur}
                    touched={formik.touched.brandName}
                />
            </motion.div>

            <motion.div {...motionProps}>
                <Input
                    type="text"
                    id="phoneNumber"
                    value={phone}
                    label="Phone Number"
                    placeholder="Enter your Phone Number"
                    {...getField("personalInfo.phone")}
                    errors={getBookingError('personalInfo.phone')}
                    onBlur={getField('personalInfo.phone').onBlur}
                    touched={formik.touched.phoneNumber}
                    onChange={(e) => setBookingField('personalInfo.phone', e.target.value)}
                />
            </motion.div>
        </form>
    );
}
