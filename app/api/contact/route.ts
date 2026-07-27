import { NextRequest, NextResponse } from "next/server";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM_ADDRESS = "Level Pro Website <contact@send.levelpro.es>";
const TO_ADDRESS = "info@levelpro.es";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
  locale?: unknown;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 15_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const website = typeof payload.website === "string" ? payload.website.trim() : "";
  const locale = ["en", "de", "es"].includes(String(payload.locale)) ? String(payload.locale) : "es";

  // Honeypot submissions are acknowledged without sending an email.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || name.length > 120 || !isValidEmail(email) || !message || message.length > 5000) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "Email service unavailable" }, { status: 500 });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const subjectName = name.replace(/[\r\n]+/g, " ");

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: email,
        subject: `Mesaj nou de pe levelpro.es — ${subjectName}`,
        text: `Nume: ${name}\nEmail: ${email}\nLimba site-ului: ${locale.toUpperCase()}\n\nMesaj:\n${message}`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#020a25;line-height:1.6;max-width:640px">
            <h1 style="font-size:22px;margin:0 0 24px">Mesaj nou de pe levelpro.es</h1>
            <p><strong>Nume:</strong> ${safeName}<br />
            <strong>Email:</strong> ${safeEmail}<br />
            <strong>Limba site-ului:</strong> ${locale.toUpperCase()}</p>
            <div style="margin-top:24px;padding:20px;border:1px solid #dfe2e8;border-radius:12px">${safeMessage}</div>
          </div>
        `,
      }),
      cache: "no-store",
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("Contact form: Resend rejected the request", resendResponse.status, resendError);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form: email request failed", error);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }
}
