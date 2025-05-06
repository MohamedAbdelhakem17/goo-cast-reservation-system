import { useNavigate } from 'react-router-dom'
import useBookingFormik from '../context/Booking-Formik/useBookingFormik';
export default function useQuickBooking() {
    const navigate = useNavigate()
    const {setBookingField  } = useBookingFormik()
    const handleQuickBooking = (step = 1, studio = {}) => {
        setBookingField("studio", studio);
        navigate('/booking', {
            state: {
                step: step,
                studio: studio
            }
        });

    }
    return { handleQuickBooking }
}
