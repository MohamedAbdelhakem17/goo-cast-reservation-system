const saveOpportunityInGoHighLevel = require("../utils/save-opportunity-in-go-high-level");

const {
  createCalendarEvent,
} = require("../utils/google-calendar-integration.js");

const sendEmail = require("../utils/send-email");
const bookingConfirmationEmailBody = require("../utils/emails-body/booking-confirmation");

const { combineDateAndTime } = require("../utils/time-mange");

exports.runBookingIntegrations = async ({ booking, integrationData }) => {
  const {
    studio,
    pkg,
    addOns,
    bookingDate,
    personalInfo,
    totalAddOnsPriceFromDb,
    startSlot,
    endSlot,
    totalPriceAfterDiscount,
    duration,
  } = integrationData;

  if (!duration || !startSlot || !endSlot) {
    console.error("❌ Required integration fields missing:", integrationData);
    return;
  }

  const bookingTitle = `Goocast | ${personalInfo.fullName} | ${pkg.name?.en} | ${pkg.session_type?.en}`;

  const emailBookingData = {
    studio: {
      name: studio.name?.en,
      image: studio.thumbnail,
    },
    personalInfo,
    selectedAddOns: {
      totalPrice: totalAddOnsPriceFromDb,
      items: addOns,
    },
    selectedPackage: pkg.name?.en,
    date: bookingDate,
    startSlot,
    endSlot,
    duration,
    totalPrice: booking.totalPrice,
    totalPriceAfterDiscount,
    bookingId: booking._id,
  };

  const emailOptions = {
    to: personalInfo.email,
    subject: bookingTitle,
    message: bookingConfirmationEmailBody(emailBookingData),
  };

  const userData = {
    name: personalInfo.fullName,
    email: personalInfo.email,
    phone: personalInfo.phone,
  };

  const opportunityData = {
    name: bookingTitle,
    price: totalPriceAfterDiscount,
    sessionType: pkg.session_type,
    duration,
    studioName: studio.name,
    bookingId: booking._id,
  };

  const appointmentData = {
    startTime: combineDateAndTime(bookingDate, startSlot),
    endTime: combineDateAndTime(bookingDate, endSlot),
    title: bookingTitle,
    notes: personalInfo.fullName,
    studioId: studio._id,
  };

  const eventData = {
    summary: bookingTitle,
    start: {
      dateTime: combineDateAndTime(bookingDate, startSlot),
      timeZone: "Africa/Cairo",
    },
    end: {
      dateTime: combineDateAndTime(bookingDate, endSlot),
      timeZone: "Africa/Cairo",
    },
    attendees: [{ email: personalInfo.email }],
  };

  let opportunityID;
  let eventID;

  try {
    opportunityID = await saveOpportunityInGoHighLevel(
      userData,
      opportunityData,
      appointmentData
    );
    booking.opportunityID = opportunityID;

    eventID = await createCalendarEvent(eventData, {
      username: personalInfo.fullName,
      duration,
      package: pkg?.name?.en,
    });

    booking.eventID = eventID;

    await sendEmail(emailOptions);
    await booking.save();
  } catch (err) {
    console.error("Integration failed:", err.message);
  }
};
