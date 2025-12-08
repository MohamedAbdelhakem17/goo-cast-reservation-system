const BOOKING_STATUS = [
  { id: "new", label: "New" },
  // { id: "pending-payment", label: "Pending Payment" },
  { id: "paid", label: "Paid" },
  // { id: "scheduled", label: "Scheduled" },
  // { id: "in-studio", label: "In Studio" },
  { id: "completed", label: "Completed" },
  // { id: "needs-edit", label: "Needs Edit" },
  { id: "canceled", label: "Canceled" },
];

export const STATUS_VALUE = {
  new: "new",
  paid: "paid",
  completed: "completed",
  canceled: "canceled",
};

export default BOOKING_STATUS;
