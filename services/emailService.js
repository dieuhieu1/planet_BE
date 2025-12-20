const nodemailer = require('nodemailer');
const process = require('process');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    service: "gmail",

    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Planet Web" <${process.env.EMAIL_USER}>`, // sender address
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
