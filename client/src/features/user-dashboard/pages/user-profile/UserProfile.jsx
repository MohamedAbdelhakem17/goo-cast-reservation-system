import { motion } from 'framer-motion';
// import { useToast } from '../../../context/Toaster-Context/ToasterContext';
// import { useAuth } from '../../../context/Auth-Context/AuthContext';
import { GetUserData, GetUserStats } from '@/apis/user/user.api';
import Header from '../../_components/User-Dashboard/Profile/Header/Header';
import UserData from '../../_components/User-Dashboard/Profile/User-Data/UserData';
import UpcomingBooking from '../../_components/User-Dashboard/Profile/Upcoming-Booking/UpcomingBooking';
import FavoriteStudio from '../../_components/User-Dashboard/Profile/Favorite-Studio/FavoriteStudio';
import { Loading } from '@/components/common';

const UserProfile = () => {
    const { data: user, isLoading } = GetUserData();
    const { data: userStats, isLoading: statsLoading } = GetUserStats();

    if (isLoading || statsLoading) return <Loading />
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="container max-w-8xl py-5 px-4 mx-auto">
                {/* Header Section */}
                <Header user={user?.data}  workspace={userStats?.data?.userWorkSpace} />


                <div className="grid gap-8">

                    {/* Personal Information Card */}
                    <UserData user={user?.data} />

                    {
                        Boolean(Object.keys(userStats?.data?.nextBookingAfterToday).length) && <UpcomingBooking data={userStats?.data?.nextBookingAfterToday} label="Upcoming Booking" />

                    }

                    {/* Bookings and Favorites Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {
                            Boolean(Object.keys(userStats?.data?.lastBookingBeforeToday).length) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <UpcomingBooking data={userStats?.data?.lastBookingBeforeToday} label="Last Booking" />
                                </motion.div>
                            )
                        }
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <FavoriteStudio favoriteStudio={userStats?.data?.mostStudioBooked} favoritePackage={userStats?.data?.mostPackageBooked} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
