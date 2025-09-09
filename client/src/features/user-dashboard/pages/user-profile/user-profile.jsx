import { motion } from "framer-motion";
import { Loading } from "@/components/common";
import { useGetUserData, useGetUserStats } from "@/apis/users/user.api";
import { FavoriteStudio, Header, UpcomingBooking, UserData } from "./_components";

const UserProfile = () => {
  // hooks
  const { userData, isLoading } = useGetUserData();
  const { userDataStats, isLoading: statsLoading } = useGetUserStats();

  if (isLoading || statsLoading) return <Loading />;
  return (
    <>
      <div className="max-w-8xl container mx-auto px-4 py-5">
        {/* Header Section */}
        <Header user={userData?.data} workspace={userDataStats?.data?.userWorkSpace} />

        <div className="grid gap-8">
          {/* Personal Information Card */}
          <UserData user={userData?.data} />

          {/* Show upcoming booking  */}
          {Boolean(Object.keys(userDataStats?.data?.nextBookingAfterToday).length) && (
            <UpcomingBooking
              data={userDataStats?.data?.nextBookingAfterToday}
              label="Upcoming Booking"
            />
          )}

          {/* Bookings and Favorites Section */}
          <div className="grid gap-8 md:grid-cols-2">
            // Last user booked
            {Boolean(Object.keys(userDataStats?.data?.lastBookingBeforeToday).length) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <UpcomingBooking
                  data={userDataStats?.data?.lastBookingBeforeToday}
                  label="Last Booking"
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* Most studio booking */}
              <FavoriteStudio
                favoriteStudio={userDataStats?.data?.mostStudioBooked}
                favoritePackage={userDataStats?.data?.mostPackageBooked}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
