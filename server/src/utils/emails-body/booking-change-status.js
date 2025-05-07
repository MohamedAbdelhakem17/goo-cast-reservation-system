function changeBookingStatusEmail({ type, data }) {
    const customerName = data.personalInfo.fullName;
    const studioName = data.studio.name;
    const bookingId = data._id;
    const date = new Date(data.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const startSlot = data.startSlot;
    const endSlot = data.endSlot;
    const duration = data.duration;

    let heading = '';
    let subHeading = '';
    let message = '';
    let color = '';

    if (type === 'approved') {
        heading = '✅ Booking Confirmation';
        subHeading = `Your booking has been successfully confirmed.`;
        color = '#4CAF50'; // Green
        message = `
        <p>Dear ${customerName},</p>
        <p>
          We are pleased to inform you that your booking at <strong>${studioName}</strong> has been <strong>confirmed</strong>.
          Below are the details of your reservation:
        </p>
        <ul style="list-style: none; padding-left: 0; line-height: 2; margin-top: 16px;">
          <li><strong>Studio:</strong> ${studioName}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${startSlot} – ${endSlot}</li>
          <li><strong>Duration:</strong> ${duration} hour(s)</li>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
        </ul>
        <p>
          Please arrive at least 10 minutes before your scheduled time to ensure a smooth experience.
        </p>
      `;
    } else if (type === 'rejected') {
        heading = '⚠️ Booking Rejection';
        subHeading = `Your booking request could not be confirmed.`;
        color = '#F44336'; // Red
        message = `
        <p>Dear ${customerName},</p>
        <p>
          We regret to inform you that your booking request for <strong>${studioName}</strong> on <strong>${date}</strong> 
          from <strong>${startSlot}</strong> to <strong>${endSlot}</strong> could not be confirmed at this time.
        </p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p>
          We apologize for the inconvenience. We encourage you to explore alternative time  or contact our support team for assistance.
        </p>
      `;
    } else {
        throw new Error('Unsupported email type.');
    }

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 32px; background-color: #ffffff; border-radius: 12px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <h2 style="color: ${color}; text-align: center; font-size: 24px; margin-bottom: 8px;">${heading}</h2>
        <p style="text-align: center; font-size: 16px; color: #555; margin-bottom: 24px;">${subHeading}</p>
        
        <div style="background-color: #f4f6f8; padding: 20px; border-radius: 8px; color: #333;">
          ${message}
        </div>
  
        <p style="margin-top: 32px; font-size: 14px; color: #777; text-align: center;">
          If you have any questions or need further assistance, please don’t hesitate to reach out to us.
        </p>
  
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
  
        <p style="font-size: 14px; color: #444; text-align: center;">
          Warm regards,<br />
          <strong style="color: #222;">Goocast Studio Team</strong><br />
          <span style="font-size: 13px; color: #999;">Empowering your creativity</span>
        </p>
      </div>
    `;
}

module.exports = changeBookingStatusEmail;
