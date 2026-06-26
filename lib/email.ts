import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Fallback email if admin settings do not specify one
const FALLBACK_ADMIN_EMAIL = "peter@chomazone.com"; // Adjust to a sensible default or dynamic fallback

interface EmailNotificationOptions {
  to?: string;
  subject: string;
  html: string;
}

export async function sendAdminEmailNotification({
  to,
  subject,
  html,
}: EmailNotificationOptions) {
  const recipient = to || process.env.ADMIN_NOTIFICATION_EMAIL || FALLBACK_ADMIN_EMAIL;

  if (!resend) {
    console.log(`[Email Mocked] To: ${recipient} | Subject: ${subject}`);
    console.log(`[Email Content]:\n`, html);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: "Choma Zone Alerts <onboarding@resend.dev>", // Can be configured with custom domain later
      to: recipient,
      subject: subject,
      html: html,
    });

    return { success: true, id: data.data?.id };
  } catch (error: unknown) {
    console.error("Failed to send admin email notification via Resend:", error);
    return { success: false, error: String(error) };
  }
}
