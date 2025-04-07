import { useParams } from 'react-router-dom'
import Header from '../../components/Studio-Details/Header/Header'
import Gallery from '../../components/Studio-Details/Gallery/Gallery'
import BookingButton from '../../components/Studio-Details/Booking-Button/BookingButton'
import Taps from '../../components/Studio-Details/Taps/Taps'
export default function StudioDetails() {
    const { id } = useParams()
    return <>
        <Header title={`Goocast ${id}`} rate={4.5} location={"Location"} />
        <Gallery />
        <Taps />
        <BookingButton />
    </>
}


