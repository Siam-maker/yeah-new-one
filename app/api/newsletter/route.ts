import { getNewsletterEndpoint } from "@/lib/newsletter";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 2048) {
    return Response.json({ message: "This subscription request is too large." }, { status: 413 });
  }

  let email = "";
  try {
    const raw = await request.text();
    if (raw.length > 2048) return Response.json({ message: "This subscription request is too large." }, { status: 413 });
    const data = JSON.parse(raw);
    if (data && typeof data.email === "string") email = data.email.trim();
  } catch {
    return Response.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
    return Response.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  const endpoint = getNewsletterEndpoint();
  if (!endpoint) return Response.json({ message: "Subscriptions are currently closed." }, { status: 503 });

  const headers = new Headers({ "Content-Type": "application/json" });
  if (process.env.NEWSLETTER_TOKEN) headers.set("Authorization", `Bearer ${process.env.NEWSLETTER_TOKEN}`);

  try {
    const response = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({ email }), cache: "no-store",
      redirect: "error", signal: AbortSignal.timeout(8000) });
    if (response.ok) return Response.json({ message: "The mailing service accepted your request." });
  } catch {}
  return Response.json({ message: "The mailing service could not accept this request. Try again later." }, { status: 502 });
}
