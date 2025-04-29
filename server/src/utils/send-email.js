const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host:process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const sendEmail = async (options) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.message,
    };
    const result = await transporter.sendMail(mailOptions);
    return result;
};

module.exports = sendEmail; 