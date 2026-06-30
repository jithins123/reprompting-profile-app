# The Reprompting Profile App

A Vercel-ready Next.js app for The Reprompting Project.

## Features

- Branded 14-question Reprompting Profile experience
- Stakes-focused questions that surface pattern cost, momentum, and next-chapter desire
- "Something else" free-text option for every question
- Final reflection question
- Contact capture with consent confirmation
- Educational, non-diagnostic disclaimer language
- AI-generated profile using Anthropic Claude when configured
- Fallback profile when no Anthropic API key is configured
- Optional lead submission to a GHL-compatible webhook
- Final result call-to-action button configured with a public booking URL
- Basic request validation, body-size checks, same-origin checks, and rate limiting on API routes

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Environment Variables

Create `.env.local` for local development or add these in Vercel Project Settings:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GHL_WEBHOOK_URL=your_ghl_webhook_url_here
NEXT_PUBLIC_CTA_URL=https://your_booking_or_call_link_here
```

`ANTHROPIC_API_KEY` is optional. If it is missing, the app returns a fallback reflective profile.

`GHL_WEBHOOK_URL` is optional. If it is missing, the app still works but does not send lead data anywhere.

`NEXT_PUBLIC_CTA_URL` is optional. If it is set, the final result screen opens this URL when the user clicks the booking CTA. It must start with `NEXT_PUBLIC_` because the button runs in the browser.

## Data Handling

The app collects a user's first name, email address, optional phone number, quiz answers, and final reflection. When `ANTHROPIC_API_KEY` is configured, that information is sent to Anthropic to generate the reflective profile. When `GHL_WEBHOOK_URL` is configured, the contact details, answers, reflection, consent timestamp, and generated profile are forwarded to the configured webhook.

The profile is educational and reflective only. It is not a diagnosis, treatment, therapy, clinical assessment, or definitive statement about the user.

## Project Structure

- Questions: `src/lib/questions.ts`
- Main UI: `src/app/page.tsx`
- AI profile API: `src/app/api/insight/route.ts`
- Webhook capture API: `src/app/api/webhook/route.ts`
- Shared API safety helpers: `src/lib/security.ts`
- Styling: `src/app/globals.css`

## Deployment

1. Import this repository into Vercel.
2. Add the environment variables you want to use.
3. Deploy.
4. Test the full quiz flow once with and once without webhook configuration.
