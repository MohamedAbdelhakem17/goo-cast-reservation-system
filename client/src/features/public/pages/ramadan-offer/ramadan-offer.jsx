import { useNavigate } from "react-router-dom";
import { RamadanOfferHeader } from "./_components";

export default function RamadanOffer() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Navigate to booking page or show booking modal
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-white pt-16 transition-colors duration-300 sm:pt-20 md:pt-24 dark:bg-gray-950">
      <RamadanOfferHeader
        badge="Limited Time Offer"
        title="Ramadan Special Bundle Test"
        description="Get 40 studio hours plus professional services at an unprecedented rate this Ramadan month."
        onBookNow={handleBookNow}
      />
    </div>
  );
}
