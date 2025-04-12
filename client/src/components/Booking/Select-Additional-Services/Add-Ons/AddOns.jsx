import { motion } from 'framer-motion'

export default function AddOns({ selectedAddOns, setSelectedAddOns }) {
  const addOns = [
    {
      id: "additional-camera",
      name: "Additional Camera",
      description:
        "Include an extra camera with lens in your recording to make your content more dynamic and increase viewer retention.",
      price: 2000,
    },
    {
      id: "additional-mic",
      name: "Additional Mic",
      description: "Extra Shure mic for your guest in your podcast",
      price: 1000,
    },
    {
      id: "teleprompter",
      name: "Teleprompter",
      description:
        "Boost your performance with a teleprompter, ensuring a confident introduction recording for your episode.",
      price: 800,
    },
    {
      id: "subtitles",
      name: "Subtitles",
      description:
        "Enhance accessibility of your episodes with precise English subtitles, manually proofread for quality assurance. For episodes up to 60 minutes.",
      price: 1000,
    },
    {
      id: "episode-edit",
      name: "Episode Edit",
      description:
        "Get complete audio & video editing, logo/music integration, and removal of unwanted parts. For a single episode with up to 60 minutes of raw material. Two revision rounds",
      price: 1500,
    },
    {
      id: "standard-reel",
      name: "1 Standard Reel Edit",
      description:
        "Engaging clip extracted from your edited episode, with subtitles. For clips up to 90 sec long, in vertical or horizontal format. Two revision rounds",
      price: 1000,
    },
    {
      id: "signature-reel",
      name: "1 Signature Reel Edit",
      description:
        "Everything from the standard edit, plus a custom trailer designed to captivate your audience from the start. Two revision rounds",
      price: 1500,
    },
    {
      id: "thumbnail",
      name: "Thumbnail Designs",
      description: "Designs of a vertical or horizontal thumbnail for your episode or reel",
      price: 200,
    },
  ]


  const handleAddOnChange = (id, quantity) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [id]: quantity,
    }))
  }

  const handleIncrement = (id) => {
    const currentQty = selectedAddOns[id] || 0
    handleAddOnChange(id, currentQty + 1)
  }

  const handleDecrement = (id) => {
    const currentQty = selectedAddOns[id] || 0
    if (currentQty > 0) {
      handleAddOnChange(id, currentQty - 1)
    }
  }

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
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  }

  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {addOns.map((addon) => (
        <motion.div
          key={addon.id}
          variants={cardVariants}
          className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
        >
          <div className="bg-gray-300 text-main p-4 flex items-center">
            <i className="fa-solid fa-web-awesome h-5 w-5 mr-3"></i>
            <h3 className="text-lg font-bold">{addon.name}</h3>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">{addon.description}</p>

            <div className="flex justify-between items-center">
              <span className="font-bold">{addon.price.toLocaleString()} EGP</span>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 cursor-pointer flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                  onClick={() => handleDecrement(addon.id)}
                  disabled={(selectedAddOns[addon.id] || 0) === 0}
                >
                  <i className="fa-solid fa-minus h-5 w-5"></i>
                </motion.button>

                <span className="w-8 text-center font-medium">
                  {selectedAddOns[addon.id] || 0}
                </span>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 cursor-pointer flex items-center justify-center bg-main text-white rounded-full hover:bg-main/80 transition-colors"
                  onClick={() => handleIncrement(addon.id)}
                >
                  <i className="fa-solid fa-plus h-5 w-5"></i>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
