import { motion } from "framer-motion";
export default function HourlyRecording({ selectedPackage, setSelectedPackage, selectedDuration, setSelectedDuration }) {


  const handlePackageSelect = (packageData, duration) => {
    setSelectedPackage(packageData);
    setSelectedDuration(duration);
  };

  console.log("Selected Package:", selectedPackage);
  console.log("Selected Duration:", selectedDuration);

  const hourlyPackages = [
    {
      id: "go-social",
      name: "Go-Social",
      description: "For Content Creators who want to shoot solo videos",
      details: [
        "Fully equipped Podcast Set of your choice",
        "1x Cinema Cameras sony fx30 and 1x Rode wireless mic",
        "Professional audio mixer (will replaced with the camera mixer)",
        "Raw audio and video files transferred to your own hard drive",
      ],
      prices: {
        "2hours": 8000,
        halfday: 14000,
        fullday: 25000,
      },
      savings: {
        halfday: 2000,
        fullday: 7000,
      },
      icon: <i className="fa-solid fa-video h-6 w-6 mr-3"></i>,
    },
    {
      id: "go-podcast",
      name: "Go-Podcast",
      description:
        "Recording + Live Mix For Content Creators who want to shoot Podcast videos, with good quality of editing",
      details: [
        "Fully equipped Podcast Set of your choice",
        "Studio operator to record everything for you",
        "2x Cinema Cameras and 2x Shure mics",
        "Professional audio mixer",
        "Live cutting of your video with synced audio",
        "Raw audio and video files transferred to your own hard drive",
        "Live mixed episode ready to be published in horizontal format",
      ],
      prices: {
        "2hours": 10000,
        halfday: 18000,
        fullday: 30000,
      },
      savings: {
        halfday: 2000,
        fullday: 10000,
      },
      icon: <i className="fa-solid fa-microphone h-6 w-6 mr-3"></i>,
    },
  ];

  const durations = [
    { id: "2hours", label: "2 Hours" },
    { id: "halfday", label: "Half Day (4 Hours)" },
    { id: "fullday", label: "Full Day (8 Hours)" },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  return (
    <div className="space-y-6">
      <motion.div className="grid md:grid-cols-2 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        {hourlyPackages.map((pkg) => (
          <motion.div variants={cardVariants} key={pkg.id}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-300 text-main p-4 flex items-center">
              {pkg.icon}
              <h3 className="text-lg font-semibold">{pkg.name}</h3>
            </div>

            <div className="p-4">
              <p className="text-gray-700 mb-4">{pkg.description}</p>

              <div className="space-y-2 mb-4">
                {pkg.details.map((detail, index) => (
                  <div key={index} className="flex items-start">
                    <i className="fa-solid fa-check h-4 w-4 text-green-500 mt-1 mr-2"></i>
                    <p className="text-sm text-gray-600">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {durations.map((duration) => {
                  const isSelected =
                    selectedPackage?.id === pkg.id &&
                    selectedDuration === duration.id;

                  return (
                    <motion.button key={duration.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={` w-full
            py-2 px-4 border border-main/60 rounded-md flex justify-between items-center 
            transition-colors ${isSelected ? "bg-main text-white hover:bg-main" : "bg-white hover:bg-main/10"} `} onClick={() =>
                        handlePackageSelect(pkg, duration.id)}
                    >
                      <span>{duration.label}</span>
                      <div className="text-right">
                        <span className={`font-bold ${isSelected ? "text-white" : "text-main/60"}`}>
                          {pkg.prices[duration.id].toLocaleString()} EGP
                        </span>
                        {pkg.savings[duration.id] && (
                          <div>
                            Save {pkg.savings[duration.id].toLocaleString()} EGP
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-2">Extra Hours</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-main rounded-md bg-white">
            <div className="flex justify-between">
              <span>Extra Go-Social Hour</span>
              <span className="font-semibold">4,000 EGP</span>
            </div>
          </div>
          <div className="p-3 border border-main rounded-md bg-white">
            <div className="flex justify-between">
              <span>Extra Go-Podcast Hour</span>
              <span className="font-semibold">5,000 EGP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}