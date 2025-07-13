export function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes)
    date.setHours(date.getHours() + duration)
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

export function calculateTotalPrice(duration, pricePerHour) {
    return duration * pricePerHour
}
