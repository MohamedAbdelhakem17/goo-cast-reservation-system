import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { useBooking } from "../../../../context/Booking-Context/BookingContext"

export default function Component() {
  const { setBookingField, bookingData, handleNextStep } = useBooking()

  const today = new Date()

  const handleStartDate = () => {
    const date = new Date()
    const hour = date.getHours()
    if (hour > 18) {
      date.setDate(date.getDate() + 1)
    }
    return date
  }

  const [currentDate, setCurrentDate] = useState(
    bookingData.date ? new Date(bookingData.date) : handleStartDate()
  )

  useEffect(() => {
    if (bookingData.date) {
      setCurrentDate(new Date(bookingData.date))
    }
  }, [bookingData.date])

  const daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(1)
      direction === "prev"
        ? newDate.setMonth(prev.getMonth() - 1)
        : newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const isPrevDisabled =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth()

  const isDateInPast = (day) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return dateToCheck < todayStart
  }

  const isToday = (day) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return dateToCheck.toDateString() === today.toDateString()
  }

  const isSelected = (day) => {
    if (!bookingData.date) return false
    const selectedDate = new Date(bookingData.date)
    return (
      selectedDate.getFullYear() === currentDate.getFullYear() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getDate() === day
    )
  }

  const calendarDays = []

  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push({ date: null, blocked: true, isEmpty: true })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      date: day,
      blocked: isDateInPast(day),
      isEmpty: false,
      isToday: isToday(day),
      isSelected: isSelected(day),
    })
  }

  const remainingCells = 42 - calendarDays.length
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push({ date: null, blocked: true, isEmpty: true })
  }

  return (
    <div className="w-full mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            className="h-8 w-8 disabled:opacity-40"
            onClick={() => navigateMonth("prev")}
            disabled={isPrevDisabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-medium min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <button className="h-8 w-8" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">Recording Duration</span>
          </div>
          <span className="text-red-500 font-medium">1 hour</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-4 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`relative h-20 border-r border-b border-gray-200 last:border-r-0
                ${day.isEmpty ? "bg-gray-50"
                  : day.blocked ? "bg-white cursor-not-allowed"
                    : "bg-white hover:bg-blue-50 cursor-pointer transition-colors"}
                ${day.isToday ? "ring-2 ring-main ring-inset" : ""}
                ${day.isSelected ? "bg-blue-100" : ""}
              `}
              onClick={() => {
                if (!day.blocked && !day.isEmpty) {
                  const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date)
                  setBookingField("date", selectedDate)
                  setBookingField("startSlot", null)
                  setBookingField("endSlot", null)
                  setBookingField("studio", null)
                  handleNextStep()
                }
              }}
            >
              {/* Blocked style */}
              {day.blocked && !day.isEmpty && (
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      #d1d5db,
                      #d1d5db 2px,
                      transparent 2px,
                      transparent 8px
                    )`,
                  }}
                />
              )}

              {/* Date number */}
              {day.date && (
                <div
                  className={`absolute top-2 left-2 text-sm font-medium
                    ${day.blocked ? "text-gray-400"
                      : day.isToday ? "text-main font-bold"
                        : "text-gray-900"}
                  `}
                >
                  {day.date}
                </div>
              )}

              {/* Today dot */}
              {day.isToday && (
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-main rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
