/**
 * GoHighLevel Integration (Optimized)
 * Handles syncing contacts, appointments, and opportunities efficiently
 */

const axios = require("axios");
const { performance } = require("perf_hooks");
const studioModel = require("../models/studio-model/studio-model");

// Environment Variables
const BASE_URL = process.env.GO_HIGH_LEVEL_URL;
const LOCATION_ID = process.env.GO_HIGH_LEVEL_LOCATION_ID;
const CALENDAR_ID = process.env.GO_HIGH_LEVEL_CALENDAR_ID;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.GO_HIGH_LEVEL_API_KEY}`,
  version: process.env.GO_HIGH_LEVEL_VERSION,
};

// Cache calendar user to avoid redundant API calls
let cachedUserId = null;

/* --------------------------------------------------------
1. Search for contact by field (email/phone)
---------------------------------------------------------*/
const searchContact = async (field, value) => {
  if (!value) return null;
  const url = `${BASE_URL}/contacts/search/`;
  const body = {
    locationId: LOCATION_ID,
    pageLimit: 1,
    filters: [{ field, operator: "eq", value }],
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response?.data?.contacts?.[0]?.id || null;
  } catch (error) {
    console.error(
      `Error searching contact by ${field}:`,
      error.response?.status,
      error.response?.data || error.message
    );
    return null;
  }
};

/* --------------------------------------------------------
2. Create new contact
---------------------------------------------------------*/
const createContact = async (contactData) => {
  const url = `${BASE_URL}/contacts`;
  const [firstName, lastName] = contactData?.name?.split(" ") || [];

  const body = {
    locationId: LOCATION_ID,
    firstName,
    lastName,
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.contact.id;
  } catch (error) {
    const { status, data } = error.response || {};
    console.error("Error creating contact:", status, data);

    if (
      status === 409 ||
      (data?.message && data.message.includes("already exists"))
    ) {
      let contactId = await searchContact("email", contactData.email);
      if (!contactId && contactData.phone)
        contactId = await searchContact("phone", contactData.phone);
      return contactId;
    }

    throw error;
  }
};

/* --------------------------------------------------------
3. Get or create contact ID
---------------------------------------------------------*/
const getContactID = async (userData) => {
  let contactId = await searchContact("email", userData.email);
  if (!contactId && userData.phone)
    contactId = await searchContact("phone", userData.phone);
  if (!contactId) contactId = await createContact(userData);
  return contactId;
};

/* --------------------------------------------------------
4. Check for appointment conflict
---------------------------------------------------------*/
const checkAppointmentConflict = async (calendarId, startTime, endTime) => {
  const url = `${BASE_URL}/calendars/${calendarId}/free-slots`;

  const params = {
    startDate: new Date(startTime).getTime() - 3 * 60 * 60 * 1000, // check ±3h window
    endDate: new Date(endTime).getTime() + 3 * 60 * 60 * 1000,
    timezone: "Africa/Cairo",
  };

  try {
    const res = await axios.get(url, { headers, params });
    const allSlots = Object.entries(res.data)
      .filter(([key]) => key !== "traceId")
      .flatMap(([_, dayData]) => dayData?.slots || []);

    const requestedStart = new Date(startTime).getTime();
    const slotFound = allSlots.some(
      (slotTime) => new Date(slotTime).getTime() === requestedStart
    );

    return !slotFound; // true = conflict
  } catch (err) {
    console.error(
      "Error checking free slots:",
      err.response?.status,
      err.response?.data || err.message
    );
    return true; // assume conflict on error
  }
};

/* --------------------------------------------------------
5. Get calendar assigned user (cached)
---------------------------------------------------------*/
const getCalendarUsers = async (calendarId) => {
  if (cachedUserId) return cachedUserId;

  const url = `${BASE_URL}/calendars/${calendarId}`;
  try {
    const res = await axios.get(url, { headers });
    cachedUserId = res.data?.calendar?.teamMembers?.[0]?.userId || null;
    return cachedUserId;
  } catch (err) {
    console.error(
      "Error fetching calendar users:",
      err.response?.status,
      err.response?.data || err.message
    );
    return null;
  }
};

/* --------------------------------------------------------
6. Create appointment
---------------------------------------------------------*/
const createAppointment = async (contactId, appointmentData) => {
  const hasConflict = await checkAppointmentConflict(
    CALENDAR_ID,
    appointmentData.startTime,
    appointmentData.endTime
  );
  if (hasConflict) return false;

  const assignedUserId = await getCalendarUsers(CALENDAR_ID);
  const url = `${BASE_URL}/calendars/events/appointments`;

  const body = {
    calendarId: CALENDAR_ID,
    locationId: LOCATION_ID,
    contactId,
    startTime: appointmentData.startTime,
    endTime: appointmentData.endTime,
    title: appointmentData.title || "Booking Appointment",
    notes: appointmentData.notes || "",
    assignedUserId,
  };

  try {
    await axios.post(url, body, { headers });
    return true;
  } catch (error) {
    console.error("Error creating appointment:", error.response?.data);
    return false;
  }
};

/* --------------------------------------------------------
7. Create opportunity
---------------------------------------------------------*/
const createOpportunity = async (opportunityData) => {
  const url = `${BASE_URL}/opportunities/`;

  const body = {
    locationId: LOCATION_ID,
    pipelineId: process.env.GO_HIGH_LEVEL_PIPELINE_ID,
    pipelineStageId: process.env.GO_HIGH_LEVEL_PIPELINE_STAGE_ID,
    contactId: opportunityData.contactId,
    monetaryValue: opportunityData.price,
    name: opportunityData.name,
    source: "Goocast Booking Website",
    status: "open",
    customFields: [
      { key: "payment_status", field_value: "Pending" },
      { key: "session_type", field_value: opportunityData.sessionType },
      { key: "session_duration", field_value: opportunityData.duration },
      { key: "studio_name", field_value: opportunityData.studioName },
      { key: "appointments_status", field_value: "Confirmed" },
      { key: "booking_id", field_value: opportunityData.bookingId.toString() },
    ],
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.opportunity.id;
  } catch (error) {
    const { status, data } = error.response || {};
    console.error("Error creating opportunity:", status, data);

    if (status === 409 || data?.message?.includes("already exists")) {
      return null;
    }
    throw error;
  }
};

/* --------------------------------------------------------
8. Save opportunity + appointment (Optimized)
---------------------------------------------------------*/
const saveOpportunityInGoHighLevel = async (
  userData,
  opportunityData,
  appointmentData
) => {
  const totalStart = performance.now();

  try {
    // Run independent tasks in parallel
    const [contactId, assignedUserId] = await Promise.all([
      getContactID(userData),
      getCalendarUsers(CALENDAR_ID),
    ]);

    opportunityData.contactId = contactId;

    // Check for conflict and create appointment if possible
    const hasConflict = await checkAppointmentConflict(
      CALENDAR_ID,
      appointmentData.startTime,
      appointmentData.endTime
    );

    if (hasConflict) return null;

    const appointmentCreated = await createAppointment(contactId, {
      ...appointmentData,
      assignedUserId,
    });

    if (!appointmentCreated) return null;

    // Create opportunity
    const opportunityID = await createOpportunity(opportunityData);
    return opportunityID || null;
  } catch (err) {
    console.error("Fatal error in saveOpportunityInGoHighLevel:", err);
    throw err;
  } finally {
    const duration = (performance.now() - totalStart).toFixed(2);
    console.log(`Process completed in ${duration} ms`);
  }
};

module.exports = saveOpportunityInGoHighLevel;
