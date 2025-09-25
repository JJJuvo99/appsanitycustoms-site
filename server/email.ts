// SendGrid email service integration - blueprint:javascript_sendgrid
import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(apiKey);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };
    
    if (params.text) {
      emailData.text = params.text;
    }
    
    if (params.html) {
      emailData.html = params.html;
    }
    
    await sgMail.send(emailData);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendContactFormEmail(contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
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
    from: 'Hello@appsanitycustoms.com', // SendGrid requires verified sender
    subject: `Contact Form: ${contactData.subject}`,
    text: emailText,
    html: emailHtml,
  });
}