// convert time string to minutes
// e.g. "08:00" -> 480
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}


// Convert minutes to time string
// e.g. 480 -> "08:00"
function minutesToTime(mins) {
    const hours = Math.floor(mins / 60).toString().padStart(2, '0');
    const minutes = (mins % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}


function getAllDay(inputDate) {
    const date = new Date(inputDate);
    const startOfDay = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0, 0, 0
    ));
    const endOfDay = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + 1,
        0, 0, 0
    ));

    return { startOfDay, endOfDay };
}


module.exports = {
    timeToMinutes,
    minutesToTime,
    getAllDay,
}