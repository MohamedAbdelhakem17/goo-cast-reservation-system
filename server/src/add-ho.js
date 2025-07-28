const mongoose = require("mongoose");
const FaqModel = require("./models/faq-model/faq-model");

mongoose
  .connect(
    "mongodb+srv://abdelhakem:gUWwV4BpMRv8z9f2@dottopia.gjvd3.mongodb.net/goocast?retryWrites=true&w=majority&appName=dottopia"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    seedFaqs();
  })
  .catch((err) => console.error("Connection error:", err));

const faqItems = [
  {
    question: "Can I modify my booking after confirmation?",
    answer:
      "Yes, you can modify your booking up to 24 hours before your scheduled session. Changes may be subject to availability and additional fees.",
  },
  {
    question: "What's included in the base studio rental?",
    answer:
      "Base rental includes studio access, basic lighting, audio equipment, and up to 2 hours of recording time. Additional services can be added as needed.",
  },
  {
    question: "Do you provide editing services?",
    answer:
      "Basic editing is included with all packages. Advanced editing, color correction, and post-production services are available as add-ons.",
  },
  {
    question: "What happens if I need to cancel?",
    answer:
      "Cancellations made 48 hours or more in advance receive a full refund. Cancellations within 24-48 hours are subject to a 50% fee.",
  },
  {
    question: "Can I bring my own equipment?",
    answer:
      "Absolutely! You're welcome to bring your own cameras, microphones, or other equipment. Our technical team can help integrate your gear with our setup.",
  },
];

async function seedFaqs() {
  try {
    await FaqModel.deleteMany(); // حذف الموجود أولاً
    const createdFaqs = await FaqModel.insertMany(faqItems);
    console.log("Seeded FAQs:", createdFaqs);
    process.exit();
  } catch (err) {
    console.error("Error seeding FAQs:", err);
    process.exit(1);
  }
}
