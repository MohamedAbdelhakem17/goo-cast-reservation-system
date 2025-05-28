exports.getFreeSlots = (startOfDay, endOfDay, bookings) => {
  const freeSlots = [];

  let current = startOfDay;

  for (const booking of bookings) {
    if (booking.start > current) {
      freeSlots.push({ start: current, end: booking.start });
    }
    current = Math.max(current, booking.end);
  }

  if (current < endOfDay) {
    freeSlots.push({ start: current, end: endOfDay });
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const isToday = (() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const testDate = new Date();
    testDate.setHours(Math.floor(startOfDay / 60), startOfDay % 60, 0, 0);
    return testDate >= todayStart && testDate <= todayEnd;
  })();

  if (isToday) {
    return freeSlots.filter(
      (slot) => slot.end > nowMinutes && slot.start >= nowMinutes
    );
  }

  return freeSlots;
};
