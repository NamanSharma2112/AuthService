import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();   // local config – can stay here

export async function sendEmail(to: string, subject: string, html: string) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP configuration is missing in environment variables');
    }

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const form = process.env.EMAIL_FROM || user;
    const secure = process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === 'true'
        : port === 465;

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
            rejectUnauthorized: false  // only for development
        }
    });

    try {
        const info = await transporter.sendMail({
            from: form,
            to,
            subject,
            html
        });
        return info;
    } catch (error) {
        throw new Error('Failed to send email');
    }
}