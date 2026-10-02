/**
 * POST /api/quote: receives the Request a Quote form and emails it to the sales team.
 *
 * A Vercel Function (Node.js runtime), deployed with the site from this api/ folder.
 * It accepts the form's JSON (sent by src/components/QuoteForm.tsx) and, for visitors
 * without JavaScript, the plain HTML form post. Every submission is validated again here
 * with the same rules as the browser (src/lib/quote.ts), then sent through Resend.
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY  Required. API key from resend.com.
 *   QUOTE_FROM      Sender on a domain verified in Resend,
 *                   e.g. "Fortune Tradelinks Website <website@fortunetradelinks.in>".
 *   QUOTE_TO        Optional. Recipient(s), comma-separated. Default: site.emailSales.
 *
 * In local development (`npm run dev`) without RESEND_API_KEY, the quote is printed to the
 * terminal instead of emailed. In production a missing key or a failed send returns an
 * error, so the visitor sees the error message with the sales email, and the full quote is
 * written to the function log so it isn't lost.
 *
 * Imports use .js extensions: the function runs as an ES module without a bundler.
 */
import { site } from '../src/config/site.js';
import { FIELD_LABELS, toPayload, validate, valuesFromInput, type QuotePayload } from '../src/lib/quote.js';

const MAX_BODY_BYTES = 20_000;
const RESEND_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Fortune Tradelinks Website <website@fortunetradelinks.in>';

/** Messages shown to visitors without JavaScript (the same copy as the form's success and error states). */
const SUCCESS_TEXT =
  'Requirement submitted. Our team will review the details and respond with availability and applicable commercial terms.';
const ERROR_TEXT = `Your requirement couldn't be sent. Check your connection and try again, or email it to ${site.emailSales}.`;

type Result =
  | { status: 200; ok: true; dryRun?: boolean }
  | { status: 400 | 413 | 422 | 500 | 502; ok: false; error: string; fields?: string[] };

export async function POST(request: Request): Promise<Response> {
  const viaForm = !(request.headers.get('content-type') ?? '').includes('application/json');
  const result = await handle(request, viaForm);
  return viaForm ? htmlResponse(result) : Response.json(result, { status: result.status });
}

async function handle(request: Request, viaForm: boolean): Promise<Result> {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return { status: 413, ok: false, error: 'too_large' };
  }

  let input: Record<string, unknown>;
  try {
    if (viaForm) {
      input = Object.fromEntries((await request.formData()).entries());
    } else {
      const body: unknown = await request.json();
      input = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    }
  } catch {
    return { status: 400, ok: false, error: 'bad_request' };
  }

  // The hidden "website" field is only ever filled in by bots: report success, send nothing.
  if (typeof input.website === 'string' && input.website.trim() !== '') {
    return { status: 200, ok: true };
  }

  const { values, tooLong } = valuesFromInput(input);
  // Accept delivery dates from yesterday (UTC), so a visitor's "today" passes in any time zone.
  const earliest = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const errors = validate(values, { today: earliest, dateIncomplete: false });
  const invalid = [...new Set([...tooLong, ...Object.keys(errors)])];
  if (invalid.length) return { status: 422, ok: false, error: 'invalid', fields: invalid };

  const quote = toPayload(values);
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[api/quote] RESEND_API_KEY is not set, so this quote was not emailed (development only):', quote);
      return { status: 200, ok: true, dryRun: true };
    }
    console.error('[api/quote] RESEND_API_KEY is not set. Quote NOT emailed:', JSON.stringify(quote));
    return { status: 500, ok: false, error: 'not_configured' };
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEmail(quote, viaForm)),
    });
    if (!res.ok) {
      console.error(`[api/quote] Resend refused the email (HTTP ${res.status}): ${await res.text()}`);
      console.error('[api/quote] Quote NOT emailed:', JSON.stringify(quote));
      return { status: 502, ok: false, error: 'send_failed' };
    }
  } catch (err) {
    console.error('[api/quote] Could not reach Resend:', err);
    console.error('[api/quote] Quote NOT emailed:', JSON.stringify(quote));
    return { status: 502, ok: false, error: 'send_failed' };
  }

  return { status: 200, ok: true };
}

/** The email to the sales team: every field, with Reply-To set to the buyer. */
function buildEmail(quote: QuotePayload, viaForm: boolean) {
  const to = (process.env.QUOTE_TO || site.emailSales)
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
  const received = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const rows = FIELD_LABELS.filter(([key]) => key in quote).map(([key, label]) => [label, displayValue(key, quote)]);

  const text = [
    `New quote request from the website (received ${received} IST).`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Reply to this email to answer ${quote.contact_name} at ${quote.email}.`,
  ].join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#2e3742">
<p style="margin:0 0 16px">New quote request from the website (received ${escapeHtml(received)} IST).</p>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:640px;width:100%">
${rows
  .map(
    ([label, value]) =>
      `<tr><th align="left" valign="top" style="padding:8px 16px 8px 0;border-bottom:1px solid #d6dee2;color:#032f56;width:38%">${escapeHtml(label)}</th><td valign="top" style="padding:8px 0;border-bottom:1px solid #d6dee2;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
  )
  .join('\n')}
</table>
<p style="margin:16px 0 0;color:#5b6673">Reply to this email to answer ${escapeHtml(quote.contact_name)} at ${escapeHtml(quote.email)}.${viaForm ? ' (Sent without JavaScript.)' : ''}</p>
</div>`;

  return {
    from: process.env.QUOTE_FROM || DEFAULT_FROM,
    to,
    reply_to: quote.email,
    subject: `Quote request: ${quote.quantity_kl} KL – ${quote.company}`,
    text,
    html,
  };
}

function displayValue(key: keyof QuotePayload, quote: QuotePayload): string {
  const value = quote[key];
  if (value === undefined || value === '') return 'Not given';
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  if (key === 'delivery_date') {
    return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
  return String(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Visitors without JavaScript get a plain page with the outcome and a way back. */
function htmlResponse(result: Result): Response {
  const message = result.ok ? SUCCESS_TEXT : ERROR_TEXT;
  const body = `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${result.ok ? 'Requirement submitted' : 'Requirement not sent'} | ${escapeHtml(site.name)}</title>
</head>
<body style="margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:17px;line-height:1.6;color:#2e3742;background:#fff">
<main style="max-width:40rem;margin:0 auto;padding:3rem 1.25rem">
<p style="margin:0 0 1.5rem;font-weight:700;color:#032f56">${escapeHtml(site.name)}</p>
<p style="margin:0 0 1.5rem">${escapeHtml(message)}</p>
<p style="margin:0"><a href="/request-a-quote" style="color:#032f56">Back to Request a Quote</a></p>
</main>
</body>
</html>`;
  return new Response(body, { status: result.status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
