import { motion } from "framer-motion";
import { useGetDashboardStats } from "@/apis/admin/analytics.api";
import { Loading, ErrorFeedback } from "@/components/common";
import usePriceFormat from "@/hooks/usePriceFormat";
import MatrixCard from "./_components/matrix-card";
import { Building2, Calendar, DollarSign, Mic } from "lucide-react";
import StatCard from "./_components/stat-card";
import UpcomingBooking from "./_components/upcoming-booking";
import PeakBookingHours from "./_components/peak-booking-hours";
import RevenueTrends from "./_components/revenue-trends";
import ServiceDistribution from "./_components/service-distribution";
import useLocalization from "@/context/localization-provider/localization-context";
import useNumberFormat from "@/hooks/use-number-format";

const Dashboard = () => {
  // Localizations
  const { t, lng } = useLocalization();

  // Query
  const { statistics, isLoading, error } = useGetDashboardStats();

  // Hooks
  const priceFormat = usePriceFormat();
  const numberFormat = useNumberFormat();

  // Variables
  const {
    peakBookingHours,
    revenueTrends,
    serviceDistribution,
    addonsDistribution,
    topService,
    topStudio,
    totalBookings,
    totalRevenue,
    upcomingBookings,
  } = statistics?.data || {};

  // Loading state
  if (isLoading) return <Loading />;

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center py-5">
        <ErrorFeedback>{error.message}</ErrorFeedback>
      </div>
    );
  }

  return (
    <motion.div
      className="py-6 md:py-2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <h1 className="mb-2 text-lg font-bold text-gray-800 md:text-2xl">
        {t("dashboard")}
      </h1>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Matrixes */}
        {/* Total booking */}
        <StatCard
          title={t("total-bookings")}
          icon={Calendar}
          value={numberFormat(totalBookings.value)}
          description={t("booking-growth", {
            growth: numberFormat(totalBookings.growth),
          })}
        />

        {/* Total Revenue */}
        <StatCard
          title={t("total-revenue")}
          icon={DollarSign}
          value={priceFormat(totalRevenue.value)}
          description={t("total-revenue-growth", {
            growth: numberFormat(totalRevenue.growth),
          })}
        />

        {/* Top service */}
        <StatCard
          title={t("top-service")}
          icon={Mic}
          value={topService.name?.[lng]}
          description={t("top-service-percentage", {
            percentage: numberFormat(topService.percentage),
          })}
        />

        {/* Top studio */}
        <StatCard
          title={t("top-studio")}
          icon={Building2}
          value={`${topStudio.name?.[lng]}`}
          description={t("top-studio-utilization", {
            percentage: numberFormat(topStudio.percentage),
          })}
        />

        {/* Charts */}
        {/* Peak booking hours chart */}
        <PeakBookingHours peakBookingHours={peakBookingHours} />

        {/* Revenue trends chart */}
        <RevenueTrends revenueTrends={revenueTrends} />

        {/* Package chart */}
        <ServiceDistribution data={serviceDistribution}>
          {/* Title */}
          <h2 className="text-md font-bold">{t("service-distribution")}</h2>

          {/* Description */}
          <p className="mb-4 text-sm text-gray-500">
            {t("breakdown-of-services-booked")}
          </p>
        </ServiceDistribution>

        {/* Addons chart  */}
        <ServiceDistribution data={addonsDistribution}>
          {/* Title */}
          <h2 className="text-md font-bold">{t("addons-distribution")}</h2>

          {/* Description */}
          <p className="mb-4 text-sm text-gray-500">{t("breakdown-of-addons-booked")}</p>
        </ServiceDistribution>

        {/* Upcoming booking  */}
        <UpcomingBooking upcomingBookings={upcomingBookings} />
      </div>

      <div></div>
    </motion.div>
  );
};

export default Dashboard;
