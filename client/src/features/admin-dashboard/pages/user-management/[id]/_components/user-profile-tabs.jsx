import { Taps } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useSearchParams } from "react-router-dom";
import UserBookingTab from "./_tabs/user-booking-tab";
import UserContactTab from "./_tabs/user-contact-tab";
import UserOverviewTab from "./_tabs/user-overview-tab";

export default function UserProfileTabs({ user }) {
  // Translation
  const { t } = useLocalization();

  // URL Search Params
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTabFromUrl = searchParams.get("tab") || "overview";

  // Functions
  const handleActiveTab = (id) => {
    setSearchParams({ tab: id });
  };

  // Variables
  const { totalSpent, lastBookingTime, totalBookingTimes, allUserBooking, nextBooking } =
    user?.userActivity || {};

  const tabs = [
    { label: t("overview"), id: "overview" },
    { label: t("booking"), id: "booking" },
    { label: t("contact"), id: "contact" },
  ];

  const CONTENT = {
    overview: (
      <UserOverviewTab
        user={{
          name: user?.fullName,
          owner: user?.accountOwner,
          email: user?.email,
          phone: user?.phone,
          avatar: user?.avatar,
          nextBooking,
          totalSpent,
          totalBookingTimes,
          lastBookingTime,
        }}
        setActiveTab={handleActiveTab}
      />
    ),
    booking: (
      <UserBookingTab
        allUserBooking={allUserBooking}
        name={user?.fullName}
        email={user?.email}
      />
    ),
    contact: (
      <UserContactTab
        user={{
          name: user?.fullName,
          tags: user?.tags,
          owner: user?.accountOwner,
          email: user?.email,
          phone: user?.phone,
          avatar: user?.avatar,
        }}
      />
    ),
  };

  return (
    <div>
      {/* Tabs */}
      <Taps tabs={tabs} activeTabId={activeTabFromUrl} onTabChange={handleActiveTab} />
      {/* Content */}
      {CONTENT[activeTabFromUrl]}
    </div>
  );
}
