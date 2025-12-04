// Resend email service integration - connection:conn_resend
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

// Get a fresh Resend client (tokens expire, so don't cache)
async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail
  };
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const senderEmail = fromEmail || params.from;
    console.log('Sending email via Resend...');
    console.log('From:', senderEmail);
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    
    const emailData: any = {
      to: params.to,
      from: senderEmail,
      subject: params.subject,
    };
    
    if (params.text) {
      emailData.text = params.text;
    }
    
    if (params.html) {
      emailData.html = params.html;
    }
    
    const result = await client.emails.send(emailData);
    console.log('Resend API response:', JSON.stringify(result, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Resend email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown email error' };
  }
}

export async function sendContactFormEmail(contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const emailHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Subject:</strong> ${contactData.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${contactData.message.replace(/\n/g, '<br>')}</p>
  `;

  const emailText = `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}
Message: ${contactData.message}
  `;

  return await sendEmail({
    to: 'Hello@appsanitycustoms.com',
    from: 'Hello@appsanitycustoms.com',
    subject: `Contact Form: ${contactData.subject}`,
    text: emailText,
    html: emailHtml,
  });
}
