const axios = require("axios");
const studioModel = require("../models/studio-model/studio-model");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.GO_HIGH_LEVEL_API_KEY}`,
  version: process.env.GO_HIGH_LEVEL_VERSION,
};

/**
 * Search for a contact in Go High Level by a specific field (email or phone).
 */

const searchContact = async (field, value) => {
  if (!value) return null;

  const url = process.env.GO_HIGH_LEVEL_URL + "/contacts/search/";
  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    pageLimit: 1,
    filters: [{ field, operator: "eq", value }],
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response?.data?.contacts?.[0]?.id || null;
  } catch (error) {
    console.error(`Error searching contact by ${field}:`, error.response?.data);
    return null;
  }
};

/**
 * Create a new contact in Go High Level.
 * If phone number or email already exists, return the existing contact ID.
 */
const createContact = async (contactData) => {
  const url = process.env.GO_HIGH_LEVEL_URL + "/contacts";
  const [firstName, lastName] = contactData?.name?.split(" ") || [];
  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    firstName: firstName,
    lastName: lastName,
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.contact.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response || {};

      console.error("Create contact error:", data);
      console.error("Status code:", status);

      // If duplicate contact error, return existing ID instead of throwing
      if (
        status === 409 ||
        (data?.message && data.message.includes("already exists"))
      ) {
        console.warn(
          "Contact already exists, retrieving existing contact ID..."
        );
        // Try finding the contact by email, then by phone
        let contactId = await searchContact("email", contactData.email);
        if (!contactId && contactData.phone) {
          contactId = await searchContact("phone", contactData.phone);
        }
        return contactId;
      }
    }
    throw error;
  }
};

/**
 * Get or create the contact ID in Go High Level.
 */
const getContactID = async (userData) => {
  // Try finding the contact by email first
  let contactId = await searchContact("email", userData.email);

  // If not found by email, search by phone
  if (!contactId && userData.phone) {
    contactId = await searchContact("phone", userData.phone);
  }

  // If no contact found, create a new one
  return contactId ? contactId : await createContact(userData);
};

/**
 * Create an opportunity in Go High Level.
 */
const createOpportunity = async (opportunityData) => {
  const url = process.env.GO_HIGH_LEVEL_URL + "/opportunities/";

  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    pipelineId: process.env.GO_HIGH_LEVEL_PIPELINE_ID,
    pipelineStageId: process.env.GO_HIGH_LEVEL_PIPELINE_STAGE_ID,
    contactId: opportunityData.contactId,
    monetaryValue: opportunityData.price,
    name: opportunityData.name,
    source: "Goocast Booking Website",
    status: "open",
    customFields: [
      {
        key: "payment_status",
        field_value: "Pending",
      },
      {
        key: "session_type",
        field_value: opportunityData.sessionType,
      },
      {
        key: "session_deuration",
        field_value: opportunityData.duration,
      },
      {
        key: "studio_name",
        field_value: opportunityData.studioName,
      },
      {
        key: "appointments_status",
        field_value: "Confirmed",
      },
      {
        key: "booking_id",
        field_value: opportunityData.bookingId.toString(),
      },
    ],
  };

  try {
    const response = await axios.post(url, body, { headers });
    const opportunityID = response.data.opportunity.id;
    return opportunityID;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response || {};

      console.error("Create opportunity error:", data);
      console.error("Status code:", status);

      // If opportunity already exists, skip creating a new one
      if (
        status === 409 ||
        (data?.message && data.message.includes("already exists"))
      ) {
        console.warn(
          "Opportunity already exists or was already created, skipping."
        );
        return null;
      }
    }
    throw error;
  }
};

/**
 * Create an appointment in Go High Level.
 */
const createAppointment = async (contactId, appointmentData) => {
  const url = process.env.GO_HIGH_LEVEL_URL + "/calendars/events/appointments";
  const studio = await studioModel.findById(appointmentData.studioId);
  const calendarId = studio?.calendarId;

  const body = {
    calendarId: calendarId || process.env.GO_HIGH_LEVEL_CALENDAR_ID,
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    contactId,
    startTime: appointmentData.startTime,
    endTime: appointmentData.endTime,
    title: appointmentData.title || "Booking Appointment",
    notes: appointmentData.notes || "",
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log("✅ Appointment created:", response.data);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Create appointment error:", error.response?.data);
      return false;
    }
  }
};

/**
 * Main function to save opportunity and appointment in Go High Level.
 */

const saveOpportunityInGoHighLevel = async (
  userData,
  opportunityData,
  appointmentData
) => {
  let opportunityID;
  // Get or create the contact ID
  const contactId = await getContactID(userData);
  opportunityData.contactId = contactId;

  // If appointment data is provided, create the appointment first
  if (appointmentData?.startTime) {
    const appointmentCreated = await createAppointment(
      contactId,
      appointmentData
    );
    // Create opportunity only if appointment creation succeeded
    if (appointmentCreated) {
      opportunityID = await createOpportunity(opportunityData);
    } else {
      throw new Error("Failed to create appointment in Go High Level");
    }
    return opportunityID;
  }
};

module.exports = saveOpportunityInGoHighLevel;
