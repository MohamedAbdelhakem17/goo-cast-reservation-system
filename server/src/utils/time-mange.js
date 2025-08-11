const { DateTime } = require("luxon");

// Convert time string to minutes
// e.g. "08:00" -> 480
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to time string
// e.g. 480 -> "08:00"
function minutesToTime(mins) {
  const hours = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (mins % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Get start and end of the day (UTC)
function getAllDay(inputDate) {
  const date = new Date(inputDate);

  const startOfDay = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    )
  );

  const endOfDay = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() + 1,
      0,
      0,
      0
    )
  );

  return { startOfDay, endOfDay };
}

// Combine date (ISO) and time string with timezone
// const combineDateAndTime = (dateISO, timeStr, zone = "Africa/Cairo") => {
//   const [hour, minute] = timeStr.split(":").map(Number);

//   console.log("Combining date and time:", dateISO, timeStr);

//   const dt = DateTime.fromISO(dateISO, { zone }).set({
//     hour,
//     minute,
//     second: 0,
//     millisecond: 0,
//   });

//   console.log(dt, "combinedDateAndTime");

//   console.log(dt.toISO({ suppressMilliseconds: true }), "combinedDateAndTime");
//   return dt.toISO({ suppressMilliseconds: true });
// };

const combineDateAndTime = (dateISO, timeStr, zone = "Africa/Cairo") => {
  const [hour, minute] = timeStr.split(":").map(Number);

  let dateOnly;
  if (typeof dateISO === "string") {
    dateOnly = dateISO.split("T")[0];
  } else if (dateISO instanceof Date) {
    dateOnly = dateISO.toISOString().split("T")[0];
  } else if (DateTime.isDateTime(dateISO)) {
    dateOnly = dateISO.toISODate();
  } else {
    throw new Error("Unsupported date format");
  }

  const dt = DateTime.fromISO(dateOnly, { zone }).set({
    hour,
    minute,
    second: 0,
    millisecond: 0,
  });

  return dt.toISO({ suppressMilliseconds: true });
};

module.exports = {
  timeToMinutes,
  minutesToTime,
  getAllDay,
  combineDateAndTime,
};
