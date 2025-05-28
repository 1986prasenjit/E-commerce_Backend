import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
    let mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'https://mailgen.js/'
        }
    });

    let emailText = mailGenerator.generatePlaintext(options.mailGenContent);

    let emailHtml = mailGenerator.generate(options.mailGenContent);

    var transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        }
    });

    const mail = {
        from: `"devLeetLab" <${process.env.MAILTRAP_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHtml,
    }

    try {
        await transporter.sendMail(mail);
        console.log("Email sent successfully to", options.email);
    } catch (error) {
        console.error("Error while sending the email:", error);
    }
}

const emailVerificationMailgenContent = (userName, verificationUrl) => {
    return {
        body: {
            name: userName,
            intro: "Welcome to App! We 're very excited to have you on board",
            action: {
                instructions: "To get verify your email, please click here:",
                button: {
                    color: "#22BC66",
                    text: "Confirm your email",
                    link: verificationUrl
                }
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

const passwordVerificationMailgenContent = (userName, passwordVerificationUrl) => {
    return {
        body: {
            name: userName,
            intro: "We have got the request to reset your Password",
            action: {
                instructions: "To reset your password please click here",
                button: {
                    color: "#22BC66",
                    text: "Reset your password",
                    link: passwordVerificationUrl
                }
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

export { emailVerificationMailgenContent, passwordVerificationMailgenContent, sendMail }