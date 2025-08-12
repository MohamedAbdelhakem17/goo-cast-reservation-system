import { useParams } from "react-router-dom";
import { GetStudioByID } from "@/apis/studios/studios.api";
import { Loading } from "@/components/common";
import { Header, Gallery, Taps } from "./_components";

export default function StudioDetails() {
    const { id } = useParams();

    const { data, isLoading } = GetStudioByID(id);

    if (isLoading) return <Loading />;

    return (
        <main className="container mx-auto py-5 my-5">
            <Header title={data.data.name} location={data.data.address} />
            <Gallery images={[data.data.thumbnail, ...data.data.imagesGallery]} />
            <Taps
                description={data?.data?.description}
                facilities={data?.data?.facilities}
                equipment={data?.data?.equipment}
            />
        </main>
    );
}
