const bookingConfirmationEmailBody = (booking) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const addOnsHTML = booking.selectedAddOns.items
        .map(
            (addOn) => `
<div class="addon-item" style="padding: 12px 0; border-bottom: 1px solid #eee;">
    <div class="addon-info" style="display: flex; align-items: center;">
        <div class="addon-bar"
            style="width: 6px; height: 40px; background-color: #ccc; margin-right: 12px; border-radius: 4px;"></div>
        <div style="flex-grow: 1;">
            <p class="addon-name" style="margin: 0 30px; font-weight: 500; font-size: 14px;">${addOn.name}</p>
            <p class="addon-detail" style="margin: 2px 0 0 0; font-size: 13px; color: #666;">Qty: ${addOn.quantity} ×
                ${addOn.price} EGP</p>
        </div>
        <div class="addon-total" style="font-weight: bold; font-size: 14px;">
            ${addOn.quantity * addOn.price} EGP
        </div>
    </div>
</div>

`,
        )
        .join("")

    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 24px;
            line-height: 1.5;
            color: #1a202c;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            animation: fadeIn 0.8s ease-in;
            border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .top-bar {
            height: 8px;
            background: linear-gradient(to right, #4f46e5, #8b5cf6, #ec4899);
        }

        .content {
            padding: 40px;
        }

        .center {
            text-align: center;
        }

        .icon-circle {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #4f46e5, #8b5cf6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }

        .icon-circle:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 15px 30px rgba(79, 70, 229, 0.3);
        }

        .icon-circle i {
            color: #ffffff;
            font-size: 32px;
        }

        h2 {
            font-size: 32px;
            font-weight: 800;
            color: #1a202c;
            margin-bottom: 12px;
            background: linear-gradient(to right, #4f46e5, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .text-muted {
            color: #64748b;
            font-size: 16px;
            font-weight: 400;
            margin-bottom: 8px;
        }

        .highlight-date {
            background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
            color: #4338ca;
            font-size: 15px;
            padding: 8px 16px;
            border-radius: 12px;
            font-weight: 600;
            display: inline-block;
            margin-top: 12px;
            box-shadow: 0 2px 10px rgba(79, 70, 229, 0.1);
            transition: transform 0.2s ease;
        }

        .highlight-date:hover {
            transform: translateY(-2px);
        }

        .section {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 16px;
            margin: 30px 0;
            transition: all 0.3s ease;
            border: 1px solid rgba(226, 232, 240, 0.6);
            position: relative;
            overflow: hidden;
        }

        .section::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(to right, #4f46e5, #8b5cf6);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s ease;
        }

        .section:hover {
            background-color: #ffffff;
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
        }

        .section:hover::after {
            transform: scaleX(1);
        }

        .flex {
            display: flex;
            gap: 30px;
            align-items: center;
        }

        .studio-img {
            width: 180px;
            height: 180px;
            border-radius: 16px;
            object-fit: cover;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 4px solid white;
        }

        .studio-img:hover {
            transform: scale(1.03);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        .label {
            display: inline-block;
            background: linear-gradient(135deg, #4f46e5, #8b5cf6);
            color: #ffffff;
            padding: 8px 18px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 16px;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .label:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
        }

        .info-title {
            font-weight: 700;
            font-size: 20px;
            color: #1a202c;
            margin: 8px 0;
        }

        .info-subtitle {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 4px;
        }

        .time-box-flex {
            flex-direction: column;
        }

        .time-box {
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            padding: 16px 24px;
            border-radius: 14px;
            font-size: 16px;
            font-weight: 600;
            color: #334155;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease;
            border: 1px solid rgba(226, 232, 240, 0.8);
            margin: 20px 0;
        }

        .time-box:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .package-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 20px;
        }

        .package-item {
            background-color: #f1f5f9;
            padding: 20px;
            border-radius: 14px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .package-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            background-color: #ffffff;
        }

        .package-highlight {
            background: linear-gradient(135deg, #4f46e5, #8b5cf6);
            color: #ffffff;
            box-shadow: 0 10px 25px rgba(79, 70, 229, 0.2);
            border: none;
        }

        .package-highlight .info-subtitle {
            color: rgba(255, 255, 255, 0.8);
        }

        .package-highlight:hover {
            transform: translateY(-5px) scale(1.03);
            box-shadow: 0 15px 30px rgba(79, 70, 229, 0.3);
        }

        .addon-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #ffffff;
            padding: 16px 20px;
            border-radius: 14px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
            border: 1px solid rgba(226, 232, 240, 0.8);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .addon-item:hover {
            background-color: #f8fafc;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }

        .addon-info {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .addon-bar {
            width: 6px;
            height: 40px;
            background: linear-gradient(to bottom, #4f46e5, #8b5cf6);
            border-radius: 6px;
        }

        .addon-name {
            font-weight: 700;
            color: #1a202c;
            font-size: 16px;
            margin-bottom: 4px;
        }

        .addon-detail {
            font-size: 14px;
            color: #64748b;
        }

        .addon-total {
            font-weight: 700;
            color: #4f46e5;
            font-size: 18px;
        }

        .grid-2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .info-box {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 14px;
            margin: 20px 0;
            transition: all 0.3s ease;
            border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .info-box:hover {
            background-color: #ffffff;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }

        .total-section {
            background: linear-gradient(135deg, #4f46e5, #8b5cf6, #ec4899);
            padding: 40px;
            color: #ffffff;
            border-radius: 16px;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 15px 30px rgba(79, 70, 229, 0.2);
            margin: 40px 0 20px;
        }

        .total-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), transparent 70%);
            z-index: 0;
        }

        .total-section::after {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            background: rgba(255, 255, 255, 0.1);
            top: -50%;
            left: -50%;
            transform: rotate(30deg);
            z-index: 0;
        }

        .total-price {
            font-size: 48px;
            font-weight: 800;
            margin: 16px 0;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .cta-button {
            display: inline-block;
            background: #ffffff;
            color: #4f46e5;
            padding: 14px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            margin: 20px 0;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .cta-button:hover {
            background: #f8fafc;
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            position: relative;
        }

        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, #4f46e5, #8b5cf6, #ec4899, transparent);
        }

        .footer p {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .footer a:hover {
            color: #6366f1;
            text-decoration: underline;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e2e8f0, transparent);
            margin: 50px 0;
        }

        .badge {
            display: inline-block;
            background-color: #fee2e2;
            color: #ef4444;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 8px;
        }

        .section-title {
            position: relative;
            display: inline-block;
            margin-bottom: 20px;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 40px;
            height: 3px;
            background: linear-gradient(to right, #4f46e5, #8b5cf6);
            border-radius: 3px;
        }

        .booking-header {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        @media (max-width: 768px) {
            body {
                padding: 16px;
            }

            .content {
                padding: 30px 20px;
            }

            .flex {
                flex-direction: column;
                align-items: flex-start;
                gap: 40px;
            }

            .studio-img {
                width: 100%;
                height: auto;
                max-height: 220px;
            }

            .package-grid {
                grid-template-columns: 1fr;
            }

            .grid-2 {
                grid-template-columns: 1fr;
            }

            .section {
                padding: 20px;
            }

            .total-price {
                font-size: 36px;
            }

            .icon-circle {
                width: 70px;
                height: 70px;
            }

            h2 {
                font-size: 28px;
            }

            .booking-header {
                flex-direction: column;
                gap: 10px;
                align-items: flex-start;
            }
        }

        @media (max-width: 480px) {
            .content {
                padding: 24px 16px;
            }

            .section {
                padding: 16px;
                margin: 20px 0;
            }

            .total-section {
                padding: 30px 20px;
            }

            .total-price {
                font-size: 32px;
            }

            .addon-info {
                gap: 12px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="top-bar"></div>
        <div class="content">
            <div class="center">
                <h2>Booking Confirmation</h2>
                <p class="text-muted">Your studio booking has been confirmed</p>
                </div>
                <div 
                    style="gap: 20px; justify-content: space-between; align-items: center; display: flex;">
                    <p class="text-muted">Booking Date: <span class="highlight-date">${formatDate(booking.date)}</span>
                    </p>
                    <p class="text-muted">Booking ID: <span class="highlight-date">${booking.bookingId}</span></p>
                </div>

            <!-- Studio Info -->
            <div class="section flex" style="gap: 20px;">
                <img src="${booking.studio.image}" alt="${booking.studio.name}" class="studio-img" />
                <div>
                    <h3 class="info-title">${booking.studio.name}</h3>
                </div>
            </div>

            <!-- Date & Time -->
            <div class="section" style="padding:30px;">
                <h4 class="section-title info-title" style="margin-bottom: 12px; font-size: 16px; color: #333;">Date &
                    Time</h4>
                <div style="display: flex; gap: 24px; flex-wrap: wrap;">

                    <!-- Booking Date -->
                    <div style="flex: 1; min-width: 200px;">
                        <p class="info-subtitle" style="margin: 0; font-size: 13px; color: #777;">Booking Date</p>
                        <p class="info-title" style="margin: 4px 0 0; font-size: 15px; font-weight: 500; color: #222;">
                            ${formatDate(booking.date)}
                        </p>
                    </div>

                    <!-- Time Info -->
                    <div style="flex: 1; min-width: 200px;">
                        <p class="info-subtitle" style="margin: 0; font-size: 13px; color: #777;">Time Slot</p>
                        <p class="info-title" style="margin: 4px 0 0; font-size: 15px; font-weight: 500; color: #222;">
                            <i class="fa-regular fa-clock" style="margin-right: 6px;"></i> ${booking.startSlot} -
                            ${booking.endSlot}
                        </p>
                        <p class="info-subtitle" style="margin-top: 4px; font-size: 13px; color: #555;">
                            Duration: ${booking.duration} hours
                        </p>
                    </div>

                </div>
            </div>

            <!-- Package Info -->
            <div class="section">
                <h4 class="section-title info-title">Selected Package</h4>
                <div class="package-grid">
                    <div class="package-item">
                        <i class="fa-solid fa-box" style="font-size: 24px; color: #4f46e5; margin-bottom: 12px;"></i>
                        <p class="info-subtitle">Package Name</p>
                        <p class="info-title">${booking.selectedPackage}</p>
                    </div>
                </div>
            </div>

            <!-- Add-ons -->
            <div class="section">
                <h4 class="section-title info-title">Selected Add-ons</h4>
                <p class="info-subtitle" style="margin-bottom: 12px;">Additional services for your session</p>
                <div>${addOnsHTML}</div>

                <div class="addon-price">
                    <p class="addon-total">${booking.selectedAddOns.totalPrice} EGP</p>
                </div>

            </div>

            <!-- Personal Info -->
            <div class="section">
                <h4 class="section-title info-title">Personal Information</h4>
                <div class="grid-2">
                    <div class="info-box">
                        <p class="info-subtitle">Full Name</p>
                        <p class="info-title">${booking.personalInfo.fullName}</p>
                    </div>
                    <div class="info-box">
                        <p class="info-subtitle">Phone Number</p>
                        <p class="info-title">${booking.personalInfo.phone}</p>
                    </div>
                    <div class="info-box">
                        <p class="info-subtitle">Email Address</p>
                        <p class="info-title">${booking.personalInfo.email}</p>
                    </div>
                    <div class="info-box">
                        <p class="info-subtitle">Brand</p>
                        <p class="info-title">${booking.personalInfo.brand}</p>
                    </div>
                </div>
            </div>

            <!-- Total -->
            <div class="total-section">
                <h4 class="info-title" style="color: white; font-size: 22px;">Total Amount</h4>
                <p class="total-price">${booking.totalPrice || booking.studio.price + booking.selectedPackage.price +
        booking.selectedAddOns.totalPrice} EGP</p>
            </div>

            <div class="center">
                <p class="badge">Payment Required</p>
                <p class="text-muted" style="margin-top: 16px;">Please complete your payment within 2 hours to secure
                    your booking</p>
                <p style="margin-top: 16px;"><strong>This Booking Will Be Cancelled if not Paid Within 2 Hours</strong>
                </p>
            </div>
        </div>
    </div>
</body>

</html>
`
}

module.exports = bookingConfirmationEmailBody