const { google } = require("googleapis");

// Connect with google api
const auth = new google.auth.JWT({
  email: process.env.client_email,
  key: process.env.private_key,
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
});

// Connect with calendar
const calendar = google.calendar({ version: "v3", auth });

// Create event
exports.createCalendarEvent = async (
  eventData,
  { duration, username, package }
) => {
  try {
    // Event Data
    const event = {
      ...eventData,
      location: "https://maps.app.goo.gl/6Bj1KmALHyWSXpa69",
      description: `Booking for studio in GooCast Studio
        Customer: ${username || "N/A"}
        Package: ${package || "N/A"}
        Duration: ${duration || 0} hours`,

      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    };

    // Create event
    const { data } = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      resource: event,
    });

    //  return event id
    const eventId = data?.id;
    return eventId;
  } catch (err) {
    throw new Error(err);
  }
};

// createCalendarEvent();

// Update event
const updateCalenderEvent = () => {};

// // services/calendarService.js
// const { google } = require("googleapis");
// const path = require("path");

// const ACCOUNT_KEY = path.join(__dirname, "../config/service_account.json");

// const auth = new google.auth.GoogleAuth({
//   keyFile: ACCOUNT_KEY,
//   scopes: [
//     "https://www.googleapis.com/auth/calendar",
//     "https://www.googleapis.com/auth/calendar.events",
//   ],
// });

// class CalendarService {
//   static async createEvent(eventData) {
//     try {
//       // Basic validation
//       if (!eventData?.summary || !eventData?.start || !eventData?.end) {
//         throw new Error("Missing required event fields: summary, start, end");
//       }

//       const { data } = await calendar.events.insert({
//         calendarId: process.env.CALENDAR_ID,
//         resource: eventData,
//         sendUpdates: "all", // Notify attendees by email
//       });

//       return {
//         id: data.id,
//         link: data.htmlLink,
//         start: data.start,
//         end: data.end,
//       };
//     } catch (err) {
//       console.error("Google Calendar Error (createEvent):", err.message);
//       throw new Error(`Google Calendar error: ${err.message}`);
//     }
//   }

//   static async updateEvent(eventId, eventData) {
//     try {
//       if (!eventId) {
//         throw new Error("Event ID is required to update an event");
//       }

//       const { data } = await calendar.events.patch({
//         calendarId: process.env.CALENDAR_ID,
//         eventId,
//         resource: eventData,
//         sendUpdates: "all",
//       });

//       return {
//         id: data.id,
//         link: data.htmlLink,
//         start: data.start,
//         end: data.end,
//       };
//     } catch (err) {
//       console.error("Google Calendar Error (updateEvent):", err.message);
//       throw new Error(`Google Calendar error: ${err.message}`);
//     }
//   }

//   static async deleteEvent(eventId) {
//     try {
//       if (!eventId) {
//         throw new Error("Event ID is required to delete an event");
//       }

//       await calendar.events.delete({
//         calendarId: process.env.CALENDAR_ID,
//         eventId,
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Google Calendar Error (deleteEvent):", err.message);
//       throw new Error(`Google Calendar error: ${err.message}`);
//     }
//   }
// }

// module.exports = CalendarService;
