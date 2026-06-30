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
- Browser completion memory so returning visitors are sent to the booking CTA
- Optional GHL contact tag check before AI analysis, so completed contacts do not spend another API call
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
GHL_API_TOKEN=your_ghl_private_integration_token_here
GHL_LOCATION_ID=your_ghl_location_id_here
GHL_API_VERSION=2021-07-28
GHL_COMPLETED_TAG=reprompting-profile-completed
GHL_WEBHOOK_URL=your_ghl_webhook_url_here
NEXT_PUBLIC_CTA_URL=https://your_booking_or_call_link_here
```

`ANTHROPIC_API_KEY` is optional. If it is missing, the app returns a fallback reflective profile.

`GHL_API_TOKEN`, `GHL_LOCATION_ID`, `GHL_API_VERSION`, and `GHL_COMPLETED_TAG` are optional together. When configured, the app checks GHL for the submitted email before running the AI analysis. If the contact already has the completed tag, the visitor sees the booking CTA instead of receiving another profile. The API token stays server-side and must not use `NEXT_PUBLIC_`.

`GHL_WEBHOOK_URL` is optional. If it is missing, the app still works but does not send lead data anywhere.

`NEXT_PUBLIC_CTA_URL` is optional. If it is set, the final result screen opens this URL when the user clicks the booking CTA. It must start with `NEXT_PUBLIC_` because the button runs in the browser.

## Repeat Quiz Prevention

The app checks completion in this order:

1. Browser storage: if the visitor has already completed the quiz on the same browser, they immediately see the booking CTA.
2. GHL contact lookup: if GHL variables are configured, `/api/insight` searches for a contact with the submitted email and checks whether the contact has `GHL_COMPLETED_TAG`.
3. AI analysis: only when neither completion check blocks the user does the app call Anthropic.

The GHL lookup uses LeadConnector's duplicate contact search endpoint, then fetches the contact by ID when needed to read tags.

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
4. Test the quiz once with a new email, then add the completed tag to that GHL contact and test again with the same email.
