import { useParams } from "react-router-dom";
import { GetStudioByID } from "@/apis/studios/studios.api";
import { Loading } from "@/components/common";
import { Header, Gallery, Taps } from "./_components";
import useLocalization from "@/context/localization-provider/localization-context";

export default function StudioDetails() {
  const { lng } = useLocalization();
  const { id } = useParams();

  const { data, isLoading } = GetStudioByID(id);

  if (isLoading) return <Loading />;

  return (
    <main className="container mx-auto my-5 py-5">
      <Header title={data.data.name?.[lng]} location={data.data.address?.[lng]} />
      <Gallery images={[data.data.thumbnail, ...data.data.imagesGallery]} />
      <Taps
        description={data?.data?.description}
        facilities={data?.data?.facilities}
        equipment={data?.data?.equipment}
      />
    </main>
  );
}
