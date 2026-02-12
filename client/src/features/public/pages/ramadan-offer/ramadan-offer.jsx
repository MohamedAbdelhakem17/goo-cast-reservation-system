import { useNavigate, useParams } from "react-router-dom";
import { OfferHeader } from "./_components";

export default function Offers() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleBookNow = () => {
    // Navigate to booking page or show booking modal
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-white pt-16 transition-colors duration-300 dark:bg-gray-950">
      <OfferHeader
        badge={"Limited Time Offer " + slug}
        title="Ramadan Special Bundle Test"
        description="Get 40 studio hours plus professional services at an unprecedented rate this Ramadan month."
        onBookNow={handleBookNow}
      />
    </div>
  );
}
