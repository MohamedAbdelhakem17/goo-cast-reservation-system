import { useParams } from 'react-router-dom'
import Header from '../../components/Studio-Details/Header/Header'
import Gallery from '../../components/Studio-Details/Gallery/Gallery'
import BookingButton from '../../components/Studio-Details/Booking-Button/BookingButton'
import Taps from '../../components/Studio-Details/Taps/Taps'
import { GetStudioByID } from '../../apis/studios/studios.api'

export default function StudioDetails() {
    const { id } = useParams()

    const { data, isLoading } = GetStudioByID(id)


    if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>

    return <>
        <Header title={data.data.name}  location={data.data.address} />
        <Gallery images={[data.data.thumbnail, ...data.data.imagesGallery]} />
        <Taps
            description={data?.data?.description}
            facilities={data?.data?.facilities}
            equipment={data?.data?.equipment}
        />

        <BookingButton studio={{
            id: data.data._id,
            name: data.data.name,
            image: data.data.thumbnail,
            price: data.data.basePricePerSlot
        }} />
    </>
}


