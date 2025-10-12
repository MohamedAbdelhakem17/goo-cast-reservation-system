export function calculateEndTime(startTime, duration) {
  if (!startTime || typeof startTime !== "string" || typeof duration !== "number") {
    return null;
  }

  const [hoursStr, minutesStr] = startTime.split(":") || [];
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes) || duration < 0) {
    return null;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setHours(date.getHours() + duration);

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
}

export function calculateTotalPrice(duration, pricePerHour) {
  if (typeof duration !== "number" || typeof pricePerHour !== "number") {
    return 0;
  }

  if (duration < 0 || pricePerHour < 0) {
    return 0;
  }

  return duration * pricePerHour;
}
