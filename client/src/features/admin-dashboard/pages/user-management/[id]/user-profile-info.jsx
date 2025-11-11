import { useGetUserProfile } from "@/apis/admin/manage-user.api";
import { Loading } from "@/components/common";
import { useParams } from "react-router-dom";
import UserProfileHeader from "./_components/user-profile-header";

export default function UserProfileInfo() {
  const { id } = useParams();

  const { userProfile, isLoading, error } = useGetUserProfile(id);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Error: {error.message}</h2>
      </div>
    );
  }

  const user = userProfile?.data;
  const { totalSpent, lastBookingTime, totalBookingTimes, allUserBooking, nextBooking } =
    user?.userActivity || {};

  return (
    <section>
      <UserProfileHeader
        customer={{
          avatar: user?.avatar,
          name: user?.fullName,
          tags: user?.tags,
          owner: user?.accountOwner,
          email: user?.email,
          phone: user?.phone,
          totalSpent,
          lastBookingTime,
          totalBookingTimes,
        }}
      />
    </section>
  );
}
