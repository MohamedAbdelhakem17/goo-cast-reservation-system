const axios = require("axios");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.GO_HIGH_LEVEL_API_KEY}`,
  version: process.env.GO_HIGH_LEVEL_VERSION,
};

// Function to create a new contact in Go High Level
const createContact = async (contactData) => {
  const url = process.env.GO_HIGH_LEVEL_URL + "/contacts";
  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    full_name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.contact.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Create contact error:", error.response?.data);
      console.error("Status code:", error.response?.status);
    }
    throw error;
  }
};

// Function to get the contact ID from Go High Level
// If the contact does not exist, create a new one
const getContactID = async (userData) => {
  const url = process.env.GO_HIGH_LEVEL_URL + "/contacts/search/";
  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    pageLimit: 1,
    filters: [
      {
        field: "email",
        operator: "eq",
        value: userData.email,
      },
    ],
  };

  try {
    const response = await axios.post(url, body, { headers });
    const contactId = response?.data?.contacts[0]?.id;
    const isContactIdExists = Boolean(contactId);
    return isContactIdExists ? contactId : await createContact(userData);
  } catch (error) {
    console.error("Error fetching contact ID:", error.response?.data);
    throw error;
  }
};

const createOpportunity = async (opportunityData) => {
  const url = "https://services.leadconnectorhq.com/opportunities/";
  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    pipelineId: process.env.GO_HIGH_LEVEL_PIPELINE_ID,
    pipelineStageId: process.env.GO_HIGH_LEVEL_PIPELINE_STAGE_ID,
    contactId: opportunityData.contactId,
    monetaryValue: opportunityData.price,
    name: opportunityData.name,
    source: "Goocast Booking Website",
    status: "open",
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.opportunity.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response || {};

      console.error("Create opportunity error:", data);
      console.error("Status code:", status);

      if (
        status === 409 ||
        (data?.message && data.message.includes("already exists"))
      ) {
        console.warn("Opportunity already exists or was created, skipping.");
        return null;
      }
    }

    throw error;
  }
};

const createAppointment = async (contactId, appointmentData) => {
  const url = process.env.GO_HIGH_LEVEL_URL + "/calendars/events/appointments";

  const body = {
    calendarId: process.env.GO_HIGH_LEVEL_CALENDAR_ID,
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    contactId,
    startTime: appointmentData.startTime,
    endTime: appointmentData.endTime,
    title: appointmentData.title || "Booking Appointment",
    notes: appointmentData.notes || "",
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log("✅ Appointment created:", response.data?.data?.id);
    return response.data?.data?.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Create appointment error:", error.response?.data);
    }
    throw error;
  }
};

const saveOpportunityInGoHighLevel = async (
  userData,
  opportunityData,
  appointmentData
) => {
  // Get or create the contact ID
  const contactId = await getContactID(userData);
  opportunityData.contactId = contactId;

  // Create or update the opportunity
  await createOpportunity(opportunityData);

  // If appointment data is provided, create the appointment
  if (appointmentData?.startTime) {
    await createAppointment(contactId, appointmentData);
  }
};

module.exports = saveOpportunityInGoHighLevel;
