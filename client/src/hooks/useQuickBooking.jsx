import { useNavigate } from 'react-router-dom'
export default function useQuickBooking() {
    const navigate = useNavigate()
    const handleQuickBooking = (step=1,studio = {}) => {
        navigate('/booking', {
            state: {
                step: step,
                studio: studio
            }
        });
    }
    return { handleQuickBooking }
}
