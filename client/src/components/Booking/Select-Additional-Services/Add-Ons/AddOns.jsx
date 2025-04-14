import { motion } from 'framer-motion'
import { useBooking } from '../../../../context/Booking-Context/BookingContext'

export default function AddOns() {
  const addOns = [
    {
      id: "additional-camera",
      name: "Additional Camera",
      description:
        "Include an extra camera with lens in your recording to make your content more dynamic and increase viewer retention.",
      price: 2000,
      icon: "fa-video",
    },
    {
      id: "additional-mic",
      name: "Additional Mic",
      description: "Extra Shure mic for your guest in your podcast",
      price: 1000,
      icon: "fa-microphone",
    },
    {
      id: "teleprompter",
      name: "Teleprompter",
      description:
        "Boost your performance with a teleprompter, ensuring a confident introduction recording for your episode.",
      price: 800,
      icon: "fa-display",
    },
    {
      id: "subtitles",
      name: "Subtitles",
      description:
        "Enhance accessibility of your episodes with precise English subtitles, manually proofread for quality assurance. For episodes up to 60 minutes.",
      price: 1000,
      icon: "fa-closed-captioning",
    },
    {
      id: "episode-edit",
      name: "Episode Edit",
      description:
        "Get complete audio & video editing, logo/music integration, and removal of unwanted parts. For a single episode with up to 60 minutes of raw material. Two revision rounds",
      price: 1500,
      icon: "fa-scissors",
    },
    {
      id: "standard-reel",
      name: "1 Standard Reel Edit",
      description:
        "Engaging clip extracted from your edited episode, with subtitles. For clips up to 90 sec long, in vertical or horizontal format. Two revision rounds",
      price: 1000,
      icon: "fa-film",
    },
    {
      id: "signature-reel",
      name: "1 Signature Reel Edit",
      description:
        "Everything from the standard edit, plus a custom trailer designed to captivate your audience from the start. Two revision rounds",
      price: 1500,
      icon: "fa-star",
    },
    {
      id: "thumbnail",
      name: "Thumbnail Designs",
      description: "Designs of a vertical or horizontal thumbnail for your episode or reel",
      price: 200,
      icon: "fa-image",
    },
  ]

  const { bookingData, setBookingField } = useBooking()

  const handleAddOnChange = (id, name, quantity, price) => {
    let updatedAddOns = [...bookingData.selectedAddOns]

    const index = updatedAddOns.findIndex(addon => addon.id === id)

    if (quantity === 0 && index !== -1) {
      updatedAddOns.splice(index, 1)
    } else if (index !== -1) {
      updatedAddOns[index].quantity = quantity
      updatedAddOns[index].totalPrice = price * quantity // Update total price based on quantity
    } else {
      updatedAddOns.push({
        id,
        name,
        quantity,
        price,
      })
    }

    setBookingField("selectedAddOns", updatedAddOns)
  }

  const getQuantity = (id) => {
    const found = bookingData.selectedAddOns.find(item => item.id === id)
    return found ? found.quantity : 0
  }

  const handleIncrement = (id, name, price) => {
    const currentQty = getQuantity(id)
    handleAddOnChange(id, name, currentQty + 1, price)
  }

  const handleDecrement = (id, name, price) => {
    const currentQty = getQuantity(id)
    if (currentQty > 0) {
      handleAddOnChange(id, name, currentQty - 1, price)
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
    <>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {addOns.map((addon) => {
          const quantity = getQuantity(addon.id)

          return (
            <motion.div
              key={addon.id}
              variants={cardVariants}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="bg-gray-300 text-main p-4 flex items-center">
                <i className={`fa-solid ${addon.icon} h-5 w-5 mr-3`}></i>
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
                      onClick={() => handleDecrement(addon.id, addon.name, addon.price)}
                      disabled={quantity === 0}
                    >
                      <i className="fa-solid fa-minus h-5 w-5"></i>
                    </motion.button>

                    <span className="w-8 text-center font-medium">{quantity}</span>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 cursor-pointer flex items-center justify-center bg-main text-white rounded-full hover:bg-main/80 transition-colors"
                      onClick={() => handleIncrement(addon.id, addon.name, addon.price)}
                    >
                      <i className="fa-solid fa-plus h-5 w-5"></i>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </>
  )
}
