import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECT_LABELS: Record<string, string> = {
  general: "General Inquiry",
  guest: "Guest Request",
  sponsorship: "Sponsorship Inquiry",
  feedback: "Feedback",
};

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const subjectLabel = SUBJECT_LABELS[subject] || "General Inquiry";

    await resend.emails.send({
      from: "Speak Arizona <onboarding@resend.dev>",
      to: "podcast@aztoastmasters.org",
      replyTo: email,
      subject: `[Speak Arizona] ${subjectLabel} from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subjectLabel}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
