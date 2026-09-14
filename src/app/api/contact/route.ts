import { NextRequest } from "next/server";
import { Resend } from "resend";
import {
  internalError,
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
import { contactSchema, contactTopicLabels } from "@/lib/validations/contact";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO;
    const from =
      process.env.CONTACT_FROM ?? "MockData <onboarding@resend.com>";

    if (!apiKey || !to) {
      console.error("Contact form missing RESEND_API_KEY or CONTACT_TO");
      return jsonError(
        "CONFIG_ERROR",
        "Contact form is not configured",
        503,
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const { name, email, topic, message } = parsed.data;
    const topicLabel = contactTopicLabels[topic];
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `[${topicLabel}] MockData contact from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${topicLabel}`,
        "",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return jsonError("EMAIL_ERROR", "Could not send message", 502);
    }

    return jsonSuccess({ ok: true });
  } catch (error) {
    console.error("POST /api/contact failed:", error);
    return internalError();
  }
}
