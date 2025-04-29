const sendEmail = require("../utils/send-email");

const SendEmailRoute = (req, res, next) => {
    const err = req.body;
    try {

        // Construct the URL of the page where the error occurred
        const errorPageUrl = `${req.body.url}`;
        // Enhanced HTML Message with improved styles
        const htmlMessage = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f7fc;
                            color: #333;
                            margin: 0;
                            padding: 20px;
                        }
                        h2 {
                            color: #D32F2F;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .email-container {
                            max-width: 700px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 25px;
                            border-radius: 8px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        }
                        .error-section {
                            background-color: #f9f9f9;
                            padding: 20px;
                            margin: 20px 0;
                            border-radius: 6px;
                            border: 1px solid #ddd;
                        }
                        .error-section pre {
                            background-color: #2E2E2E;
                            color: #fff;
                            padding: 15px;
                            border-radius: 5px;
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            font-family: 'Courier New', monospace;
                        }
                        code {
                            display: block;
                            background-color: #f5f5f5;
                            padding: 10px;
                            border-radius: 5px;
                            margin-top: 10px;
                            font-family: 'Courier New', monospace;
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            color: #333;
                            font-size: 14px;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                        }
                        .link {
                            color: #1e88e5;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        .link:hover {
                            text-decoration: underline;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                            margin-top: 20px;
                        }
                        .info {
                            background-color: #f1f8e9;
                            padding: 15px;
                            border-radius: 5px;
                            margin: 15px 0;
                            border: 1px solid #ddd;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <h2>Error Notification</h2>
                        <div class="error-section">
                            <p><strong>Error Message:</strong></p>
                            <p>${err.error}</p>
                        </div>
                        <div class="error-section">
                            <p><strong>Stack Trace:</strong></p>
                            <code>${err.stack}</code>
                        </div>
                        <div class="info">
                            <p><strong>User Agent:</strong> ${req.get('User-Agent')}</p>
                            <p><strong>Error occurred at this URL: </strong><a href="${errorPageUrl}" target="_blank" class="link">${errorPageUrl}</a></p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email from the Website Monitoring System. Please do not reply.</p>
                        </div>
                    </div>
                </body>
            </html>

        `;

        sendEmail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER,
            subject: "Error in Website",
            message: htmlMessage,
        });

        res.status(200).json({
            message: "Email sent successfully."
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to send email",
            error: error.message
        });
    }
};

module.exports = {
    SendEmailRoute
}