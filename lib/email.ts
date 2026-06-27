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

export async function sendCustomerEmailReply({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.log(`[Email Mocked] To: ${to} | Subject: ${subject}`);
    console.log(`[Email Content]:\n`, html);
    return { success: true, mocked: true };
  }

  try {
    // If they have not set up a domain in Resend, sending to arbitrary emails will fail unless they use the verified domain.
    // We use a fallback from env, otherwise we default to the onboarding one (which will only work if 'to' is the same as the registered resend account email).
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Choma Zone <info@chomazonemtwapa.co.ke>";
    
    const data = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    return { success: true, id: data.data?.id };
  } catch (error: unknown) {
    console.error("Failed to send customer email via Resend:", error);
    return { success: false, error: String(error) };
  }
}
