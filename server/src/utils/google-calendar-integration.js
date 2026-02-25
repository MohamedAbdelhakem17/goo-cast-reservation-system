const { google } = require("googleapis");

// Connect with google api
const auth = new google.auth.JWT({
  email: process.env.client_email,
  key: process.env.private_key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
  subject: process.env.DELEGATED_USER,
});

// Connect with calendar
const calendar = google.calendar({ version: "v3", auth });

// Create event
exports.createCalendarEvent = async (
  eventData,
  { duration, username, package, studio },
) => {
  try {
    // Event Data
    const event = {
      ...eventData,
      location: "https://maps.app.goo.gl/6Bj1KmALHyWSXpa69",
      description: `Booking for studio in GooCast Studio
        Customer: ${username || "N/A"}
        Package: ${package || "N/A"}
        Duration: ${duration || 0} hours
        Studio: ${studio}`,

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

// Update event
exports.updateCalenderEvent = async (eventId, newEventData) => {
  try {
    // Check if event id exist
    if (!eventId) {
      throw new Error("Event ID is required to update an event");
    }

    // updata event data
    const { data } = await calendar.events.patch({
      calendarId: process.env.CALENDAR_ID,
      eventId,
      resource: newEventData,
      sendUpdates: "all",
    });

    return data.id;
  } catch (error) {
    console.error("Google Calendar Error (updateEvent):", err.message);
    throw new Error(`Google Calendar error: ${err.message}`);
  }
};

// Delete event
exports.deleteCalenderEvent = async (eventId) => {
  try {
    // Check if event id
    if (!eventId) {
      throw new Error("Event ID is required to delete an event");
    }

    // Delete event from google calendar
    const { data } = await calendar.events.delete({
      calendarId: process.env.CALENDAR_ID,
      eventId,
    });

    // If delete successfully
    return true;
  } catch (error) {
    console.error("Google Calendar Error (updateEvent):", err.message);
    throw new Error(`Google Calendar error: ${err.message}`);
  }
};

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
