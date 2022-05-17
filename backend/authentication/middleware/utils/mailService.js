const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

exports.sendMail = (receiver, text) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.web.de",
        port: 587,
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.MAILUSER,
        to: receiver,
        subject: "New Password",
        text: text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};
