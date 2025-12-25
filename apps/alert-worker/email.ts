import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API);

export async function alertMail(
  userEmail: string,
  websiteUrl: string,
  triggeredAt: string
) {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_MAIL!,
    to: userEmail,
    subject: `⚠️ Alert: ${websiteUrl} is down`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Website Down Alert</h2>
        <p>Your website <strong>${websiteUrl}</strong> is currently experiencing downtime.</p>
        <p><strong>Detected at:</strong> ${new Date(triggeredAt).toLocaleString()}</p>
        <p>Our monitoring system detected multiple consecutive failed checks. Please investigate as soon as possible.</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">This is an automated alert from your uptime monitoring service.</p>
      </div>
    `,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}
