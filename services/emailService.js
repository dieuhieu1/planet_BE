const nodemailer = require('nodemailer');
const process = require('process');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    service: "gmail",

    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Planet Web" <no-reply@planet_web.com>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html // html body
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw error;
    }
};

module.exports = { sendEmail };
