const bookingConfirmationEmailBody = (booking) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const addOnsHTML = booking.selectedAddOns.items
    .map(
      (addOn) => `
      <div style="border:1px solid #e5e7eb; border-radius:8px; padding:12px; margin-bottom:10px;">
        <p style="margin:0; font-weight:600; color:#111827;">${addOn.name}</p>
        <p style="margin:4px 0; font-size:14px; color:#6b7280;">
          Qty: ${addOn.quantity} × ${addOn.price} EGP
        </p>
        <p style="margin:0; font-weight:600; color:#ed1e26;">
          ${addOn.quantity * addOn.price} EGP
        </p>
      </div>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Booking Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f3f4f6; margin:0; padding:20px; color:#111827;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="background:#ed1e26; padding:20px; text-align:center; color:#fff;">
      <h2 style="margin:0; font-size:22px;">Booking Confirmation</h2>
      <p style="margin:4px 0 0; font-size:14px;">Your studio booking has been confirmed</p>
    </div>

    <div style="padding:20px;">
      
      <!-- Booking Info -->
      <div style="margin-bottom:20px;">
        <p style="margin:0; font-size:14px; color:#6b7280;">Booking Date:</p>
        <p style="margin:4px 0; font-weight:600;">${formatDate(booking.date)}</p>
        <p style="margin:0; font-size:14px; color:#6b7280;">Booking ID:</p>
        <p style="margin:4px 0; font-weight:600;">${booking.bookingId}</p>
      </div>

      <!-- Studio Info -->
      <div style="display:flex; gap:16px; align-items:center; margin-bottom:20px;">
        <img src="${booking.studio.image}" alt="${booking.studio.name}" style="width:120px; height:120px; border-radius:8px; object-fit:cover; border:1px solid #e5e7eb;" />
        <div>
          <h3 style="margin:0; font-size:18px; font-weight:700;">${booking.studio.name}</h3>
        </div>
      </div>

      <!-- Date & Time -->
      <div style="margin-bottom:20px; border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
        <h4 style="margin:0 0 8px; font-size:16px; font-weight:600;">Date & Time</h4>
        <p style="margin:0; font-size:14px;">${formatDate(booking.date)}</p>
        <p style="margin:4px 0 0; font-size:14px;">
          Time Slot: <strong>${booking.startSlot} - ${booking.endSlot}</strong>
        </p>
        <p style="margin:4px 0 0; font-size:14px; color:#6b7280;">Duration: ${booking.duration} hours</p>
      </div>

      <!-- Package -->
      <div style="margin-bottom:20px; border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
        <h4 style="margin:0 0 8px; font-size:16px; font-weight:600;">Selected Package</h4>
        <p style="margin:0; font-size:14px; font-weight:600; color:#ed1e26;">${booking.selectedPackage}</p>
      </div>

      <!-- Add-ons -->
      <div style="margin-bottom:20px; border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
        <h4 style="margin:0 0 8px; font-size:16px; font-weight:600;">Selected Add-ons</h4>
        ${addOnsHTML}
        <p style="margin:0; font-weight:700; text-align:right; color:#ed1e26;">
          Total Add-ons: ${booking.selectedAddOns.totalPrice} EGP
        </p>
      </div>

      <!-- Personal Info -->
      <div style="margin-bottom:20px; border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
        <h4 style="margin:0 0 12px; font-size:16px; font-weight:600;">Personal Information</h4>
        <p style="margin:4px 0;"><strong>Full Name:</strong> ${booking.personalInfo.fullName}</p>
        <p style="margin:4px 0;"><strong>Phone:</strong> ${booking.personalInfo.phone}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${booking.personalInfo.email}</p>
        <p style="margin:4px 0;"><strong>Brand:</strong> ${booking.personalInfo.brand}</p>
      </div>

      <!-- Total -->
      <div style="background:#ed1e26; color:#fff; text-align:center; border-radius:8px; padding:20px; margin-bottom:20px;">
        <h4 style="margin:0; font-size:18px;">Total Amount</h4>
        <p style="margin:8px 0 0; font-size:24px; font-weight:700;">
          ${booking.totalPriceAfterDiscount} EGP
        </p>
      </div>

    </div>
  </div>
</body>
</html>
`;
};

module.exports = bookingConfirmationEmailBody;
