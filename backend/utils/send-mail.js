import transporter from "../config/mail.js";
import path from "path";
import fs from "fs";

const sendMail = async (to, subject, data) => {
    try {
        const templatePath = path.join(
            process.cwd(),
            "templates",
            "accept-invite.html"
        );

        let html = fs.readFileSync(templatePath, "utf8");

        html = html
            .replace("{{ link }}", data.link)
            .replace("{{ title }}", data.title)
            .replace("{{ startDate }}", data.startDate)
            .replace("{{ endDate }}", data.endDate)
            .replace("{{ userName }}", data.name);

        console.log("MAIL TO:", to);
        console.log("MAIL FROM:", process.env.SMTP_USER);

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: subject,
            html: html
        });

        console.log("EMAIL SENT:", info.messageId);

        return info;

    } catch (error) {
        console.error("EMAIL ERROR:", error);
        throw error;
    }
};

export default sendMail;