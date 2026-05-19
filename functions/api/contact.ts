/// <reference types="@cloudflare/workers-types" />

import { Resend } from "resend";

interface Env {
  RESEND_API_KEY: string;
}

interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function clean(value: unknown): string {
  return String(value || "").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as ContactRequestBody;

    const name = clean(body.name);
    const email = clean(body.email);
    const subject = clean(body.subject) || "Website enquiry";
    const message = clean(body.message);

    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!env.RESEND_API_KEY) {
      return Response.json(
        { success: false, error: "Missing RESEND_API_KEY." },
        { status: 500 }
      );
    }

    const resend = new Resend(env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "App Sanity Customs <hello@appsanitycustoms.com>",
      to: ["hello@appsanitycustoms.com"],
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);

    return Response.json(
      { success: false, error: "Unable to send message." },
      { status: 500 }
    );
  }
};