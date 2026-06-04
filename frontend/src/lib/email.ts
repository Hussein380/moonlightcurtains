import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendNotificationEmail(subject: string, text: string) {
  if (!resend || !process.env.CONTACT_EMAIL) {
    console.warn("Resend is not configured. Email not sent:", subject);
    return false;
  }

  try {
    await resend.emails.send({
      from: 'system@moonlightcurtains.com', // You must verify a domain in Resend for this to work in production
      to: process.env.CONTACT_EMAIL,
      subject: subject,
      text: text,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return false;
  }
}
