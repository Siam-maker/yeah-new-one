export function getNewsletterEndpoint() {
  if (!process.env.NEWSLETTER_ENDPOINT) return null;
  try {
    const endpoint = new URL(process.env.NEWSLETTER_ENDPOINT);
    return endpoint.protocol === "https:" && !endpoint.username && !endpoint.password ? endpoint : null;
  } catch { return null; }
}
