import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';

interface EmailOptions {
    email: string;
    subject: string;
    template?: string;
    message?: string;
    cloudinaryCode: string;
    data?: { [key: string]: any };
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASS,
        },
    });

    const { email, subject, template, data, message, cloudinaryCode } = options;

    if (template && data) {
        // https://res.cloudinary.com/dkzfopuco/raw/upload/v1751719802/mails/taskhub/invite-user-workspace.ejs
        // https://res.cloudinary.com/dkzfopuco/raw/upload/v1751719802/mails/taskhub/reset-password.ejs
        // https://res.cloudinary.com/dkzfopuco/raw/upload/v1751719802/mails/taskhub/verify-email.ejs
        // https://res.cloudinary.com/dkzfopuco/raw/upload/v1751881841/mails/taskhub/two-factor-enabled-code.ejs
        const response = await fetch(
            `https://res.cloudinary.com/dkzfopuco/raw/upload/${cloudinaryCode}/mails/taskhub/${template}`
        );
        const templateData = await response.text();

        let emailHtml;

        try {
            emailHtml = await ejs.render(templateData, data);
        } catch (error) {
            console.error('Error rendering email template:', error);
            throw new Error('Could not render email template');
        }

        if (!emailHtml) {
            throw new Error('Error while rendering email data');
        }

        // const response = await axios.get(templateURL);
        // const templateString = response.data;

        //Render the email template with ejs
        // const html: string = await ejs.renderFile(templateString, data);

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html: emailHtml,
        };
        await transporter.sendMail(mailOptions);
    } else {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            message,
        };
        await transporter.sendMail(mailOptions);
    }
};

export default sendEmail;
