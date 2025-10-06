const { google } = require("googleapis");

// Connect with google api
const auth = new google.auth.JWT({
  email: process.env.client_email,
  key: process.env.private_key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Connect with calendar
const calendar = google.calendar({ version: "v3", auth });

// Simple Data
const testEventDate = {
  summary: "Test Event from Node.js",
  location: "Cairo, Egypt",
  description: "This is a test event created using Google Calendar API",
  start: {
    dateTime: "2025-10-06T10:00:00+02:00",
    timeZone: "Africa/Cairo",
  },
  end: {
    dateTime: "2025-10-06T12:00:00+02:00",
    timeZone: "Africa/Cairo",
  },
  attendees: [{ email: "someone@example.com" }],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 10 },
    ],
  },
};

// Create event
exports.createCalendarEvent = async () => {
  try {
    const res = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      // calendarId:
      //   "c_4f8c39d5ea3153c0229ab525d482f7afebe6207de0ed7ec383d98f8c9efa321d@group.calendar.google.com",
      resource: testEventDate,
    });

    console.log("Event created: %s", res.data.htmlLink);
  } catch (err) {
    console.error("Error creating event:", err);
  }
};

// createCalendarEvent();

// Update event
const updateCalenderEvent = () => {};
