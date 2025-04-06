import { useParams } from 'react-router-dom'
import Header from '../../components/Studio-Details/Header/Header'
import Gallery from '../../components/Studio-Details/Gallary/Gallary'

export default function StudioDetails() {
    const { id } = useParams()

    return <>
        <Header title={`Goocast ${id}`} rate={4.5} location={"Location"} />
        <Gallery />
    </>
}


